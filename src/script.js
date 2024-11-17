import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);

gltfLoader.load('./tree/tree.glb', (glb) => {
  const tree = glb.scene;
  tree.position.set(5, 0, 4.1);
  tree.scale.set(0.015, 0.015, 0.015);
  tree.rotation.y = Math.PI / 4;
  gui.add(tree.position, 'x').min(-10).max(10).step(0.001).name('Tree X');
  gui.add(tree.position, 'y').min(-10).max(10).step(0.001).name('Tree Y');
  gui.add(tree.position, 'z').min(-10).max(10).step(0.001).name('Tree Z');
  gui.add(tree.scale, 'x').min(0).max(10).step(0.001).name('Tree Scale X');
  gui.add(tree.scale, 'y').min(0).max(10).step(0.001).name('Tree Scale Y');
  gui.add(tree.scale, 'z').min(0).max(10).step(0.001).name('Tree Scale Z');
  gui.add(tree.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('Tree Rotation Y');

  scene.add(tree);
});

gltfLoader.load('./tree/ancient_tree.glb', (glb) => {
  const tree = glb.scene;
  tree.position.set(-5, 0, 4.3);
  tree.scale.set(0.007, 0.01, 0.01);
  tree.rotation.y = Math.PI / 4;
  gui.add(tree.position, 'x').min(-10).max(10).step(0.001).name('Tree 2 X');
  gui.add(tree.position, 'y').min(-10).max(10).step(0.001).name('Tree 2 Y');
  gui.add(tree.position, 'z').min(-10).max(10).step(0.001).name('Tree 2 Z');
  gui.add(tree.scale, 'x').min(0).max(10).step(0.001).name('Tree 2 Scale X');
  gui.add(tree.scale, 'y').min(0).max(10).step(0.001).name('Tree 2 Scale Y');
  gui.add(tree.scale, 'z').min(0).max(10).step(0.001).name('Tree 2 Scale Z');
  gui.add(tree.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('Tree 2 Rotation Y');

  scene.add(tree);
});

// Scene
const scene = new THREE.Scene();

const sky = new Sky();
sky.scale.setScalar(40);
sky.material.uniforms.turbidity.value = 10;
sky.material.uniforms.rayleigh.value = 3;
// sky.material.uniforms.luminance.value = 1;
sky.material.uniforms.mieCoefficient.value = 0.1;
sky.material.uniforms.mieDirectionalG.value = 0.95;
sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95);

scene.add(sky);

// Fog
scene.fog = new THREE.FogExp2('#262837', 0.3);

const textureLoader = new THREE.TextureLoader();

// Floor
const floorTexture = textureLoader.load('./floor/alpha.jpg');
const floorColorTexture = textureLoader.load('./floor/textures/coast_sand_rocks_02_diff_1k.jpg');
const floorARMTexture = textureLoader.load('./floor/textures/coast_sand_rocks_02_arm_1k.jpg');
const floorNormalTexture = textureLoader.load('./floor/textures/coast_sand_rocks_02_nor_gl_1k.jpg');
const floorDisplacementTexture = textureLoader.load('./floor/textures/coast_sand_rocks_02_disp_1k.jpg');

// Always apply this bellow to color textures
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
floorColorTexture.repeat.set(3, 3);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.repeat.set(3, 3);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(3, 3);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(3, 3);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 30, 30),
  new THREE.MeshStandardMaterial({
    // wireframe: true,
    alphaMap: floorTexture,
    transparent: true,
    map: floorColorTexture,
    normalMap: floorNormalTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorDisplacementTexture,
    metalnessMap: floorDisplacementTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.5,
    displacementBias: -0.25,
  })
);
gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Displacement scale');
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Displacement Bias');
scene.add(floor);
floor.rotation.x = -Math.PI / 2;

const wallsColorTexture = textureLoader.load('./walls/textures/castle_brick_broken_06_diff_1k.jpg');
const wallsARMTexture = textureLoader.load('./walls/textures/castle_brick_broken_06_arm_1k.jpg');
const wallsNormalTexture = textureLoader.load('./walls/textures/castle_brick_broken_06_nor_gl_1k.jpg');
const wallsDisplacementTexture = textureLoader.load('./walls/textures/castle_brick_broken_06_disp_1k.jpg');

