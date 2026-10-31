import * as THREE from './vendor/three.module.js';
import { buildPlant } from './plant.mjs';

const root=document.getElementById('cal-plant');
const viewport=root.querySelector('.plant-viewport');
const canvas=root.querySelector('canvas');
const loading=root.querySelector('.plant-loading');
const select=root.querySelector('select');
const info=root.querySelector('.plant-selection');
const labelLayer=root.querySelector('.plant-labels');
const popover=root.querySelector('.equipment-popover');
const popoverTag=popover.querySelector('.equipment-popover-tag');
const popoverName=popover.querySelector('.equipment-popover-name');
const popoverStatus=popover.querySelector('.equipment-popover-status');
const embedded = new URLSearchParams(location.search).get('embed') === '1';
if (embedded) document.body.classList.add('embedded');
function send(type, payload = {}) {
  if (embedded && window.parent !== window) window.parent.postMessage({source:'cal-plant',type,...payload}, location.origin);
}

try {
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.12;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#0b192a');
  scene.fog=new THREE.FogExp2('#0b192a',0.0025);
  const camera=new THREE.PerspectiveCamera(37,1,0.3,750);
  const hemi=new THREE.HemisphereLight('#d2e9ff','#182b41',1.55);
  scene.add(hemi);
  const sun=new THREE.DirectionalLight('#eaf3ff',2.5);
  sun.position.set(-25,65,40);
  sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-90,right:90,top:60,bottom:-60,near:1,far:170});
  sun.shadow.bias=-0.00035;
  sun.shadow.normalBias=0.05;
  scene.add(sun);
  const rim=new THREE.DirectionalLight('#63b7ff',2.3);rim.position.set(15,28,-45);scene.add(rim);
  const warm=new THREE.DirectionalLight('#ffd9a0',0.7);warm.position.set(55,22,10);scene.add(warm);

  // A small, locally generated studio environment gives metal legible reflections.
  const envScene=new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(100,16,12),new THREE.MeshBasicMaterial({color:'#65798d',side:THREE.BackSide})));
  for(const [x,y,z,sx,sy,sz,power] of [[0,45,0,70,1,25,3],[-40,10,25,1,28,50,2],[35,8,-35,32,18,1,1.2]]){
    const emitter=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),new THREE.MeshBasicMaterial({color:new THREE.Color(power,power,power)}));
    emitter.position.set(x,y,z);envScene.add(emitter);
  }
  const pmrem=new THREE.PMREMGenerator(renderer);
  const environment=pmrem.fromScene(envScene,0.04);
  scene.environment=environment.texture;pmrem.dispose();
  envScene.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});

  const base=new THREE.Mesh(new THREE.BoxGeometry(146,1.3,54),new THREE.MeshStandardMaterial({color:'#182b37',roughness:0.92,metalness:0.12}));
  base.position.y=-0.76;base.receiveShadow=true;scene.add(base);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1200,1200),new THREE.MeshStandardMaterial({color:'#111e2b',roughness:0.87}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-1.45;ground.receiveShadow=true;scene.add(ground);
  const gridPositions=[];
  for(let x=-70;x<=70;x+=5){gridPositions.push(x,-0.099,-25,x,-0.099,25);}
  for(let z=-25;z<=25;z+=5){gridPositions.push(-72,-0.099,z,72,-0.099,z);}
  const gridGeo=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(gridPositions,3));
  scene.add(new THREE.LineSegments(gridGeo,new THREE.LineBasicMaterial({color:'#547080',transparent:true,opacity:0.16})));
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(base.geometry),new THREE.LineBasicMaterial({color:'#537f96',transparent:true,opacity:0.4}));edge.position.copy(base.position);scene.add(edge);

  const plant=buildPlant(THREE,scene);
  const equipment=plant.equipment;
  const sectors={britagem:'Britagem',moagem:'Moagem'};
  for(const item of equipment){
    item.object.traverse(o=>{if(o.isMesh)o.userData.equipmentId=item.id;});
    const option=document.createElement('option');option.value=item.id;
    option.textContent=`${sectors[item.sector]||item.sector} · ${item.tag}`;select.appendChild(option);
    const label=document.createElement(embedded?'button':'span');label.className='equipment-label';label.textContent=item.tag;label.hidden=true;
    if (embedded) { label.type='button'; label.setAttribute('aria-label', `${sectors[item.sector]} · ${item.tag}`); label.addEventListener('click',()=>choose(item.id)); }
    labelLayer.appendChild(label);item.label=label;
  }
  const itemsById=new Map(equipment.map(e=>[e.id,e]));
  const equipmentStatuses=new Map();
  const focusBox=new THREE.Box3Helper(new THREE.Box3(),new THREE.Color('#84d4e0'));focusBox.visible=false;scene.add(focusBox);
  const sphere=new THREE.Spherical();
  let view='all',selected=null,labelsOn=true,running=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width=1,height=1,elapsed=0,frameCount=0,last=performance.now();
  const desired={target:new THREE.Vector3(0,7,0),theta:0.22,phi:1.06,radius:157};
  const current={target:desired.target.clone(),theta:desired.theta,phi:desired.phi,radius:desired.radius};
  const pauseButton=root.querySelector('.plant-pause');
  function updatePause(){pauseButton.textContent=running?'Pausar':'Reproduzir';pauseButton.setAttribute('aria-pressed',String(!running));}
  updatePause();
  pauseButton.addEventListener('click',()=>{running=!running;updatePause();saveState();});
  root.querySelector('input').addEventListener('change',event=>{labelsOn=event.target.checked;saveState();});
  function fitRadius(w,h){return Math.max(h/(2*Math.tan(camera.fov*Math.PI/360)),w/(2*Math.tan(camera.fov*Math.PI/360)*camera.aspect))*1.12;}
  function setView(next){
    view=next;selected=null;select.value='';info.hidden=true;popover.hidden=true;focusBox.visible=false;
    const config=next==='crushing'?{at:[-34,7,0],theta:0.29,phi:1.15,w:70,h:38}:next==='milling'?{at:[43,7,0],theta:0.32,phi:1.27,w:40,h:27}:{at:[0,5.5,0],theta:0.16,phi:1.2,w:136,h:46};
    desired.target.set(...config.at);desired.theta=config.theta;desired.phi=config.phi;desired.radius=fitRadius(config.w,config.h);
    root.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
  }
  root.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{setView(button.dataset.view);saveState();}));
  function choose(id,zoom=false,notify=true){
    const item=itemsById.get(id);if(!item)return;
    selected=item;select.value=id;info.replaceChildren();
    const tag=document.createElement('strong');tag.textContent=item.tag;
    info.append(tag,document.createTextNode(` · ${item.name} · ${sectors[item.sector]||item.sector}`));info.hidden=false;
    popoverTag.textContent=item.tag;popoverName.textContent=item.name;
    const status=equipmentStatuses.get(item.id)||{label:'Status indisponível',color:'#91a7bf'};
    popoverStatus.textContent=status.label;popover.style.setProperty('--equipment-status',status.color);popover.hidden=!embedded;
    focusBox.box.setFromObject(item.object);focusBox.box.expandByScalar(0.2);focusBox.visible=true;
    if(notify)send('select',{id});
    if(zoom){
      const size=focusBox.box.getSize(new THREE.Vector3());focusBox.box.getCenter(desired.target);
      desired.target.y=Math.max(desired.target.y,3);
      desired.radius=fitRadius(Math.max(16,size.x*1.8),Math.max(15,size.y*2.1));
    }
  }
  popover.querySelector('.equipment-popover-close').addEventListener('click',()=>{popover.hidden=true;});
  popover.querySelector('.equipment-popover-event').addEventListener('click',()=>{if(selected)send('event',{id:selected.id});});
  select.addEventListener('change',()=>{if(select.value)choose(select.value,true);else setView(view);saveState();});
  function saveState(){
    window.openai?.setWidgetState?.({modelContent:{view,selected:selected?.id||null,animationRunning:running},privateContent:{labelsOn}})?.catch(()=>{});
  }

  const pointers=new Map();let moved=false,startPoint=null,lastPinch=0;
  canvas.addEventListener('pointerdown',event=>{
    canvas.setPointerCapture(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    startPoint={x:event.clientX,y:event.clientY};moved=false;
    if(pointers.size===2){const p=[...pointers.values()];lastPinch=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
  });
  canvas.addEventListener('pointermove',event=>{
    if(!pointers.has(event.pointerId))return;
    const old=pointers.get(event.pointerId),dx=event.clientX-old.x,dy=event.clientY-old.y;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(startPoint&&Math.hypot(event.clientX-startPoint.x,event.clientY-startPoint.y)>5)moved=true;
    if(pointers.size===2){const p=[...pointers.values()],distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(lastPinch>0)desired.radius=THREE.MathUtils.clamp(desired.radius*lastPinch/Math.max(1,distance),12,600);lastPinch=distance;moved=true;}
    else{desired.theta-=dx*0.005;desired.phi=THREE.MathUtils.clamp(desired.phi-dy*0.004,0.28,1.48);}
  });
  const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
  canvas.addEventListener('pointerup',event=>{
    pointers.delete(event.pointerId);
    if(!moved&&pointers.size===0){
      const rect=canvas.getBoundingClientRect();mouse.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
      raycaster.setFromCamera(mouse,camera);
      const hit=raycaster.intersectObjects(equipment.map(e=>e.object),true).find(h=>h.object.userData.equipmentId);
      if(hit){choose(hit.object.userData.equipmentId);saveState();}
      else{selected=null;select.value='';info.hidden=true;popover.hidden=true;focusBox.visible=false;send('select',{id:null});}
    }
  });
  canvas.addEventListener('pointercancel',event=>pointers.delete(event.pointerId));
  canvas.addEventListener('wheel',event=>{event.preventDefault();desired.radius=THREE.MathUtils.clamp(desired.radius*Math.exp(event.deltaY*0.001),12,600);},{passive:false});
  canvas.addEventListener('contextmenu',event=>event.preventDefault());
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();running=false;updatePause();loading.textContent='A visualização 3D foi interrompida. Recarregue a prévia para continuar.';loading.hidden=false;send('error');});

  function resize(){
    const rect=viewport.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
    camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);
    const previousId=selected?.id;
    setView(view);
    if(previousId)choose(previousId,false,false);
    if(frameCount===0){current.target.copy(desired.target);current.radius=desired.radius;current.theta=desired.theta;current.phi=desired.phi;}
  }
  const observer=new ResizeObserver(resize);observer.observe(viewport);resize();
  const saved=window.openai?.widgetState;
  function restore(state){
    if(!state)return;
    const m=state.modelContent||{},p=state.privateContent||{};
    if(['all','crushing','milling'].includes(m.view))setView(m.view);
    if(typeof m.animationRunning==='boolean'){running=m.animationRunning;updatePause();}
    if(typeof p.labelsOn==='boolean'){labelsOn=p.labelsOn;root.querySelector('input').checked=labelsOn;}
    if(itemsById.has(m.selected))choose(m.selected);
  }
  restore(saved);
  function reportReady(){send('ready',{equipment:equipment.map(({id,tag,name,sector})=>({id,tag,name,sector}))});}
  window.addEventListener('message',event=>{
    if (!embedded || event.origin!==location.origin || event.source!==window.parent || event.data?.source!=='cal-dashboard') return;
    const message=event.data;
    if (message.type==='hello' && root.dataset.ready==='true') reportReady();
    if (message.type!=='state') return;
    if (['all','crushing','milling'].includes(message.view) && message.view!==view) setView(message.view);
    if (typeof message.paused==='boolean') {running=!message.paused;updatePause();}
    if (typeof message.labels==='boolean') labelsOn=message.labels;
    if (message.selectedId===null) {selected=null;select.value='';info.hidden=true;popover.hidden=true;focusBox.visible=false;}
    else if (itemsById.has(message.selectedId) && selected?.id!==message.selectedId) choose(message.selectedId,false,false);
    if(Array.isArray(message.statuses)) for(const status of message.statuses){
      const item=itemsById.get(status?.id);
      if(item && typeof status.color==='string' && /^#[0-9a-f]{6}$/i.test(status.color)){
        item.label.style.setProperty('--equipment-status',status.color);
        equipmentStatuses.set(item.id,{color:status.color,label:typeof status.label==='string'?status.label:'Status indisponível'});
        if(selected===item){popoverStatus.textContent=equipmentStatuses.get(item.id).label;popover.style.setProperty('--equipment-status',status.color);}
      }
    }
  });
  window.addEventListener('openai:set_globals',event=>{if(event.detail?.globals?.widgetState)restore(event.detail.globals.widgetState);});

  const projection=new THREE.Vector3();
  const overviewTags=new Set(['MO-01','BR-01','BR-03','PV-02','SL-01','MM-01','MM-05','FM-02','P-PULMAO','UH-BR03','TC-05']);
  function positionLabels(){
    const occupied=[];
    const sorted=selected?[selected,...equipment.filter(e=>e!==selected)]:equipment;
    for(const item of sorted){
      const activeSector=view==='crushing'?'britagem':view==='milling'?'moagem':null;
      const visible=labelsOn&&(item===selected||(!activeSector?overviewTags.has(item.tag):item.sector===activeSector));
      if(!visible){item.label.hidden=true;if(item===selected)popover.style.visibility='hidden';continue;}
      projection.copy(item.anchor).project(camera);
      const x=(projection.x/2+0.5)*width,y=(-projection.y/2+0.5)*height-16;
      const labelWidth=item.tag.length*6.6+14,left=x-labelWidth/2,top=y-18;
      const rect={left:left-5,top:top-4,right:left+labelWidth+5,bottom:y+8};
      const collision=occupied.some(r=>rect.left<r.right&&rect.right>r.left&&rect.top<r.bottom&&rect.bottom>r.top);
      if(projection.z>1||projection.z<0||left<5||left+labelWidth>width-5||top<90||y>height-55||collision){item.label.hidden=true;if(item===selected)popover.style.visibility='hidden';continue;}
      item.label.hidden=false;item.label.classList.toggle('is-selected',item===selected);
      item.label.style.transform=`translate(${left.toFixed(1)}px,${top.toFixed(1)}px)`;occupied.push(rect);
      if(item===selected&&!popover.hidden){
        popover.style.visibility='visible';
        const popoverWidth=Math.min(210,width-20);let popoverLeft=Math.min(width-popoverWidth-10,Math.max(10,left+labelWidth+8));
        if(popoverLeft<left+labelWidth&&left-popoverWidth-8>=10)popoverLeft=left-popoverWidth-8;
        const popoverTop=Math.min(height-142,Math.max(10,top-14));
        popover.style.width=`${popoverWidth}px`;popover.style.transform=`translate(${popoverLeft.toFixed(1)}px,${popoverTop.toFixed(1)}px)`;
      }
    }
  }
  function animate(now){
    if(!root.isConnected){observer.disconnect();renderer.dispose();environment.dispose();return;}
    requestAnimationFrame(animate);
    const delta=Math.min((now-last)/1000,0.05);last=now;if(document.hidden)return;
    const ease=1-Math.exp(-delta*7);
    current.target.lerp(desired.target,ease);
    current.theta=THREE.MathUtils.lerp(current.theta,desired.theta,ease);
    current.phi=THREE.MathUtils.lerp(current.phi,desired.phi,ease);
    current.radius=THREE.MathUtils.lerp(current.radius,desired.radius,ease);
    sphere.set(current.radius,current.phi,current.theta);
    camera.position.setFromSpherical(sphere).add(current.target);camera.lookAt(current.target);camera.updateMatrixWorld();
    if(running)elapsed+=delta;
    plant.update(elapsed,running?delta:0,running);
    renderer.render(scene,camera);positionLabels();frameCount++;
    if(frameCount===2){loading.hidden=true;root.dataset.ready='true';reportReady();}
  }
  requestAnimationFrame(animate);
  // Read-only diagnostics for this standalone preview, without production connections.
  window.calPlantPreview={get diagnostics(){return {ready:root.dataset.ready==='true',equipment:equipment.length,uniqueIds:itemsById.size,animatedTime:elapsed,running,view,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,width,height};}};
} catch(error){
  send('error');
  loading.textContent='Não foi possível abrir a cena 3D neste navegador. Ative a aceleração gráfica e recarregue a prévia.';
  loading.setAttribute('role','alert');console.error('Planta 3D:',error);
}
