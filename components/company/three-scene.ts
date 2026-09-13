import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {specs,type MetricId,type Result} from '@/lib/company/model';
import {SIGNAL_COLORS,SIGNAL_HEIGHTS} from '@/lib/company/visuals';
const referenceHeight=3.1;
export function mountScene(host:HTMLDivElement,labels:(HTMLButtonElement|null)[],initial:Result[],selected:MetricId,onSelect:(id:MetricId)=>void,onUnavailable:()=>void){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;
 host.appendChild(renderer.domElement);renderer.domElement.style.touchAction='pan-y';
 const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x101c2c,.028);
 const camera=new THREE.OrthographicCamera(-9,9,6,-6,.1,100);const home=new THREE.Vector3(9,9,14);camera.position.copy(home);camera.lookAt(0,1,0);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.8,0);controls.enableDamping=true;controls.dampingFactor=.09;controls.enablePan=false;controls.enableZoom=false;controls.minPolarAngle=.45;controls.maxPolarAngle=1.15;controls.autoRotateSpeed=.7;
 scene.add(new THREE.HemisphereLight(0xd8f0ff,0x192b43,2.8));const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(4,10,6);scene.add(key);const rim=new THREE.DirectionalLight(0x70a9ff,2);rim.position.set(-5,4,-7);scene.add(rim);
 const floor=new THREE.Mesh(new THREE.CylinderGeometry(7.9,8.1,.16,80),new THREE.MeshStandardMaterial({color:0x14263b,metalness:.35,roughness:.65}));floor.position.y=-.14;scene.add(floor);
 const grid=new THREE.GridHelper(16,32,0x2c4768,0x203b54);grid.position.y=-.049;(grid.material as THREE.Material).transparent=true;(grid.material as THREE.Material).opacity=.42;scene.add(grid);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(7.65,.012,6,100),new THREE.MeshBasicMaterial({color:0x487198,transparent:true,opacity:.6}));ring.rotation.x=Math.PI/2;ring.position.y=-.04;scene.add(ring);
 const plots=specs.map((spec,i)=>{
  const group=new THREE.Group();group.position.set((i%3-1)*3.75,0,i<3?-2.25:2.25);scene.add(group);
  const tile=new THREE.Mesh(new THREE.BoxGeometry(2.65,.15,2.65),new THREE.MeshStandardMaterial({color:0x20354c,metalness:.25,roughness:.65}));tile.position.y=.03;tile.userData.metric=i;group.add(tile);
  const geometry=new THREE.BoxGeometry(1.5,1,1.5);
  const material=new THREE.MeshStandardMaterial({color:SIGNAL_COLORS[initial[i].tone],emissive:SIGNAL_COLORS[initial[i].tone],emissiveIntensity:.15,metalness:.28,roughness:.35,transparent:true,opacity:.93});
  const pillar=new THREE.Mesh(geometry,material);pillar.scale.y=.05;pillar.position.y=.2;pillar.userData.metric=i;group.add(pillar);
  const outlineMaterial=new THREE.LineBasicMaterial({color:SIGNAL_COLORS[initial[i].tone],transparent:true,opacity:.72});
  const outline=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),outlineMaterial);outline.scale.y=3.1;outline.position.y=1.72;group.add(outline);
  const cap=new THREE.Mesh(new THREE.PlaneGeometry(1.49,1.49),new THREE.MeshBasicMaterial({color:0xc6fff2,transparent:true,opacity:.35,side:THREE.DoubleSide}));cap.rotation.x=-Math.PI/2;group.add(cap);
  const selection=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.7,.17,2.7)),new THREE.LineBasicMaterial({color:0xe4f7ff,transparent:true,opacity:.85}));selection.position.y=.04;group.add(selection);
  return {group,tile,pillar,material,outline,outlineMaterial,cap,selection,height:.05,target:(SIGNAL_HEIGHTS[initial[i].tone]??referenceHeight),labelPoint:new THREE.Vector3(),tone:initial[i].tone};
 });
 let results=initial,selectedId=selected,width=1,height=1,raf=0,dirty=true,visible=true,disposed=false,lastRender=0;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function setData(next:Result[],id:MetricId){results=next;selectedId=id;plots.forEach((p,i)=>{p.tone=results[i].tone;p.target=(SIGNAL_HEIGHTS[p.tone]??referenceHeight);p.material.color.set(SIGNAL_COLORS[p.tone]);p.material.emissive.set(SIGNAL_COLORS[p.tone]);p.outlineMaterial.color.set(SIGNAL_COLORS[p.tone]);p.pillar.visible=p.tone!=='unknown';p.cap.visible=p.tone!=='unknown';p.selection.visible=specs[i].id===selectedId;p.outline.visible=p.tone==='unknown';if(reduced)p.height=p.target;});dirty=true;}
 setData(initial,selected);
 function resize(){width=Math.max(host.clientWidth,1);height=Math.max(host.clientHeight,1);const aspect=width/height,halfWidth=aspect<1.2?8.4:8.7;camera.left=-halfWidth;camera.right=halfWidth;camera.top=halfWidth/aspect;camera.bottom=-halfWidth/aspect;camera.updateProjectionMatrix();renderer.setSize(width,height,false);dirty=true;}
 const ro=new ResizeObserver(resize);ro.observe(host);resize();
 const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)dirty=true;});io.observe(host);
 controls.addEventListener('change',()=>{dirty=true});
 const pointer=new THREE.Vector2(),raycaster=new THREE.Raycaster();let down={x:0,y:0};
 const pointerDown=(e:PointerEvent)=>{down={x:e.clientX,y:e.clientY};};
 const pointerUp=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const targets=plots.flatMap(p=>[p.tile,...(p.pillar.visible?[p.pillar]:[])]);const hits=raycaster.intersectObjects(targets,false);if(hits[0])onSelect(specs[hits[0].object.userData.metric].id);};
 const contextLost=(e:Event)=>{e.preventDefault();onUnavailable();};
 renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pointerUp);renderer.domElement.addEventListener('webglcontextlost',contextLost);
 function frame(t:number){if(disposed)return;raf=requestAnimationFrame(frame);if(!visible||document.hidden||t-lastRender<33)return;const changed=controls.update();let animating=false;plots.forEach((p,i)=>{const d=p.target-p.height;if(Math.abs(d)>.002){p.height+=reduced?d:d*.12;animating=true;}p.pillar.scale.y=p.height;p.pillar.position.y=p.height/2+.13;p.cap.position.y=p.height+.14;p.material.emissiveIntensity=specs[i].id===selectedId ? .35 : .10;});
  if(dirty||changed||animating||controls.autoRotate){scene.updateMatrixWorld();camera.updateMatrixWorld();renderer.render(scene,camera);plots.forEach((p,i)=>{const label=labels[i];if(!label)return;p.labelPoint.copy(p.group.position);p.labelPoint.y=(p.tone==='unknown'?3.1:p.height)+.38;p.labelPoint.project(camera);const x=(p.labelPoint.x*.5+.5)*width,y=(-p.labelPoint.y*.5+.5)*height;label.style.transform=`translate(-50%,-100%) translate(${x}px,${y}px)`;label.style.opacity=p.labelPoint.z<1?'1':'0';label.style.zIndex=String(Math.round(100-p.labelPoint.z*10));});dirty=false;lastRender=t;}
 }
 raf=requestAnimationFrame(frame);
 return {setData,rotate(value:boolean){controls.autoRotate=value;dirty=true;},reset(){camera.position.copy(home);controls.target.set(0,.8,0);controls.autoRotate=false;camera.zoom=1;camera.updateProjectionMatrix();controls.update();dirty=true;},zoom(n:number){camera.zoom=THREE.MathUtils.clamp(camera.zoom*n,.7,1.6);camera.updateProjectionMatrix();dirty=true;},dispose(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointerup',pointerUp);renderer.domElement.removeEventListener('webglcontextlost',contextLost);scene.traverse(obj=>{const o=obj as THREE.Mesh;if(o.geometry)o.geometry.dispose();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose())}});renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}};
}
