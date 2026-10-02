import { WebGLRenderer, Scene, OrthographicCamera, Group, Shape, Path, ExtrudeGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight } from 'three';

// The frame is a GPU surface; the application remains live, sharp HTML above it.
export function mountPhoneFrame(host) {
  let renderer;
  try { renderer = new WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'}); }
  catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.domElement.className='phone-frame-canvas';
  renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);
  const scene=new Scene(), camera=new OrthographicCamera(-1,1,1,-1,.1,3000), group=new Group();
  camera.position.z=1000;
  function rounded(path,w,h,r) {
    const x=-w/2,y=-h/2;
    path.moveTo(x+r,y);path.lineTo(x+w-r,y);path.quadraticCurveTo(x+w,y,x+w,y+r);
    path.lineTo(x+w,y+h-r);path.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    path.lineTo(x+r,y+h);path.quadraticCurveTo(x,y+h,x,y+h-r);
    path.lineTo(x,y+r);path.quadraticCurveTo(x,y,x+r,y);
  }
  const shape=new Shape();rounded(shape,302,612,48);
  const hole=new Path();rounded(hole,284,594,39);shape.holes.push(hole);
  const geometry=new ExtrudeGeometry(shape,{depth:14,bevelEnabled:true,bevelThickness:2,bevelSize:1.5,bevelSegments:2,curveSegments:16});
  const material=new MeshStandardMaterial({color:0x173a79,metalness:.65,roughness:.3,transparent:true});
  group.add(new Mesh(geometry,material));scene.add(group,new AmbientLight(0xffffff,2));
  const light=new DirectionalLight(0xadc6ff,4);light.position.set(-300,450,800);scene.add(light);
  let lastWidth=0,lastHeight=0,contextLost=false;
  function update({width,height,y,scale,intro,opacity,enabled}) {
    if(contextLost) return;
    host.closest('.hero').classList.toggle('has-frame-3d',enabled);
    renderer.domElement.style.opacity=enabled?opacity:0;
    if(!enabled || opacity<.001) return;
    if(width!==lastWidth||height!==lastHeight){renderer.setSize(width,height,false);camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.updateProjectionMatrix();lastWidth=width;lastHeight=height;}
    group.position.y=height/2-y;group.scale.setScalar(scale);
    group.rotation.y=-(16*(1-intro))*Math.PI/180;group.rotation.z=-(9*(1-intro))*Math.PI/180;
    material.opacity=1;renderer.render(scene,camera);
  }
  const lost=e=>{contextLost=true;e.preventDefault();host.closest('.hero').classList.remove('has-frame-3d');};
  renderer.domElement.addEventListener('webglcontextlost',lost);
  return {update,dispose(){renderer.domElement.removeEventListener('webglcontextlost',lost);geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();}};
}
