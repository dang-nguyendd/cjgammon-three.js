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
  background: "#011110",
  // show the fps counter from stats.js
  showFps: true,
  // enable orbit-controls
  orbitControls: true,
});

// attach it to the window to inspect in the console
window.webgl = webgl;
webgl.background = bg;
// const geometry = new THREE.IcosahedronGeometry(1.3, 20);
const gltf = await loadGltf("objects/Sphere.glb");
const geometry = extractGeometry(gltf.scene);
geometry.clearGroups();

// load the texture with transparency
var texture;
texture = new THREE.TextureLoader().load("textures/1.png");
console.log(texture);

var materials = [];
var material;
material = new ProjectedMaterial({
  camera: webgl.camera,
  texture,
  textureScale: 1,
  flatShading: true,
  transparent: true,
});
materials.push(material);

// reserve a group for the material on the geometry
// https://stackoverflow.com/a/49708915
geometry.addGroup(0, Infinity, 0);
geometry.addGroup(0, Infinity, 1);

texture = new THREE.TextureLoader().load("textures/2.png");
console.log(texture);

material = new ProjectedMaterial({
  camera: webgl.camera,
  texture,
  textureScale: 1,
  flatShading: true,
  transparent: true,
});
materials.push(material);
console.log(materials);

const mesh = new THREE.Mesh(geometry, materials);
// mesh.scale.setScalar(2);
// project the texture!
// material.project(mesh);
mesh.material[0].project(mesh);
mesh.rotation.y = Math.PI;
mesh.material[1].project(mesh);
webgl.scene.add(mesh);

// mesh.rotation.y = Math.PI / 2;
// webgl.onUpdate(() => {
//   mesh.rotation.y -= 0.003;
// });

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
////////////Show data and bind to "clicking" mouse///////////
/////////////////////////////////////////////////////////////

webgl.onPointerUp((event, { x, y, dragX, dragY }) => {
  // return if we used the orbit controls
  if (Math.hypot(dragX, dragY) > 2) {
    return;
  }

  // move the texture to where we clicked with the mouse
  const center = new THREE.Vector2(webgl.width / 2, webgl.height / 2);

  const mouse = new THREE.Vector2(x, y);
  const offset = new THREE.Vector2().subVectors(center, mouse);
  // convert it to 0 to 1 range
  offset.divide(new THREE.Vector2(webgl.width, webgl.height));
  offset.y *= -1;
  webgl.scene.rotation.y += Math.PI / 2;
  var rotation = webgl.scene.rotation;
  var data = {
    center,
    mouse,
    offset,
    rotation,
  };

  console.log(data);
  // convert from window coordinate system to WebGL
  // coordinate system
});

/////////////////////////////////////////////////////////////
////////////////////////start animation loop/////////////////
/////////////////////////////////////////////////////////////

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

// //move the offset
// mesh.material[0].project(mesh);
// mesh.rotation.y = Math.PI;

// mesh.material[1].project(mesh);
// //move the offset
// const center = new THREE.Vector2(webgl.width / 2, webgl.height / 2);
// const mouse = new THREE.Vector2(500, 300);

// const offset = new THREE.Vector2().subVectors(center, mouse);

// // convert it to 0 to 1 range
// offset.divide(new THREE.Vector2(webgl.width, webgl.height));

// // convert from window coordinate system to WebGL
// // coordinate system
// offset.y *= -1;

// mesh.material[1].textureOffset = offset;
