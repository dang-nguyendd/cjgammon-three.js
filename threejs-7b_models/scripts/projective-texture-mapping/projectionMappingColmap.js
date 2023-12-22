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
  background: "#000000",
  // show the fps counter from stats.js
  showFps: true,
  // enable orbit-controls
  orbitControls: false,
});

// attach it to the window to inspect in the console
window.webgl = webgl;
// Create cube geometry with custom dimensions
const cubeWidth = 2;
const cubeHeight = 2;
const cubeDepth = 2;
const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
geometry.clearGroups();
//Adjust camera settings for projection
webgl.camera.zoom = 1;

// Define the distance of the point in 3D
const point = new THREE.Vector3(1.26092, -2.73594, 4.11874);
const center = new THREE.Vector3(0, 0, 0);
const distance = point.distanceTo(center);

console.log("Distance from the point to the center:", distance);

webgl.camera.position.normalize().multiplyScalar(distance);
// FOV calculating
const angle = Math.atan2(
  geometry.parameters.height / 2,
  webgl.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) -
    geometry.parameters.depth / 2
);
const angleDegrees = (angle * 180) / Math.PI;
webgl.camera.fov = angleDegrees * 2;

/*Loading Mesh file*/
var gltf;
var texture;
texture = new THREE.TextureLoader().load("textures/uv.jpeg");
console.log(texture);

var materials = [];
for (let i = 0; i < 2; i++) {
  var material;
  material = new ProjectedMaterial({
    camera: webgl.camera,
    texture,
    textureScale: 1,
    flatShading: true,
    transparent: true,
  });
  materials.push(material);
  geometry.addGroup(0, Infinity, i);
}

texture = new THREE.TextureLoader().load("textures/uv.png");
for (let i = 2; i < 4; i++) {
  material = new ProjectedMaterial({
    camera: webgl.camera,
    texture,
    textureScale: 1,
    flatShading: true,
    transparent: true,
  });
  materials.push(material);
  geometry.addGroup(0, Infinity, i);
}

const mesh = new THREE.Mesh(geometry, materials);
// const quaternion = new THREE.Quaternion(
//   -0.221083,
//   0.468124,
//   0.694217,
//   0.500046
// );

// for (let i = 0; i < 4; i++) {
//   mesh.material[i].project(mesh);
//   mesh.rotation.y += Math.PI / 2;
// }
// mesh.material[2].project(mesh);
mesh.rotation.x += Math.PI / 2;
for (let i = 0; i < 2; i++) {
  mesh.material[i].project(mesh);
  mesh.rotation.x += Math.PI;
}
mesh.rotation.x -= Math.PI / 2;
mesh.material[2].project(mesh);
// webgl.camera.setRotationFromQuaternion(quaternion);
// webgl.orbitControls.update();

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

/*

*/

const currentRotation = webgl.camera.rotation.clone();

// Convert Euler angles to quaternion
const quaternion = new THREE.Quaternion().setFromEuler(currentRotation);

// Step 1: Invert quaternion1
const invQuaternion1 = quaternion.clone().invert();

// Step 2: Multiply quaternion1 by invQuaternion1 to get a double rotation
const doubleRotation = quaternion.clone().multiply(invQuaternion1);

// Step 3: Create a quaternion for a 180-degree rotation (angle in radians)
const angle180 = Math.PI; // 180 degrees in radians
const axis180 = new THREE.Vector3(0, 1, 0); // Choose an appropriate axis
const quaternion180 = new THREE.Quaternion().setFromAxisAngle(
  axis180,
  angle180
);

// Step 4: Multiply quaternion1 by quaternion180 to get quaternion2
const quaternion2 = quaternion.clone().multiply(quaternion180);
console.log("Quaternion 1:", quaternion);
console.log("Quaternion 2:", quaternion2);

// console.log(x);
// quaternion.normalize()
mesh.setRotationFromQuaternion(quaternion2);

mesh.material[3].project(mesh);
webgl.scene.add(mesh);
webgl.start();
console.log(gltf ? gltf : "");
console.log(webgl.scene);
console.log(mesh);
console.log(material);

function setCameraFromQuaternion() {}

function quaternionToEuler(quaternion) {
  // Create a new Euler object and set it from the quaternion
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  // Return the Euler angles in degrees
  return {
    x: THREE.MathUtils.radToDeg(euler.x),
    y: THREE.MathUtils.radToDeg(euler.y),
    z: THREE.MathUtils.radToDeg(euler.z),
  };
}

// Example usage:
const eulerAngles = quaternionToEuler(quaternion);

console.log("Euler Angles:", eulerAngles);

function quaternionAngle(quaternion1, quaternion2) {
  // Calculate the angle between two quaternions
  const angle = quaternion1.angleTo(quaternion2);

  // Convert the angle from radians to degrees
  const angleDegrees = THREE.MathUtils.radToDeg(angle);

  return angleDegrees;
}

const angleBetween = quaternionAngle(quaternion, quaternion2);

console.log("Angle Between Quaternions:", angleBetween);
