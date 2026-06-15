import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const USE_GLB = true;   // dari false → true

async function buildCar(){
  const g = new THREE.Group();
  const gltf = await new GLTFLoader().loadAsync('mobil.glb');
  const model = gltf.scene;
  model.scale.setScalar(0.05);          // skala ke ~RC size
  g.add(model);

  // ambil roda by name dari Blender (sesuaikan nama node-mu)
  frontWheels = ['wheel_FL','wheel_FR'].map(n => model.getObjectByName(n));
  allWheels   = ['wheel_FL','wheel_FR','wheel_RL','wheel_RR'].map(n => model.getObjectByName(n));
  return g;
}