wallsColorTexture.colorSpace = THREE.SRGBColorSpace;

const house = new THREE.Group();
scene.add(house);

const params = {
  width: 4,
  height: 6,
};
const houseBase = new THREE.Mesh(
  new THREE.BoxGeometry(params.width, params.height, 4),
  new THREE.MeshStandardMaterial({
    color: 'black',
    roughness: 0.9,

    map: wallsColorTexture,
    normalMap: wallsNormalTexture,
    aoMap: wallsARMTexture,
    roughnessMap: wallsARMTexture,
    metalnessMap: wallsDisplacementTexture,
    displacementMap: wallsDisplacementTexture,
  })
);

gui.add(houseBase.material, 'displacementScale').min(0).max(1).step(0.001).name('Displacement scale');
gui.add(houseBase.material, 'displacementBias').min(-1).max(1).step(0.001).name('Displacement Bias');
gui.add(houseBase.material, 'roughness').min(-1).max(1).step(0.001).name('roughness');

// gui.add(params, 'width', 1, 10).step(1).name('Width').onChange(updateGeometry);
// gui.add(params, 'height', 1, 10).step(1).name('Height').onChange(updateGeometry);

house.add(houseBase);
houseBase.position.y = houseBase.geometry.parameters.height / 2;

const roofColorTexture = textureLoader.load('./roof/textures/wood_planks_grey_diff_1k.jpg');
const roofARMTexture = textureLoader.load('./roof/textures/wood_planks_grey_arm_1k.jpg');
const roofNormalTexture = textureLoader.load('./roof/textures/wood_planks_grey_nor_gl_1k.jpg');

// Set Color Space and Wrap Mode
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;

// Set Repeat
roofColorTexture.repeat.set(10, 2); // Adjust for block-like appearance
roofARMTexture.repeat.set(10, 2);
roofNormalTexture.repeat.set(10, 2);
roofColorTexture.rotation = -Math.PI / 26;
roofARMTexture.rotation = -Math.PI / 26;
roofNormalTexture.rotation = -Math.PI / 26;

gui.add(roofColorTexture.repeat, 'x').min(0).max(10).step(0.001).name('x');
gui.add(roofColorTexture.repeat, 'y').min(0).max(10).step(0.001).name('y');
gui.add(roofColorTexture, 'rotation').min(0).max(10).step(0.001).name('rotation');

// Create Roof Mesh with Material
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.25, 2, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    normalMap: roofNormalTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
  })
);

scene.add(roof);
roof.position.y = houseBase.geometry.parameters.height + roof.geometry.parameters.height / 2;
roof.rotation.y = Math.PI / 4;

const doorColorTexture = textureLoader.load('./door/Metal_Gate_002_diff_1k.jpg');
const doorAoTexture = textureLoader.load('./door/Metal_Gate_002_ambientOcclusion.jpg');
const doorNormalTexture = textureLoader.load('./door/Metal_Gate_002_normal.jpg');
const doorDisplacementTexture = textureLoader.load('./door/Metal_Gate_002_displacement.png');
const doorRoughnessTexture = textureLoader.load('./door/Metal_Gate_002_roughness.jpg');
const doorMetalicTexture = textureLoader.load('./door/Metal_Gate_002_metalic.jpg');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.2, 2.2, 10, 10), // Increase segment count for smoother displacement
  new THREE.MeshStandardMaterial({
    // wireframe: true, // Turn off wireframe for a more realistic look
    map: doorColorTexture,
    normalMap: doorNormalTexture,
    alphaMap: doorColorTexture,
    aoMap: doorAoTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalicTexture,
    displacementMap: doorDisplacementTexture,
    displacementScale: 0.03,
    displacementBias: -0.0003,
  })
);

const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(-0.5, 2.5, 2.5);
doorLight.rotation.y = Math.PI;
gui.add(doorLight.position, 'x').min(-1).max(1).step(0.001).name('Door Light X');
gui.add(doorLight.position, 'y').min(-1).max(4).step(0.001).name('Door Light Y');
gui.add(doorLight.position, 'z').min(-1).max(4).step(0.001).name('Door Light Z');

