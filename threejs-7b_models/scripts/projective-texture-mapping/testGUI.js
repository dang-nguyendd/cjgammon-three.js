/////////////////////////////////////////////////////////////
/////Using standard three.js's Proected Materials Library////
/////////////////////////////////////////////////////////////

import * as THREE from "three";
import WebGLApp from "../WebGLApp.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/GLTFExporter.js";
import ProjectedMaterial from "https://unpkg.com/three-projected-material/build/ProjectedMaterial.module.js";
import { random } from "../math-utils.js";
import { loadGltf, extractGeometry } from "../three-utils.js";
import "numeric";
// grab our canvas
const canvas = document.querySelector("#myCanvas");
// WebGLApp is a really basic wrapper around the three.js setup,
// it hides all unnecessary stuff not related to this example
const webgl = new WebGLApp({
  canvas,
  // set the scene background color
  background: "#000",
  // show the fps counter from stats.js
  showFps: true,
  // enable orbit-controls
  orbitControls: true,
  cameraPosition: new THREE.Vector3(0, 0, 10),
  gui: true,
});
const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 30);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);
const helper = new THREE.CameraHelper(camera);
webgl.scene.add(helper);

// attach it to the window to inspect in the console
window.webgl = webgl;
// Create cube geometry with custom dimensions
const cubeWidth = 2;
const cubeHeight = 2;
const cubeDepth = 2;
const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
geometry.clearGroups();

/*Loading Mesh file*/
var gltf;
var texture;
texture = new THREE.TextureLoader().load("textures/test_final_perspective.png");
console.log(texture);
// load the envMap
const envMap = new THREE.TextureLoader().load("textures/bg.jpg");
envMap.mapping = THREE.EquirectangularReflectionMapping;

var material;
material = new ProjectedMaterial({
  camera,
  texture,
  envMap,
  textureScale: 2,
  flatShading: true,
  transparent: true,
});
webgl.scene.background = envMap;
webgl.gui.add({ scaling: 2 }, "scaling", 0, 2);

webgl.gui.onChange((scaling) => {
  material.textureScale = scaling.value;
  console.log(scaling.value);
});
const mesh = new THREE.Mesh(geometry, material);
const quaternion = new THREE.Quaternion(
  -0.221083,
  0.468124,
  0.694217,
  0.500046
);
mesh.setRotationFromQuaternion(quaternion);
mesh.material.project(mesh);

// webgl.camera.setRotationFromQuaternion(quaternion);
// webgl.orbitControls.update();
webgl.scene.add(mesh);

// add lights
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
directionalLight.position.set(0, 10, 10);
webgl.scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight("#ffffff", 0.2);
directionalLight2.position.set(10, 0, -5);
webgl.scene.add(directionalLight2);

const ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
webgl.scene.add(ambientLight);

/////////////////////////////////////////////////////////////
////////////////////////start animation loop/////////////////
/////////////////////////////////////////////////////////////
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  // Convert mouse coordinates to normalized device coordinates (NDC)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Assume you have a function to handle the mouse click event
webgl.onPointerUp((event, { x, y, dragX, dragY }) => {
  // Return if we used the orbit controls
  if (Math.hypot(dragX, dragY) > 2) {
    return;
  }

  // Update the raycaster with the current mouse coordinates
  raycaster.setFromCamera(mouse, webgl.camera);

  // Perform raycasting to find intersected objects
  const intersects = raycaster.intersectObjects(webgl.scene.children);

  if (intersects.length > 0) {
    // Log all intersections for debugging
    console.log("All Intersections:", intersects);

    // Get the first intersection point (closest to the camera)
    const intersectionPoint = intersects[0].point;
    const intersectionUV = intersects[0].uv;

    // Use intersectionPoint as the 3D world coordinates of the clicked pixel
    console.log("1. Intersection Point:", intersectionPoint);
    console.log("2. Intersection UV:", intersectionUV);

    // Check if the material is defined before accessing properties
    if (intersects[0].object.material) {
      const materialSide = intersects[0].object.material.side;
      console.log("Material Side:", materialSide);
    }
  }
});

// Attach event listeners
window.addEventListener("mousemove", onMouseMove, false);
// window.addEventListener("click", onMouseClick, false);

/////////////////////////////////////////////////////////////
////////////////////////start animation loop/////////////////
/////////////////////////////////////////////////////////////

webgl.start();
console.log(gltf ? gltf : "");
console.log(webgl.scene);
console.log(mesh);
console.log(material);
