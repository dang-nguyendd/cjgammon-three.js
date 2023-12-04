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

// load the texture with transparency
const texture = new THREE.TextureLoader().load(
  "textures/three-projected-material-4.png"
);

// const geometry = new THREE.IcosahedronGeometry(1.3, 5);
const gltf = await loadGltf("objects/Sphere.glb");
const geometry = extractGeometry(gltf.scene);

const material = new ProjectedMaterial({
  camera: webgl.camera,
  texture,
  color: "#59d8e8",
  textureScale: 0.5,
  flatShading: true,
  // works also if the mater is transparent
  // transparent: true,
  // opacity: 0.5,
});
// var loader = new GLTFLoader();

// loader.load("objects/Sphere.glb", handle_load);

// var mesh;

// function handle_load(gltf) {
//   console.log(gltf);
//   mesh = gltf.scene;
//   console.log(mesh.children[0]);
//   mesh.children[0].material = material;
// }

const mesh = new THREE.Mesh(geometry, material);

// project the texture!
material.project(mesh);

webgl.scene.add(mesh);

mesh.rotation.y = Math.PI / 2;
webgl.onUpdate(() => {
  mesh.rotation.y -= 0.003;
});

// add lights
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
directionalLight.position.set(0, 10, 10);
webgl.scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight("#ffffff", 0.2);
directionalLight2.position.set(10, 0, -5);
webgl.scene.add(directionalLight2);

const ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
webgl.scene.add(ambientLight);

// start animation loop
webgl.start();
console.log(gltf);
console.log(webgl.scene);
console.log(mesh);
console.log(material);
/////////////////////////////////////////////////////////////
////////////Export result.glb and bind to "s" key////////////
/////////////////////////////////////////////////////////////

function handleKeyPress(event) {
  // Check if the pressed key is "s"
  if (event.key == "s") {
    download();
    console.log('Key "s" pressed!');
  }
}

// Add a keydown event listener to the document
document.addEventListener("keydown", handleKeyPress);

function download() {
  const exporter = new GLTFExporter();
  const options = { binary: true, embedImages: true };
  exporter.parse(
    mesh,
    function (result) {
      saveArrayBuffer(result, "Sphere_result.glb");
    },
    options
  );
}

function saveArrayBuffer(buffer, fileName) {
  save(new Blob([buffer], { type: "application/octetstream" }), fileName);
}

const link = document.createElement("a");
document.body.appendChild(link);

function save(blob, fileName) {
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
