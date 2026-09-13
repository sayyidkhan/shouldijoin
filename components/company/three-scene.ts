import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {specs,type MetricId,type Result} from '@/lib/company/model';
import {SIGNAL_COLORS,SIGNAL_HEIGHTS} from '@/lib/company/visuals';

const referenceHeight=3.1;
// This scene is a spatial status map. Every financial amount stays in its own
// labelled metric; height represents only the transparent screening bands.
export function mountScene(host:HTMLDivElement,labels:(HTMLButtonElement|null)[],initial:Result[],selected:MetricId,onSelect:(id:MetricId)=>void,onUnavailable:()=>void,companyName:string){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.15;
 host.appendChild(renderer.domElement);
 const scene=new THREE.Scene();
 const camera=new THREE.OrthographicCamera(-10,10,7,-7,.1,100);
 const home=new THREE.Vector3(9,12,16);camera.position.copy(home);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.target.set(0,.75,0);controls.enableDamping=true;controls.dampingFactor=.09;
 controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.45;controls.maxPolarAngle=1.03;controls.autoRotateSpeed=.45;
 scene.add(new THREE.HemisphereLight(0xd8ffde,0x101914,2.3));
 const key=new THREE.DirectionalLight(0xf2ffe8,4);key.position.set(5,9,3);scene.add(key);
 const rim=new THREE.DirectionalLight(0x94cf94,3.5);rim.position.set(-6,6,-9);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xb6dbce,1.4);fill.position.set(5,2,9);scene.add(fill);

 function ring(radius:number,color:THREE.ColorRepresentation,opacity:number,tube=.013){
  const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,6,128),new THREE.MeshBasicMaterial({color,transparent:true,opacity}));mesh.rotation.x=-Math.PI/2;return mesh;
 }
 const platform=new THREE.Mesh(new THREE.CylinderGeometry(7.85,7.98,.22,128),new THREE.MeshStandardMaterial({color:0x192720,metalness:.75,roughness:.4}));platform.position.y=-.22;scene.add(platform);
 const lowerRing=ring(7.97,0x97c28c,.3,.018);lowerRing.position.y=-.3;scene.add(lowerRing);
 [2.35,4.2,6.9,7.7].forEach((r,i)=>{const m=ring(r,0x729574,i===3?.5:.2);m.position.y=-.099;scene.add(m)});
 const tickGeometry=new THREE.BoxGeometry(.022,.012,.12),tickMaterial=new THREE.MeshBasicMaterial({color:0x749479,transparent:true,opacity:.45});
 const ticks=new THREE.InstancedMesh(tickGeometry,tickMaterial,96),dummy=new THREE.Object3D();
 for(let i=0;i<96;i++){const a=i/96*Math.PI*2;dummy.position.set(Math.cos(a)*7.3,-.087,Math.sin(a)*7.3);dummy.rotation.y=-a+Math.PI/2;dummy.scale.set(1,1,i%4===0?2:1);dummy.updateMatrix();ticks.setMatrixAt(i,dummy.matrix)}scene.add(ticks);

 const hub=new THREE.Mesh(new THREE.CylinderGeometry(1.85,2,.23,96),new THREE.MeshStandardMaterial({color:0x25372a,metalness:.6,roughness:.34}));hub.position.y=.02;scene.add(hub);
 const hubRing=ring(1.82,0xb8f36d,.85,.018);hubRing.position.y=.16;scene.add(hubRing);
 // Text labels are a functional part of the diagram, not generated imagery.
 const textCanvas=document.createElement('canvas');textCanvas.width=768;textCanvas.height=768;
 const ctx=textCanvas.getContext('2d')!;ctx.clearRect(0,0,768,768);ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillStyle='#e1f6cc';ctx.font='600 116px "Manrope Variable", sans-serif';
 const title=companyName.length>13?companyName.slice(0,12)+'…':companyName;
 const measured=ctx.measureText(title).width;if(measured>600)ctx.font=`600 ${Math.floor(116*600/measured)}px "Manrope Variable", sans-serif`;
 ctx.fillText(title,384,355);ctx.fillStyle='#81967d';ctx.font='28px monospace';ctx.fillText('COMPANY SIGNALS',384,450);
 const hubTexture=new THREE.CanvasTexture(textCanvas);hubTexture.colorSpace=THREE.SRGBColorSpace;
 const hubText=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3.4),new THREE.MeshBasicMaterial({map:hubTexture,transparent:true,depthWrite:false}));hubText.rotation.x=-Math.PI/2;hubText.position.y=.17;scene.add(hubText);

 const plots=specs.map((spec,i)=>{
  const angle=i/6*Math.PI*2-Math.PI/2;
  const group=new THREE.Group();group.position.set(Math.cos(angle)*5.2,0,Math.sin(angle)*5.2);scene.add(group);
  const tile=new THREE.Mesh(new THREE.CylinderGeometry(1.32,1.48,.22,6),new THREE.MeshStandardMaterial({color:0x283a30,metalness:.65,roughness:.4}));tile.position.y=.03;tile.userData.metric=i;group.add(tile);
  const geometry=new THREE.CylinderGeometry(.83,1,1,6);
  const material=new THREE.MeshPhysicalMaterial({color:SIGNAL_COLORS[initial[i].tone],emissive:SIGNAL_COLORS[initial[i].tone],emissiveIntensity:.09,metalness:.42,roughness:.24,clearcoat:1,clearcoatRoughness:.15,transparent:true,opacity:.88});
  const pillar=new THREE.Mesh(geometry,material);pillar.userData.metric=i;group.add(pillar);
  const outlineMaterial=new THREE.LineBasicMaterial({color:SIGNAL_COLORS[initial[i].tone],transparent:true,opacity:.56});
  const outline=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),outlineMaterial);group.add(outline);
  const capMaterial=new THREE.MeshBasicMaterial({color:SIGNAL_COLORS[initial[i].tone],transparent:true,opacity:.85});
  const cap=new THREE.Mesh(new THREE.CircleGeometry(.82,6),capMaterial);cap.rotation.x=-Math.PI/2;group.add(cap);
  const selection=ring(1.6,0xf1ffd9,.9,.02);selection.position.y=.155;group.add(selection);
  const halo=new THREE.Mesh(new THREE.RingGeometry(1.38,1.85,64),new THREE.MeshBasicMaterial({color:0xb8f36d,transparent:true,opacity:.06,side:THREE.DoubleSide,depthWrite:false}));halo.rotation.x=-Math.PI/2;halo.position.y=.15;group.add(halo);
  const linePoints=[new THREE.Vector3(Math.cos(angle)*2.05,.14,Math.sin(angle)*2.05),new THREE.Vector3(Math.cos(angle)*3.6,.14,Math.sin(angle)*3.6)];
  const connection=new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePoints),new THREE.LineBasicMaterial({color:SIGNAL_COLORS[initial[i].tone],transparent:true,opacity:.4}));scene.add(connection);
  return {group,tile,pillar,material,outline,outlineMaterial,cap,capMaterial,selection,halo,connection,height:.02,target:SIGNAL_HEIGHTS[initial[i].tone]??referenceHeight,labelPoint:new THREE.Vector3(),tone:initial[i].tone};
 });
 let selectedId=selected,width=1,height=1,raf=0,dirty=true,visible=true,disposed=false,lastRender=0;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function setData(next:Result[],id:MetricId){
  selectedId=id;
  plots.forEach((p,i)=>{
   p.tone=next[i].tone;p.target=SIGNAL_HEIGHTS[p.tone]??referenceHeight;
   p.material.color.set(SIGNAL_COLORS[p.tone]);p.material.emissive.set(SIGNAL_COLORS[p.tone]);p.outlineMaterial.color.set(SIGNAL_COLORS[p.tone]);p.capMaterial.color.set(SIGNAL_COLORS[p.tone]);p.connection.material.color.set(SIGNAL_COLORS[p.tone]);
   p.pillar.visible=p.tone!=='unknown';p.cap.visible=p.tone!=='unknown';p.selection.visible=specs[i].id===selectedId;p.halo.visible=specs[i].id===selectedId;
   p.outlineMaterial.opacity=p.tone==='unknown'?.6:.22;
   if(reduced)p.height=p.target;
  });dirty=true;
 }
 setData(initial,selected);
 function resize(){
  width=Math.max(host.clientWidth,1);height=Math.max(host.clientHeight,1);const aspect=width/height;
  // Maintain room for the outer labels on both narrow and panoramic screens.
  const halfWidth=Math.max(9.8,6.2*aspect);camera.left=-halfWidth;camera.right=halfWidth;camera.top=halfWidth/aspect;camera.bottom=-halfWidth/aspect;camera.updateProjectionMatrix();renderer.setSize(width,height,false);dirty=true;
 }
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)dirty=true});io.observe(host);
 controls.addEventListener('change',()=>{dirty=true});
 const pointer=new THREE.Vector2(),raycaster=new THREE.Raycaster();let down={x:0,y:0};
 const pointerDown=(e:PointerEvent)=>{down={x:e.clientX,y:e.clientY}};
 const pointerUp=(e:PointerEvent)=>{
  if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;
  const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
  const hits=raycaster.intersectObjects(plots.flatMap(p=>[p.tile,...(p.pillar.visible?[p.pillar]:[])]),false);
  if(hits[0])onSelect(specs[hits[0].object.userData.metric].id);
 };
 const contextLost=(e:Event)=>{e.preventDefault();onUnavailable()};
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pointerUp);renderer.domElement.addEventListener('webglcontextlost',contextLost);
 function frame(t:number){
  if(disposed)return;raf=requestAnimationFrame(frame);if(!visible||document.hidden||t-lastRender<33)return;
  const changed=controls.update();let animating=false;
  plots.forEach((p,i)=>{const d=p.target-p.height;if(Math.abs(d)>.002){p.height+=reduced?d:d*.085;animating=true}p.pillar.scale.y=p.height;p.pillar.position.y=p.height/2+.16;p.outline.scale.y=p.height;p.outline.position.y=p.height/2+.16;p.cap.position.y=p.height+.165;p.material.emissiveIntensity=specs[i].id===selectedId ? .2 : .065;});
  if(dirty||changed||animating||controls.autoRotate){
   scene.updateMatrixWorld();camera.updateMatrixWorld();renderer.render(scene,camera);
   plots.forEach((p,i)=>{const label=labels[i];if(!label)return;p.labelPoint.copy(p.group.position);p.labelPoint.y=p.height+.48;p.labelPoint.project(camera);let x=(p.labelPoint.x*.5+.5)*width,y=(-p.labelPoint.y*.5+.5)*height;
    x=THREE.MathUtils.clamp(x,60,width-60);y=THREE.MathUtils.clamp(y,64,height-55);
    label.style.transform=`translate(-50%,-100%) translate(${x}px,${y}px)`;label.style.opacity=p.labelPoint.z<1?'1':'0';label.style.zIndex=String(Math.round(100-p.labelPoint.z*10));
   });dirty=false;lastRender=t;
  }
 }
 raf=requestAnimationFrame(frame);
 return {setData,rotate(value:boolean){controls.autoRotate=value;dirty=true},reset(){camera.position.copy(home);controls.target.set(0,.75,0);controls.autoRotate=false;camera.zoom=1;camera.updateProjectionMatrix();controls.update();dirty=true},zoom(n:number){camera.zoom=THREE.MathUtils.clamp(camera.zoom*n,.75,1.4);camera.updateProjectionMatrix();dirty=true},dispose(){
  disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointerup',pointerUp);renderer.domElement.removeEventListener('webglcontextlost',contextLost);
  scene.traverse(obj=>{const o=obj as THREE.Mesh;if(o.geometry)o.geometry.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose())}});hubTexture.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();
 }};
}
