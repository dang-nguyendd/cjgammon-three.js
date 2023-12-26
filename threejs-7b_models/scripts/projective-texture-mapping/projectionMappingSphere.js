/////////////////////////////////////////////////////////////
/////Using standard three.js's Proected Materials Library////
/////////////////////////////////////////////////////////////

import * as THREE from "three";
import WebGLApp from "../WebGLApp.js";
// import { GLTFExporter } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/GLTFExporter.js";
import ProjectedMaterial from "https://unpkg.com/three-projected-material/build/ProjectedMaterial.module.js";
import {
  dataExtraction,
  onMouseMove,
  addLights,
  setCameraDistance,
  createMaterial,
  importModel,
  setCameraDistanceSphere,
  materials,
  createMultipleMaterials,
} from "./methods.js";

// grab our canvas
const canvas = document.querySelector("#myCanvas");
const webgl = new WebGLApp({
  canvas,
  background: "#000000",
  showFps: true,
  orbitControls: true,
});
window.webgl = webgl;

//Alternative: Creating Sphere object
const geometry = new THREE.IcosahedronGeometry(1.3, 30);
var mesh = new THREE.Mesh(geometry, materials);

//Adjust camera settings for projection
setCameraDistanceSphere(500, geometry);

// geometry.addGroup(0, Infinity, 0);
// geometry.addGroup(0, Infinity, 1);

var object = createMultipleMaterials("textures/1.png", geometry, mesh);
mesh.rotation.y = Math.PI;
object = createMultipleMaterials("textures/2.png", geometry, mesh);

// add lights
addLights();

/*Data extraction*/
webgl.onPointerUp((event, { x, y, dragX, dragY }) => {
  dataExtraction(event, { x, y, dragX, dragY });
});
window.addEventListener("mousemove", onMouseMove, false);

/////////////////////////////////////////////////////////////
////////////////////////start animation loop/////////////////
/////////////////////////////////////////////////////////////

webgl.start();
console.log("II. ", webgl.scene);
console.log("III. ", object.mesh);
console.log("IV. ", materials);
console.log("V. Geometry Radius:", geometry.parameters.radius);
console.log(
  "VI. Distance from camera to center of scene:",
  webgl.camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
);
