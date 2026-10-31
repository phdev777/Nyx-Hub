// Architectural interpretation of the supplied photographs, not an engineering model.
// Routes, dimensions and motion are illustrative. Tags follow the supplied inventory.
export function buildPlant(THREE, scene) {
  const equipment = [], motors = [], screens = [], belts = [], falls = [];
  const V = (x,y,z) => new THREE.Vector3(x,y,z);
  const material = (color, roughness=.65, metalness=.5) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const M = {
    steel:material('#2b6388',.46,.72), steelDark:material('#244356',.6,.7),
    zinc:material('#b0bdc4',.48,.72), zincDark:material('#71818d',.55,.75),
    yellow:material('#eab83a',.48,.55), rubber:material('#192025',.95,.02),
    green:material('#527b67',.5,.58), greenDark:material('#2e574a',.6,.6),
    concrete:material('#8b9399',.95,.0), stone:material('#697480',1,.05),
    darkStone:material('#47515b',1,.04), rust:material('#916d4e',.86,.25),
    glass:new THREE.MeshStandardMaterial({color:'#83b5c6',roughness:.24,metalness:.45}),
    light:new THREE.MeshStandardMaterial({color:'#fff3d5',emissive:'#ffe2ad',emissiveIntensity:2.7}),
    red:material('#ae5c3c',.65,.35)
  };
  const geo = {
    box:new THREE.BoxGeometry(1,1,1), cylinder:new THREE.CylinderGeometry(1,1,1,16),
    sphere:new THREE.SphereGeometry(1,12,8), pebble:new THREE.IcosahedronGeometry(1,0)
  };
  const arch = new THREE.Group(); arch.name='Estruturas e fundações'; scene.add(arch);
  function mesh(g, geometry, mat, x=0,y=0,z=0,sx=1,sy=1,sz=1) {
    const m=new THREE.Mesh(geometry,mat); m.position.set(x,y,z); m.scale.set(sx,sy,sz);
    m.castShadow=true; m.receiveShadow=true; g.add(m); return m;
  }
  const box=(g,x,y,z,w,h,d,mat=M.steel)=>mesh(g,geo.box,mat,x,y,z,w,h,d);
  const cyl=(g,x,y,z,r,h,mat=M.zinc)=>mesh(g,geo.cylinder,mat,x,y,z,r,h,r);
  function beam(g,a,b,size=.13,mat=M.steel) {
    const dir=b.clone().sub(a), ob=box(g,...a.clone().add(b).multiplyScalar(.5).toArray(),size,dir.length(),size,mat);
    ob.quaternion.setFromUnitVectors(V(0,1,0),dir.normalize()); return ob;
  }
  function pipe(g,a,b,r=.14,mat=M.zinc) {
    const dir=b.clone().sub(a),ob=mesh(g,geo.cylinder,mat,...a.clone().add(b).multiplyScalar(.5).toArray(),r,dir.length(),r);
    ob.quaternion.setFromUnitVectors(V(0,1,0),dir.normalize());return ob;
  }
  function eq(sector,tag,name,x,y,z) {
    const g=new THREE.Group();g.position.set(x,y,z);g.name=tag+' · '+name;scene.add(g);
    const entry={id:sector+':'+tag,tag,name,sector,object:g,anchor:V(x,y+2,z)};
    g.userData.equipmentId=entry.id;equipment.push(entry);return g;
  }
  function rail(g,a,b) {
    beam(g,a.clone().add(V(0,1.12,0)),b.clone().add(V(0,1.12,0)),.055,M.yellow);
    beam(g,a.clone().add(V(0,.55,0)),b.clone().add(V(0,.55,0)),.04,M.yellow);
    const n=Math.ceil(a.distanceTo(b)/2);
    for(let i=0;i<=n;i++){const p=a.clone().lerp(b,i/n);beam(g,p,p.clone().add(V(0,1.16,0)),.065,M.yellow);}
  }
  function platform(g,x,y,z,w,d,rails=true) {
    box(g,x,y,z,w,.15,d,M.zincDark);
    box(g,x,y-.24,z-d/2,w,.35,.17);box(g,x,y-.24,z+d/2,w,.35,.17);
    for(let k=-w/2;k<=w/2;k+=1.5)box(g,x+k,y+.09,z,.035,.025,d,M.zinc);
    if(rails){
      rail(g,V(x-w/2,y,z-d/2),V(x+w/2,y,z-d/2));
      rail(g,V(x-w/2,y,z+d/2),V(x+w/2,y,z+d/2));
      rail(g,V(x-w/2,y,z-d/2),V(x-w/2,y,z+d/2));
      rail(g,V(x+w/2,y,z-d/2),V(x+w/2,y,z+d/2));
    }
  }
  function frame(g,x,z,w,d,height,levels=[height]) {
    for(const dx of [-w/2,w/2])for(const dz of [-d/2,d/2]){
      box(g,x+dx,.23,z+dz,.9,.46,.9,M.concrete);
      box(g,x+dx,height/2,z+dz,.23,height,.27);
      box(g,x+dx,.51,z+dz,.55,.1,.55,M.zinc);
    }
    for(const h of levels){
      for(const dz of [-d/2,d/2])box(g,x,h,z+dz,w,.32,.19);
      for(const dx of [-w/2,w/2])box(g,x+dx,h,z,.2,.32,d);
    }
    for(const dz of [-d/2,d/2]){
      beam(g,V(x-w/2,.55,z+dz),V(x+w/2,height,z+dz),.13);
      beam(g,V(x+w/2,.55,z+dz),V(x-w/2,height,z+dz),.13);
    }
    beam(g,V(x-w/2,.5,z-d/2),V(x-w/2,height,z+d/2),.13);
  }
  function stairs(g,x,z,height,length,width=1.3) {
    const count=Math.ceil(height/.27);
    for(let i=0;i<count;i++)box(g,x+(i+.5)*length/count,(i+.5)*height/count,z,length/count+.035,.12,width,M.zincDark);
    for(const dz of [-width/2,width/2]){
      beam(g,V(x,0,z+dz),V(x+length,height,z+dz),.15,M.steel);
      rail(g,V(x,0,z+dz),V(x+length,height,z+dz));
    }
  }
  function ladder(g,x,z,y0,y1) {
    beam(g,V(x-.35,y0,z),V(x-.35,y1,z),.065,M.yellow);
    beam(g,V(x+.35,y0,z),V(x+.35,y1,z),.065,M.yellow);
    for(let y=y0;y<y1;y+=.32)beam(g,V(x-.35,y,z),V(x+.35,y,z),.05,M.yellow);
  }
  function motor(g,x,y,z,scale=1) {
    box(g,x,y-.33*scale,z,1.5*scale,.16*scale,.95*scale,M.zincDark);
    const body=cyl(g,x,y,z,.42*scale,1.15*scale,M.steelDark);body.rotation.z=Math.PI/2;
    for(let i=0;i<7;i++){const fin=cyl(g,x+(-.45+i*.15)*scale,y,z,.47*scale,.05*scale,M.zincDark);fin.rotation.z=Math.PI/2;}
    const rotor=new THREE.Group();rotor.position.set(x+.65*scale,y,z);rotor.userData.dynamic=true;g.add(rotor);
    const ring=mesh(rotor,new THREE.TorusGeometry(.33*scale,.045*scale,6,16),M.zinc);ring.rotation.y=Math.PI/2;
    for(let i=0;i<4;i++){const blade=box(rotor,0,0,0,.055*scale,.63*scale,.095*scale,M.zinc);blade.rotation.x=i*Math.PI/4;}
    motors.push({object:rotor,axis:'x',speed:5.4});return rotor;
  }
  function hopper(g,x,y,z,w=4,d=3,h=3) {
    const geom=new THREE.CylinderGeometry(1,.3,1,4,1,true);geom.rotateY(Math.PI/4);
    mesh(g,geom,M.zinc,x,y,z,w/Math.SQRT2,h,d/Math.SQRT2);
    for(const dx of [-w/2,w/2])box(g,x+dx,y+h/2,z,.15,.2,d,M.steelDark);
    for(const dz of [-d/2,d/2])box(g,x,y+h/2,z+dz,w,.2,.15,M.steelDark);
    box(g,x,y+h/2-.25,z,w*.72,.08,d*.72,M.darkStone);
    box(g,x,y-h/2-.55,z,w*.24,1.1,d*.24,M.zincDark);
  }
  function roof(g,x,y,z,w,d) {
    const pitch=.13;
    for(const sign of [-1,1]){
      const p=box(g,x,y-d*.0325,z+sign*d/4,w,.13,d/2+.25,M.zinc);p.rotation.x=sign*pitch;
      for(let xx=x-w/2;xx<x+w/2;xx+=.58){const ridge=box(g,xx,y-d*.0325+.1,z+sign*d/4,.055,.06,d/2+.25,M.zincDark);ridge.rotation.x=sign*pitch;}
    }
    for(let xx=x-w/2;xx<=x+w/2;xx+=w/4){
      beam(g,V(xx,y-.8,z-d/2),V(xx,y,z),.16,M.steel);
      beam(g,V(xx,y,z),V(xx,y-.8,z+d/2),.16,M.steel);
      beam(g,V(xx,y-.8,z-d/2),V(xx,y-.8,z+d/2),.12,M.steel);
    }
  }
  function flood(g,x,y,z,sign=1) {
    box(g,x,y,z,.12,1.2,.12,M.zincDark);
    const lamp=box(g,x,y+.57,z+sign*.2,.75,.3,.12,M.light);lamp.rotation.x=-sign*.4;
  }
  function conveyor(sector,tag,a,b,width=1.15) {
    const g=eq(sector,tag,'Transportador de correia',0,0,0);
    const dir=b.clone().sub(a),len=dir.length(),dx=dir.clone().normalize();
    const side=new THREE.Vector3().crossVectors(dx,V(0,1,0)).normalize();
    const up=new THREE.Vector3().crossVectors(side,dx).normalize();
    const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(dx,up,side));
    const local=new THREE.Group();local.position.copy(a);local.quaternion.copy(q);g.add(local);
    box(local,len/2,0,0,len,.13,width,M.rubber);
    box(local,len/2,-.54,0,len,.09,width*.97,M.rubber);
    for(const sign of [-1,1]){
      box(local,len/2,-.24,sign*(width/2+.17),len,.11,.12,M.steel);
      box(local,len/2,-1.0,sign*(width/2+.17),len,.11,.12,M.steel);
      const n=Math.ceil(len/1.8);
      for(let i=0;i<n;i++)beam(local,V(i*len/n,-1,sign*(width/2+.17)),V((i+1)*len/n,-.24,sign*(width/2+.17)),.07,M.zincDark);
    }
    for(let x=.3;x<len;x+=1.55){const r=cyl(local,x,-.12,0,.115,width+.35,M.zincDark);r.rotation.x=Math.PI/2;}
    for(const x of [0,len]){const wheel=cyl(local,x,-.27,0,.28,width+.45,M.zinc);wheel.rotation.x=Math.PI/2;}
    // Narrow access walkway along one side, with a continuous yellow handrail.
    box(local,len/2,-.22,width/2+.62,len,.07,.6,M.zincDark);
    rail(local,V(0,-.18,width/2+.91),V(len,-.18,width/2+.91));
    for(let t=.18;t<1;t+=Math.max(.15,6/len)){
      const p=a.clone().lerp(b,t);const offset=side.clone().multiplyScalar(width/2+.35);
      for(const s of [-1,1]){const top=p.clone().addScaledVector(offset,s).add(V(0,-.9,0));beam(g,V(top.x,.3,top.z),top,.19);box(g,top.x,.2,top.z,.85,.4,.85,M.concrete);}
      const left=p.clone().sub(offset),right=p.clone().add(offset);
      beam(g,V(left.x,.5,left.z),V(right.x,p.y-.9,right.z),.11,M.zincDark);
    }
    motor(local,len-.7,-.02,-width/2-.65,.52);
    // Gravel is geometry carried on the belt, without emitted route lines.
    const count=Math.max(20,Math.floor(len*2.1));
    const gravel=new THREE.InstancedMesh(geo.pebble,M.stone,count);gravel.userData.dynamic=true;gravel.castShadow=true;gravel.receiveShadow=true;local.add(gravel);
    belts.push({mesh:gravel,count,len,width,seed:belts.length*31});
    const fall=new THREE.InstancedMesh(geo.pebble,M.stone,12);fall.userData.dynamic=true;fall.castShadow=true;g.add(fall);
    falls.push({mesh:fall,point:b.clone().addScaledVector(dx,.28),height:Math.min(2.1,Math.max(.5,b.y-.2)),seed:falls.length});
    const entry=equipment[equipment.length-1];entry.anchor.copy(a).lerp(b,.55).add(V(0,1.7,0));
    return g;
  }
  function silo(sector,tag,x,z,y=5,r=2.1,h=5) {
    const g=eq(sector,tag,'Silo de transferência',x,0,z);frame(g,0,0,r*2.3,r*2.3,y,[y]);
    cyl(g,0,y+h/2,0,r,h,M.zinc);mesh(g,new THREE.CylinderGeometry(r,.38,2.5,20),M.zinc,0,y-1.25,0);
    cyl(g,0,y+h+.08,0,r+.08,.16,M.zincDark);
    for(let i=0;i<3;i++)cyl(g,0,y+1+i*(h-1)/2,0,r+.045,.1,M.steelDark);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;box(g,Math.cos(a)*(r+.01),y+h/2,Math.sin(a)*(r+.01),.045,h,.045,M.zincDark);}
    platform(g,0,y+h+.2,0,r*2.4,r*2.4);ladder(g,-r*1.22,0,.6,y+h+1.2);
    equipment[equipment.length-1].anchor.set(x,y+h+1.8,z);return g;
  }
  function screen(sector,tag,name,x,y,z,w=3.5,d=2.3) {
    const g=eq(sector,tag,name,x,y,z);const moving=new THREE.Group();moving.userData.dynamic=true;g.add(moving);
    box(moving,0,.6,0,w,.85,d,M.green);box(moving,0,1.07,0,w*.9,.09,d*.85,M.darkStone);
    for(let k=-w/2+.3;k<w/2;k+=.32)box(moving,k,1.15,0,.045,.04,d*.86,M.zinc);
    for(const xx of [-w*.36,w*.36])for(const zz of [-d*.36,d*.36]){
      cyl(g,xx,.13,zz,.16,.33,M.yellow);box(g,xx,-.22,zz,.24,.55,.24,M.steelDark);
    }
    motor(moving,0,.7,-d/2-.6,.62);screens.push({object:moving,base:moving.position.y,phase:screens.length});return g;
  }
  function crusher(tag,x,y,z,primary=false) {
    const g=eq('britagem',tag,primary?'Britador primário':'Britador',x,y,z);
    box(g,0,.35,0,3.3,.7,2.9,M.zincDark);
    if(primary){
      box(g,0,1.5,0,2.6,2.4,2.45,M.greenDark);hopper(g,0,3.2,0,3,2.7,1.5);
      for(const zz of [-1.46,1.46]){const w=cyl(g,0,1.65,zz,1.05,.25,M.yellow);w.rotation.x=Math.PI/2;
        const rotor=new THREE.Group();rotor.position.set(0,1.65,zz+.15);rotor.userData.dynamic=true;g.add(rotor);
        for(let i=0;i<4;i++){const s=box(rotor,0,0,0,.12,1.75,.08,M.steelDark);s.rotation.z=i*Math.PI/4;}motors.push({object:rotor,axis:'z',speed:1.9});}
    }else{
      cyl(g,0,1.0,0,1.45,1.2,M.greenDark);mesh(g,new THREE.CylinderGeometry(.6,1.3,1.4,16),M.green,0,2.2,0);
      cyl(g,0,2.95,0,.95,.22,M.zincDark);hopper(g,0,3.5,0,2.3,2.3,.8);
    }
    motor(g,2.1,.9,0,.9);return g;
  }
  function cabin(sector,tag,name,x,z,w=5,d=3.5) {
    const g=eq(sector,tag,name,x,0,z);box(g,0,.22,0,w+.7,.44,d+.7,M.concrete);
    box(g,0,1.7,0,w,3,d,M.zinc);box(g,0,3.25,0,w+.25,.15,d+.25,M.steelDark);
    for(let xx=-w/2+.7;xx<w/2-.5;xx+=1.05)box(g,xx,2.1,d/2+.03,.8,.9,.045,M.glass);
    box(g,-w/2+.7,.98,d/2+.07,.8,1.75,.1,M.steelDark);
    for(let xx=-w/2+.25;xx<w/2;xx+=.3)box(g,xx,1.7,-d/2-.015,.022,2.95,.025,M.zincDark);
    flood(g,w/2-.4,2.6,d/2+.05);return g;
  }

  // BRITAGEM — multi-level primary crusher and recirculation screen structures.
  box(arch,-47,.08,-3,25,.16,20,M.concrete);
  frame(arch,-49,-4,8.5,7.5,9.4,[3.5,6.7,9.4]);
  platform(arch,-49,3.5,-4,9.2,8.1);platform(arch,-49,6.7,-4,9.2,8.1);
  platform(arch,-49,9.4,-4,9.2,8.1);
  stairs(arch,-58,2,3.5,5);stairs(arch,-53,2,3.2,5);
  const feed=eq('britagem','MO-01','Moega de alimentação',-52,9.6,-4);
  hopper(feed,0,1.55,0,5.4,4.3,3.1);
  box(feed,-3.4,1.2,0,1.1,2.5,5.1,M.concrete);
  crusher('BR-01',-47,6.9,-4,true);
  screen('britagem','AV-01','Alimentador vibratório',-52,6.7,-4,3.8,2.1);
  const breaker=eq('britagem','PH-01','Rompedor hidráulico',-44.7,9.5,-6.5);
  cyl(breaker,0,.25,0,.6,.5,M.yellow);beam(breaker,V(0,.4,0),V(-.6,2.7,0),.38,M.yellow);
  beam(breaker,V(-.6,2.7,0),V(-3.1,3.1,0),.32,M.yellow);beam(breaker,V(-3.1,3.1,0),V(-3.6,1.2,0),.25,M.zincDark);
  pipe(breaker,V(-.1,1.1,.25),V(-2,2.8,.25),.1,M.zinc);pipe(breaker,V(-1,2.8,.23),V(-3.2,2,.23),.08,M.zinc);
  cabin('britagem','COMANDO','Sala de comando',-44,-10.7,3.4,3);
  screen('britagem','GV-01','Grelha vibratória',-54,3.7,-2,3.1,2.6);
  screen('britagem','PV-01','Peneira vibratória',-49,3.8,-1,4.2,2.6);
  crusher('BR-02',-44,0,-.5);crusher('BR-03',-37,0,1.5);
  frame(arch,-39,-5.5,5.4,4.4,5.5,[5.5]);platform(arch,-39,5.5,-5.5,5.9,5);
  silo('britagem','SL-01',-38.8,-5.5,6,1.8,4.4);
  screen('britagem','AV-02','Alimentador vibratório',-38.8,2.3,-5.5,3,1.7);
  const bl=eq('britagem','BL-01','Conjunto auxiliar BL-01',-40,0,4.5);box(bl,0,.65,0,2.1,1.3,1.7,M.zincDark);motor(bl,0,1.65,0,.8);
  const hydraulic=eq('britagem','UH-BR03','Unidade hidráulica BR-03',-37,0,8.1);
  box(hydraulic,0,.9,0,2.15,1.8,1.5,M.zincDark);
  box(hydraulic,0,1.86,0,1.85,.08,1.2,M.zinc);
  for(const dx of [-.72,.72]){cyl(hydraulic,dx,1.28,-.48,.22,.75,M.steelDark);cyl(hydraulic,dx,1.28,.48,.22,.75,M.steelDark);}
  pipe(hydraulic,V(-.82,1.75,0),V(-.82,3.2,0),.11,M.yellow);
  pipe(hydraulic,V(.82,1.75,0),V(.82,3.2,0),.11,M.yellow);
  cabin('britagem','CCM','Centro de controle de motores',-45,9,8,3.4);
  for(let i=0;i<5;i++){box(arch,-47.7+i*1.3,1.6,10.73,1.1,2.3,.08,M.steelDark);box(arch,-47.7+i*1.3,2.2,10.8,.12,.2,.04,M.yellow);}
  frame(arch,-15,-2,5.6,5,7.2,[3.4,7.2]);platform(arch,-15,7.2,-2,6.5,5.7);
  screen('britagem','PV-02','Peneira vibratória',-15,7.4,-2,4.6,2.7);
  screen('britagem','PV-03','Peneira vibratória',-13,2.2,2,4.2,2.7);
  const dm=eq('britagem','DM-01','Detector de metais',-26,4.2,3.9);
  for(const z of [-.9,.9])box(dm,0,.5,z,.22,1.4,.22,M.yellow);box(dm,0,1.15,0,.45,.2,2.05,M.yellow);
  conveyor('britagem','TC-01',V(-55,1,-.5),V(-45,2.4,-.5));
  conveyor('britagem','TC-02',V(-37,1.7,3.8),V(-15,7,0));
  conveyor('britagem','TC-03',V(-38.8,9.1,-5.5),V(-15,6,-2.2));
  conveyor('britagem','TC-04',V(-15,5,0),V(-12,2.2,6));
  conveyor('britagem','TC-06',V(-11,1.35,6),V(-4,3.1,3));
  conveyor('britagem','TC-07',V(-4,3.1,3),V(4,6,-1));
  conveyor('britagem','TC-05',V(-10,2.2,6),V(16,15,-6),1.3);

  // Sheltered intermediate stockpile. Mesh surface is deterministic and faceted.
  const pile=eq('britagem','P-PULMAO','Pilha pulmão',12,0,-6);
  const pileGeo=new THREE.ConeGeometry(8.2,7.8,32,7, false);const pos=pileGeo.attributes.position;
  for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),y=pos.getY(i);const n=Math.sin(x*1.9+z*2.7)*.11+Math.cos(z*3.2-x)*.07;pos.setXYZ(i,x*(1+n),y+Math.abs(x+z)*.016,z*(1+n)*.76);}pileGeo.computeVertexNormals();
  mesh(pile,pileGeo,M.darkStone,0,3.9,0);equipment[equipment.length-1].anchor.set(12,8,-6);
  // Stockpile shed: complete portal frames, with every brace meeting a beam.
  // Roof planes share the exact ridge/eave coordinates; flashing frames the belt
  // penetration instead of letting the conveyor intersect solid roofing.
  const shed=new THREE.Group();shed.name='Galpão da pilha pulmão';arch.add(shed);
  const ridgeY=12.1,centerZ=-6,roofSlope=Math.tan(.13),eaveY=ridgeY-roofSlope*8-.16;
  const roofY=z=>ridgeY-roofSlope*Math.abs(z-centerZ);
  for(const x of [1,8,15,22]){
    for(const z of [-14,2]){
      box(shed,x,.35,z,1.1,.7,1.1,M.concrete);
      box(shed,x,eaveY/2,z,.26,eaveY,.32);
      box(shed,x,.75,z,.6,.1,.64,M.zincDark);
      const innerZ=z+(z<centerZ?2:-2);
      beam(shed,V(x,eaveY-2,z),V(x,roofY(innerZ)-.2,innerZ),.18,M.steel);
    }
    beam(shed,V(x,eaveY,-14),V(x,ridgeY-.16,centerZ),.22,M.steel);
    beam(shed,V(x,ridgeY-.16,centerZ),V(x,eaveY,2),.22,M.steel);
  }
  for(const z of [-14,2]){
    beam(shed,V(1,eaveY,z),V(22,eaveY,z),.24,M.steel);
    // Short knee braces leave the stockpile bays open and connect at both ends.
    for(const x of [1,8,15])beam(shed,V(x,eaveY-1.8,z),V(x+2.2,eaveY,z),.14,M.steel);
    beam(shed,V(22,eaveY-1.8,z),V(19.8,eaveY,z),.14,M.steel);
  }
  for(const z of [-12,-9,-3,0])beam(shed,V(-.5,roofY(z)-.13,z),V(23.5,roofY(z)-.13,z),.12,M.zincDark);
  // Notches at the ridge form the framed discharge opening.
  const frontOutline=[[-.5,-6],[14.6,-6],[14.6,-4.7],[17.4,-4.7],[17.4,-6],[23.5,-6],[23.5,2.5],[-.5,2.5]];
  const backOutline=[[-.5,-14.5],[23.5,-14.5],[23.5,-6],[17.4,-6],[17.4,-7.3],[14.6,-7.3],[14.6,-6],[-.5,-6]];
  const beltOpening=[[5.8,-.5],[7.2,1.05],[14.5,-2.32],[13.1,-5.05]];
  const roofMetal=M.zinc.clone();roofMetal.side=THREE.DoubleSide;
  function shedPanel(outline,holes=[]){
    const shape=new THREE.Shape(outline.map(([x,z])=>new THREE.Vector2(x,z)));
    for(const points of holes)shape.holes.push(new THREE.Path(points.map(([x,z])=>new THREE.Vector2(x,z))));
    const geometry=new THREE.ShapeGeometry(shape),p=geometry.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getY(i);p.setXYZ(i,x,roofY(z),z);}
    geometry.computeVertexNormals();mesh(shed,geometry,roofMetal);
  }
  shedPanel(frontOutline,[beltOpening]);shedPanel(backOutline);
  function flashing(points){
    for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];beam(shed,V(a[0],roofY(a[1])+.1,a[1]),V(b[0],roofY(b[1])+.1,b[1]),.16,M.zincDark);}
  }
  flashing(beltOpening);
  flashing([[14.6,-7.3],[17.4,-7.3],[17.4,-4.7],[14.6,-4.7]]);
  // Corrugations are split at apertures so no loose strips cross the openings.
  function cutIntervals(x,z0,z1){
    const breaks=[z0,z1];
    for(let i=0;i<beltOpening.length;i++){
      const a=beltOpening[i],b=beltOpening[(i+1)%beltOpening.length];
      if((x>=Math.min(a[0],b[0]))&&(x<Math.max(a[0],b[0])))breaks.push(a[1]+(x-a[0])*(b[1]-a[1])/(b[0]-a[0]));
    }
    if(x>14.6&&x<17.4)breaks.push(-7.3,-4.7);
    const sorted=breaks.filter(z=>z>=z0&&z<=z1).sort((a,b)=>a-b),segments=[];
    for(let i=0;i<sorted.length-1;i++){
      const mid=(sorted[i]+sorted[i+1])/2;let inside=false;
      for(let a=0,b=beltOpening.length-1;a<beltOpening.length;b=a++){
        const p=beltOpening[a],q=beltOpening[b];
        if((p[1]>mid)!==(q[1]>mid)&&x<(q[0]-p[0])*(mid-p[1])/(q[1]-p[1])+p[0])inside=!inside;
      }
      if(!inside&&!(x>14.6&&x<17.4&&mid>-7.3&&mid<-4.7))segments.push([sorted[i],sorted[i+1]]);
    }
    return segments;
  }
  for(let x=-.5;x<=23.5;x+=.65){
    for(const [z0,z1] of [[-14.5,-6],[-6,2.5]])for(const [a,b] of cutIntervals(x,z0,z1))
      beam(shed,V(x,roofY(a)+.055,a),V(x,roofY(b)+.055,b),.045,M.zincDark);
  }
  for(const [a,b] of [[-.5,14.6],[17.4,23.5]])box(shed,(a+b)/2,ridgeY+.055,centerZ,b-a,.13,.3,M.zinc);
  for(const z of [-14.5,2.5])box(shed,11.5,roofY(z)-.05,z,24,.2,.2,M.zincDark);
  // Enclosed discharge throat connects the belt head to the roof penetration.
  cyl(shed,16,12.92,-6,.6,3.25,M.zincDark);
  mesh(shed,new THREE.CylinderGeometry(.93,.6,.65,16),M.zinc,16,14.7,-6);
  for(const z of [-14,2])box(arch,11.5,1.1,z,22,2.2,.35,M.concrete);
  for(const x of [1,22])box(arch,x,1.1,-6,.35,2.2,16,M.concrete);

  // MOAGEM — open steel building with individual green mill casings.
  box(arch,43,.13,-2,31,.26,22,M.concrete);
  for(const x of [31,39,47,55])for(const z of [-10,6]){
    box(arch,x,6.2,z,.28,12.4,.32);box(arch,x,.3,z,.9,.6,.9,M.concrete);
  }
  for(const z of [-10,6]){
    box(arch,43,11.5,z,24,.34,.24);
    for(const x of [31,47])beam(arch,V(x,1,z),V(x+8,11.5,z),.18,M.zincDark);
  }
  roof(arch,43,13.1,-2,27,18);
  platform(arch,44,3.1,-2,22,12.4);
  // The elevated upper silo and its cross-braced support dominate the silhouette.
  silo('moagem','SL-01',44,-2,9.3,2.6,4.2);
  frame(arch,44,-2,7.4,6.4,9.3,[3.1,7.6,9.3]);
  platform(arch,44,7.6,-2,8,7);
  stairs(arch,30,6.8,3.1,5.6);stairs(arch,48,6.8,4.5,7.5);
  function mill(tag,x,z,y=3.3,scale=1) {
    const g=eq('moagem',tag,'Moinho',x,y,z);
    box(g,0,.22,0,3.8*scale,.44,3.2*scale,M.zincDark);
    const casing=cyl(g,0,1.35*scale,0,1.35*scale,2.6*scale,M.green);casing.rotation.x=Math.PI/2;
    box(g,0,1.0*scale,0,2.7*scale,1.9*scale,2.6*scale,M.green);
    for(const zz of [-1.34,1.34]){
      const flange=cyl(g,0,1.35*scale,zz*scale,1.39*scale,.13*scale,M.zincDark);flange.rotation.x=Math.PI/2;
      for(let i=0;i<10;i++){const a=i*Math.PI/5;const bolt=cyl(g,Math.cos(a)*1.12*scale,(1.35+Math.sin(a)*1.12)*scale,(zz+.09)*scale,.075*scale,.07*scale,M.zinc);bolt.rotation.x=Math.PI/2;}
    }
    hopper(g,0,3.05*scale,0,1.7*scale,1.6*scale,1.25*scale);
    motor(g,2.4*scale,.95*scale,.05,1.15*scale);
    const pulley=new THREE.Group();pulley.position.set(0,1.35*scale,1.58*scale);pulley.userData.dynamic=true;g.add(pulley);
    const rim=mesh(pulley,new THREE.TorusGeometry(.74*scale,.1*scale,8,20),M.yellow);
    for(let i=0;i<5;i++){const spoke=box(pulley,0,0,0,.11*scale,1.4*scale,.1*scale,M.zincDark);spoke.rotation.z=i*Math.PI/5;}
    motors.push({object:pulley,axis:'z',speed:2.3});
    pipe(g,V(-1.4*scale,1.8*scale,-.4),V(-1.4*scale,5.5*scale,-.4),.22*scale,M.green);
    pipe(g,V(-1.4*scale,5.5*scale,-.4),V(.2,5.5*scale,-.4),.22*scale,M.green);
    equipment[equipment.length-1].anchor.set(x,y+4.8*scale,z);return g;
  }
  mill('MM-04',35,0,3.3,.9);mill('MM-05',42,2,3.3,1);
  mill('MM-03',49,0,3.3,.9);mill('MM-01',49,-6.5,3.3,.88);
  screen('moagem','AL-04','Alimentador',37.5,7,-2,2.5,1.7);
  screen('moagem','AL-03','Alimentador',49,7,-2,2.5,1.7);
  screen('moagem','AV-01','Alimentador vibratório',24,.9,-4,3.6,2.5);
  conveyor('moagem','TC-01',V(24,1.8,-4),V(40.5,8.4,-2),1.25);
  conveyor('moagem','TC-02',V(50,1.25,1),V(56,2.4,6));
  conveyor('moagem','TC-03',V(36,1.3,4),V(50,1.3,6));
  conveyor('moagem','TC-04',V(30,1.2,9),V(25,4.4,3));
  conveyor('moagem','TC-05',V(54,1.45,7),V(63,3.7,10));
  const um=eq('moagem','UM-01','Unidade auxiliar UM-01',27,0,4);
  box(um,0,.75,0,3.4,1.5,2.7,M.green);cyl(um,0,2.1,0,.95,1.2,M.zinc);motor(um,1.9,1,0,.68);
  const mba=eq('moagem','BA-01','Conjunto auxiliar BA-01',27,0,11.5);box(mba,0,.45,0,2.6,.9,2,M.zincDark);motor(mba,0,1.25,0,1);
  const mbl=eq('moagem','BL-01','Conjunto auxiliar BL-01',31,0,11.5);box(mbl,0,.6,0,2.3,1.2,1.8,M.zinc);motor(mbl,0,1.6,0,.7);
  const filter=eq('moagem','FM-02','Filtro de mangas',57,0,-6);
  frame(filter,0,0,3.3,4.8,5,[5]);box(filter,0,7,0,3.5,4,4.8,M.zinc);
  for(let xx=-1.4;xx<1.6;xx+=.58)box(filter,xx,7,2.43,.1,4,.12,M.zincDark);
  hopper(filter,0,4.1,0,3.3,4.5,1.8);platform(filter,0,9.1,0,4,5.4);
  cyl(filter,1.8,8.2,-2.4,.45,6,M.zinc);pipe(filter,V(-1.8,7,0),V(-5.5,7,0),.48,M.zinc);
  ladder(filter,-2.15,0,.5,10.2);
  cabin('moagem','COMANDO','Comando da moagem',58,14,6.6,3.5);

  // Utility infrastructure and light fittings enrich the industrial scale.
  for(const x of [-55,-42,-15,1,22,32,54]){
    box(arch,x,5.6,15,.14,11.2,.14,M.zincDark);
    beam(arch,V(x,11.15,15),V(x,11.15,13.7),.1,M.zincDark);
    box(arch,x,11.1,13.7,.8,.13,.45,M.light);
  }
  for(const p of [[-49,10,-.1],[-15,8,1.2],[35,11.6,6],[49,11.6,6]])flood(arch,...p);
  for(const z of [-10.6,-10.95])pipe(arch,V(30,2.6,z),V(57,2.6,z),.12,M.zinc);
  for(const x of [-48,-45,-42]){
    const drum=cyl(arch,x,.65,13,.45,1.3,M.steel);cyl(arch,x,1.28,13,.47,.06,M.zinc);
  }
  // Deterministic scattered aggregate near the primary crusher and stockpile.
  const debris=new THREE.InstancedMesh(geo.pebble,M.stone,90);debris.castShadow=true;debris.receiveShadow=true;arch.add(debris);
  const dummy=new THREE.Object3D();
  for(let i=0;i<90;i++){const u=Math.sin(i*13.3)*.5+.5,v=Math.cos(i*7.23)*.5+.5;const near=i<40;dummy.position.set(near?-58+u*17:3+u*19,.1,near?4+v*7:-13+v*14);dummy.scale.setScalar(.08+(i%5)*.025);dummy.rotation.set(i,2*i,.4*i);dummy.updateMatrix();debris.setMatrixAt(i,dummy.matrix);}

  // Merge static parts by material inside each selectable assembly. This retains
  // detail with a modest draw-call count without requiring an extra library.
  function mergeStatic(root) {
    root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),groups=new Map(),old=[];
    function visit(node){
      if(node!==root&&node.userData.dynamic)return;
      if(node.isMesh&&!node.isInstancedMesh){
        const key=node.material;let list=groups.get(key);if(!list)groups.set(key,list=[]);
        const transformed=node.geometry.clone().applyMatrix4(inverse.clone().multiply(node.matrixWorld));
        const g=transformed.index?transformed.toNonIndexed():transformed;if(g!==transformed)transformed.dispose();
        list.push(g);old.push(node);
      }
      for(const child of node.children)visit(child);
    }
    visit(root);
    for(const [mat,geometries]of groups){
      const total=geometries.reduce((sum,g)=>sum+g.attributes.position.count,0);
      const p=new Float32Array(total*3),n=new Float32Array(total*3);let off=0;
      for(const g of geometries){p.set(g.attributes.position.array,off);n.set(g.attributes.normal.array,off);off+=g.attributes.position.array.length;g.dispose();}
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(p,3));geometry.setAttribute('normal',new THREE.BufferAttribute(n,3));geometry.computeBoundingSphere();
      mesh(root,geometry,mat);
    }
    for(const node of old)node.parent.remove(node);
  }
  mergeStatic(arch);
  for(const e of equipment){mergeStatic(e.object);e.object.traverse(node=>{node.userData.equipmentId=e.id;});}
  let elapsed=0;
  function update(time,delta,running=true) {
    if(running)elapsed+=Math.min(Number.isFinite(delta)?delta:0,.1);
    for(const m of motors)m.object.rotation[m.axis]=elapsed*m.speed;
    for(const s of screens){s.object.position.y=s.base+Math.sin(elapsed*39+s.phase)*.025;s.object.rotation.z=Math.sin(elapsed*36+s.phase)*.004;}
    for(const b of belts){
      for(let i=0;i<b.count;i++){
        const progress=((i/b.count)+elapsed*1.7/b.len)%1;
        const jitter=Math.sin(i*19.34+b.seed);dummy.position.set(progress*b.len,.17+(i%3)*.024,jitter*b.width*.35);
        dummy.rotation.set(i*.7,i*1.4,i*.3);dummy.scale.set(.13+(i%4)*.018,.09+(i%3)*.025,.12+(i%5)*.013);dummy.updateMatrix();b.mesh.setMatrixAt(i,dummy.matrix);
      }b.mesh.instanceMatrix.needsUpdate=true;
    }
    for(const f of falls){
      for(let i=0;i<12;i++){const progress=(i/12+elapsed*.85)%1;dummy.position.copy(f.point).add(V(Math.sin(i*14+f.seed)*.27,-progress*progress*f.height,Math.cos(i*4)*.18));dummy.rotation.set(i+elapsed,i*.5,i);dummy.scale.setScalar(.10+(i%3)*.025);dummy.updateMatrix();f.mesh.setMatrixAt(i,dummy.matrix);}f.mesh.instanceMatrix.needsUpdate=true;
    }
  }
  update(0,0,false);
  return { equipment, update, bounds:{min:[-62,0,-22],max:[66,21,20]} };
}