scene.add(doorLight);

house.add(door);
door.position.y = door.geometry.parameters.height / 2;
door.position.z = houseBase.geometry.parameters.width / 2 + 0.01;
door.position.x = -0.5;

const windowSizes = {
  width: 1,
  height: 0.75,
};
const houseWindow = new THREE.Mesh(
  new THREE.PlaneGeometry(windowSizes.width, windowSizes.height, 10, 10), // Increase segment count for smoother displacement
  new THREE.MeshStandardMaterial({
    color: '#ff7d46',
  })
);

house.add(houseWindow);
houseWindow.position.y = houseBase.geometry.parameters.height - 1;
houseWindow.position.z = houseBase.geometry.parameters.width / 2 + 0.01;

// Window light
const windowLight = new THREE.RectAreaLight('#ff7d46', 6, windowSizes.width, windowSizes.height);
windowLight.position.y = houseBase.geometry.parameters.height - 1;
windowLight.position.z = houseBase.geometry.parameters.width / 2 + 0.02;
// windowLight.rotation.y = Math.PI;
// windowLight.intensity = 8;

gui.add(windowLight.position, 'x').min(-1).max(1).step(0.001).name('Window Light X');
gui.add(windowLight.position, 'y').min(-1).max(4).step(0.001).name('Window Light Y');
gui.add(windowLight.position, 'z').min(-1).max(4).step(0.001).name('Window Light Z');
gui.add(windowLight, 'intensity').min(0).max(10).step(0.001).name('Window Light Intensity');
gui.add(windowLight.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.001).name('Window Light Rotation X');
gui.add(windowLight.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('Window Light Rotation Y');
gui.add(windowLight.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.001).name('Window Light Rotation Z');

scene.add(windowLight);
// const helper = new RectAreaLightHelper(windowLight);
// windowLight.add(helper);

// Import pumpkins
gltfLoader.load('./pumpkin/halloween_pumpkin.glb', (glb) => {
  const pumpkin = glb.scene;

  pumpkin.scale.setScalar(0.003);
  pumpkin.position.set(1.4, 0.1, 2.4);
  pumpkin.rotation.y = -0.35;

  pumpkin.traverse((child) => {
    if (child.isMesh) {
      const material = child.material;
      if (material) {
        material.emissive = new THREE.Color('orange'); // Set emissive color
        material.emissiveIntensity = 30; // Adjust glow intensity
      }
    }
  });

  scene.add(pumpkin);
});

// Graves
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_diff_1k.jpg');
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_arm_1k.jpg');
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_nor_gl_1k.jpg');

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  normalMap: graveNormalTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
});
const graveGeometry = new THREE.BoxGeometry(0.5, 0.75, 0.1);
const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i <= 30; i++) {
  const angles = Math.random() * Math.PI * 2;
  const radius = 5 + Math.random() * 4;
  const z = Math.sin(angles) * radius;
  const y = Math.random() * 0.4;
  const x = Math.cos(angles) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, y, z);
  grave.rotation.x = Math.random() * Math.PI - 0.5;

  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  // gui.add(grave.position, 'x').min(-10).max(10).step(0.001).name('Grave X');
  // gui.add(grave.position, 'y').min(-10).max(10).step(0.001).name('Grave Y');
  // gui.add(grave.position, 'z').min(-10).max(10).step(0.001).name('Grave Z');

  graves.add(grave);
}

// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
directionalLight.position.set(3, 2, -8);

// Light optimization
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 15;

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('Light intensity');
gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.001).name('Light X');
gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.001).name('Light Y');
gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.001).name('Light Z');
scene.add(directionalLight);

// Ghosts

