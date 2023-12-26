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
import {
  dataExtraction,
  onMouseMove,
  addLights,
  setCameraDistance,
  createMaterial,
  importModel,
} from "./methods.js";
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
  orbitControls: true,
});

// attach it to the window to inspect in the console
window.webgl = webgl;
// Create cube geometry with custom dimensions
const geometry = new THREE.PlaneGeometry(2, 2);
setCameraDistance(10, geometry);

var object = createMaterial("textures/uv.jpeg", geometry);
// add lights
addLights();

/*Data extraction*/
webgl.onPointerUp((event, { x, y, dragX, dragY }) => {
  dataExtraction(event, { x, y, dragX, dragY });
});
window.addEventListener("mousemove", onMouseMove, false);

/*Start animation loop*/

webgl.start();
console.log(webgl.scene);
console.log(object.mesh);
console.log(object.material);
