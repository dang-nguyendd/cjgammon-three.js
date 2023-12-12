/////////////////////////////////////////////////////////////
/////Using standard three.js's Proected Materials Library////
/////////////////////////////////////////////////////////////

import * as THREE from "three";
import WebGLApp from "./WebGLApp.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/GLTFExporter.js";
import ProjectedMaterial from "https://unpkg.com/three-projected-material/build/ProjectedMaterial.module.js";
import { random } from "./math-utils.js";
import { loadGltf, extractGeometry } from "./three-utils.js";
// grab our canvas
const canvas = document.querySelector("#myCanvas");
const bg = new THREE.TextureLoader().load("textures/space.jpeg");
// WebGLApp is a really basic wrapper around the three.js setup,
// it hides all unnecessary stuff not related to this example
const webgl = new WebGLApp({
  canvas,
  // set the scene background color
  background: "#000000",
  // show the fps counter from stats.js
  showFps: true,
  // enable orbit-controls
  orbitControls: true,
});

// attach it to the window to inspect in the console
window.webgl = webgl;
webgl.background = bg;
// Create cube geometry with custom dimensions
const cubeWidth = 2;
const cubeHeight = 2;
const cubeDepth = 2;
const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);

/*Loading Mesh file*/
var gltf;
var texture;
texture = new THREE.TextureLoader().load("textures/1.png");
console.log(texture);

var materials = [];
var material;
material = new ProjectedMaterial({
  camera: webgl.camera,
  texture,
  textureScale: 0.4,
  flatShading: true,
  transparent: true,
});
// materials.push(material);

// reserve a group for the material on the geometry
// https://stackoverflow.com/a/49708915
// geometry.addGroup(0, Infinity, 0);
// geometry.addGroup(0, Infinity, 1);

// texture = new THREE.TextureLoader().load("textures/2.png");
// console.log(texture);

// material = new ProjectedMaterial({
//   camera: webgl.camera,
//   texture,
//   textureScale: 1,
//   flatShading: true,
//   transparent: true,
// });
// materials.push(material);
// console.log(materials);

const mesh = new THREE.Mesh(geometry, material);
material.project(mesh);
webgl.scene.add(mesh);
// mesh.rotation.y = Math.PI / 2;

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
