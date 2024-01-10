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
  cameraPosition: new THREE.Vector3(0, 0, 100),
});

const frustumSize = 3;
const near = 90;
const far = 110;
const aspect = 1;
const camera = new THREE.OrthographicCamera(
  -(frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  near,
  far
);

camera.position.set(0, 0, 100);
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
//Adjust camera settings for projection
webgl.camera.zoom = 1;

// Define the distance of the point in 3D
const point = new THREE.Vector3(1.26092, -2.73594, 4.11874);
const center = new THREE.Vector3(0, 0, 0);
const distance = point.distanceTo(center);

console.log("Distance from the point to the center:", distance);

webgl.camera.position.normalize().multiplyScalar(90);
// // FOV calculating
// const angle = Math.atan2(
//   geometry.parameters.height / 2,
//   webgl.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) -
//     geometry.parameters.depth / 2
// );
// const angleDegrees = (angle * 180) / Math.PI;
// webgl.camera.fov = angleDegrees * 2;

/*Loading Mesh file*/
var gltf;
var texture;
texture = new THREE.TextureLoader().load("textures/test_final.png");
console.log(texture);

var material;
material = new ProjectedMaterial({
  camera,
  texture,
  textureScale: 1,
  flatShading: true,
  transparent: true,
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