let ghost1 = null;
let ghost2 = null;
let ghost3 = null;
gltfLoader.load('./ghost/ghost.glb', (gltf) => {
  const ghost = gltf.scene;
  // ghost1.scale.setScalar(0.4);
  ghost.scale.set(0.4, 0.25, 0.5);
  ghost.rotation.y = Math.PI / -2;

  ghost1 = ghost.clone();
  ghost2 = ghost.clone();
  ghost3 = ghost.clone();

  // ghost1.position.set(0, 0, 5);
  // ghost1.rotation.y = Math.PI / -2;
  const ghostColors = [
    { model: ghost1, color: '#8800ff' },
    { model: ghost2, color: '#ff00ff' },
    { model: ghost3, color: '#ff0000' },
  ];

  const ghostLight = new THREE.PointLight('blue', 15);
  ghostLight.shadow.mapSize.width = 256;
  ghostLight.shadow.mapSize.height = 256;
  ghostLight.shadow.camera.far = 10;
  ghostLight.castShadow = true;

  ghostColors.forEach((ghostModel) => {
    ghostModel.model.traverse((child) => {
      if (child.isMesh) {
        // Clone the material to create unique material instances
        child.material = child.material.clone();

        // Set the emissive color for each unique material
        child.material.emissive = new THREE.Color(ghostModel.color);
        child.material.emissiveIntensity = 0.8;

        child.material.transparent = true;
        child.material.opacity = 0.3;
      }
    });
  });

  scene.add(ghost1, ghost2, ghost3);
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(125, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 8;
gui.add(camera.position, 'x').min(-10).max(10).step(0.001).name('Camera X');
gui.add(camera.position, 'y').min(-10).max(10).step(0.001).name('Camera Y');
gui.add(camera.position, 'z').min(-10).max(10).step(0.001).name('Camera Z');
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
// ghost1.castShadow = true;
// ghost2.castShadow = true;
// ghost3.castShadow = true;

houseBase.receiveShadow = true;
floor.receiveShadow = true;
graves.children.forEach((grave) => {
  grave.receiveShadow = true;
  grave.castShadow = true;
});

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  if (ghost1) {
    const ghost1Angle = timer.getElapsed() * -0.15;
    // Update position
    const newX = Math.sin(ghost1Angle) * 6;
    const newZ = Math.cos(ghost1Angle) * 6;
    const newY = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 2.34);

    ghost1.position.set(newX, newY, newZ);

    // Make the ghost look at its next position
    const targetPosition = new THREE.Vector3(
      Math.sin(ghost1Angle - 0.01) * 6, // Small offset to calculate the direction
      Math.sin(ghost1Angle - 0.01) * Math.sin((ghost1Angle + 0.01) * 2.34) * Math.sin((ghost1Angle + 0.01) * 2.34),
      Math.cos(ghost1Angle - 0.01) * 6
    );

    ghost1.lookAt(targetPosition);
  }

  if (ghost2) {
    const ghost2Angle = timer.getElapsed() * 0.18;
    const newX = Math.sin(ghost2Angle) * 4;
    const newZ = Math.cos(ghost2Angle) * 4;
    const newY = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 2.34);

    ghost2.position.set(newX, newY, newZ);

    const targetPosition = new THREE.Vector3(
      Math.sin(ghost2Angle + 0.01) * 4, // Small offset to calculate the direction
      Math.sin(ghost2Angle + 0.01) * Math.sin((ghost2Angle + 0.01) * 2.34) * Math.sin((ghost2Angle + 0.01) * 2.34),
      Math.cos(ghost2Angle + 0.01) * 4
    );

    ghost2.lookAt(targetPosition);
  }
  if (ghost3) {
    const ghost3Angle = timer.getElapsed() * 0.08;

    const newX = Math.sin(ghost3Angle) * 8;
    const newZ = Math.cos(ghost3Angle) * 8;
    const newY = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 2.34);

    ghost3.position.set(newX, newY, newZ);

    const targetPosition = new THREE.Vector3(
      Math.sin(ghost3Angle + 0.01) * 8, // Small offset to calculate the direction
      Math.sin(ghost3Angle + 0.01) * Math.sin((ghost3Angle + 0.01) * 2.34) * Math.sin((ghost3Angle + 0.01) * 2.34),
      Math.cos(ghost3Angle + 0.01) * 8
    );

    ghost3.lookAt(targetPosition);
  }
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
