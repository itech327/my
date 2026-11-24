export class Vector2{constructor(x=0,y=0){this.x=x;this.y=y}set(x,y){this.x=x;this.y=y;return this}copy(v){this.x=v.x;this.y=v.y;return this}clone(){return new Vector2(this.x,this.y)}
add(v){this.x+=v.x;this.y+=v.y;return this}sub(v){this.x-=v.x;this.y-=v.y;return this}multiplyScalar(s){this.x*=s;this.y*=s;return this}dot(v){return this.x*v.x+this.y*v.y}
length(){return Math.hypot(this.x,this.y)}lengthSq(){return this.x*this.x+this.y*this.y}normalize(){const l=this.length()||1;return this.multiplyScalar(1/l)}distanceTo(v){return Math.hypot(this.x-v.x,this.y-v.y)}}
export class Vector3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}copy(v){this.x=v.x;this.y=v.y;this.z=v.z;return this}clone(){return new Vector3(this.x,this.y,this.z)}
add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this}addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;return this}subVectors(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this}
crossVectors(a,b){const x=a.y*b.z-a.z*b.y,y=a.z*b.x-a.x*b.z,z=a.x*b.y-a.y*b.x;return this.set(x,y,z)}dot(v){return this.x*v.x+this.y*v.y+this.z*v.z}length(){return Math.hypot(this.x,this.y,this.z)}
multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this}normalize(){return this.multiplyScalar(1/(this.length()||1))}lerpVectors(a,b,t){return this.set(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t)}
project(){this.x=0;this.y=0;return this}distanceTo(v){return Math.hypot(this.x-v.x,this.y-v.y,this.z-v.z)}setScalar(s){return this.set(s,s,s)}}
export const MathUtils={degToRad:d=>d*Math.PI/180,radToDeg:r=>r*180/Math.PI,clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};
export class Color{constructor(){}set(){return this}getHexString(){return 'ffffff'}}
export class Fog{constructor(c,n,f){this.color=new Color();this.near=n;this.far=f}}
class Obj{constructor(geometry,material){this.geometry=geometry;this.material=material;this.position=new Vector3();this.scale=new Vector3(1,1,1);this.rotation={x:0,y:0,z:0,set(){}};this.quaternion={setFromUnitVectors(){}};this.userData={};this.visible=true;this.children=[]}add(...c){this.children.push(...c);return this}lookAt(){}}
export class Object3D extends Obj{}export class Mesh extends Obj{}export class Sprite extends Obj{}export class LineSegments extends Obj{}export class Line extends Obj{}export class LineLoop extends Obj{}export class Group extends Obj{}
export class Scene extends Obj{}
export class PerspectiveCamera extends Obj{constructor(fov,aspect){super();this.fov=fov;this.aspect=aspect}updateProjectionMatrix(){}setViewOffset(...a){this.view=a;window.__view=a}}
class Light extends Obj{constructor(c,g,i){super();this.color=new Color();this.groundColor=new Color();this.intensity=typeof g==='number'?g:(i||1);this.shadow={mapSize:{set(){}},camera:{},bias:0}}}
export class HemisphereLight extends Light{}export class DirectionalLight extends Light{}
class Mat{constructor(o={}){Object.assign(this,o);this.color=new Color()}dispose(){}}
export class MeshStandardMaterial extends Mat{}export class MeshBasicMaterial extends Mat{}export class LineBasicMaterial extends Mat{}export class SpriteMaterial extends Mat{}export class LineDashedMaterial extends Mat{}
export class BufferAttribute{constructor(a,n){this.array=a;this.itemSize=n;this.needsUpdate=false}setXYZ(i,x,y,z){if(3*i+2>=this.array.length)throw new Error('attr overflow '+i);this.array[3*i]=x;this.array[3*i+1]=y;this.array[3*i+2]=z}}
export class BufferGeometry{constructor(){this.attributes={}}setAttribute(n,a){this.attributes[n]=a;return this}setDrawRange(){}computeVertexNormals(){}computeBoundingSphere(){}}
export class PlaneGeometry extends BufferGeometry{}export class BoxGeometry extends BufferGeometry{}export class SphereGeometry extends BufferGeometry{}export class CylinderGeometry extends BufferGeometry{}export class EdgesGeometry extends BufferGeometry{}
export class CanvasTexture{constructor(c){this.image=c;this.repeat=new Vector2()}dispose(){}}
export class WebGLRenderer{constructor(){this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>4}}setPixelRatio(){}setSize(){}render(){window.__frames=(window.__frames||0)+1}}
export class Plane{constructor(n,c){this.normal=n;this.constant=c}}
export class Raycaster{constructor(){this.ray={intersectPlane:(pl,t)=>window.__hit?(t.set(window.__hit[0],1.2,window.__hit[1]),t):null}}setFromCamera(){}intersectObjects(){return []}}
export class Clock{getDelta(){return 0.016}}
export const SRGBColorSpace='srgb',PCFSoftShadowMap=2,DoubleSide=2,BackSide=1,RepeatWrapping=1;
