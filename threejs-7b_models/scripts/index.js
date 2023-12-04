/////////////////////////////////////////////////////////////
////////////Using standard three.js library//////////////////
/////////////////////////////////////////////////////////////

import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/GLTFExporter.js";
import WebGL from "./WebGLApp.js";
import ProjectedMaterial from "./ProjectedMaterial.js";
// load a texture, set wrap mode to repeat
const spaceTexture = new THREE.TextureLoader().load("textures/space.jpeg");

const texture = new THREE.TextureLoader().load("textures/texture3.png");
//   uvTexture.wrapS = THREE.RepeatWrapping;
//   uvTexture.wrapT = THREE.RepeatWrapping;
//   uvTexture.repeat.set(1, 1);
texture.flipY = false;

// const material = new THREE.MeshStandardMaterial({
//   map: texture,
// });

//RENDERER
var renderer = new THREE.WebGLRenderer({
  canvas: myCanvas,
  antialias: true,
});
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//CAMERA
var camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//SCENE
var scene = new THREE.Scene();

//LIGHTS
var light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light2);

var loader = new GLTFLoader();

loader.load("outputs/Sphere_result (2).glb", handle_load);

var mesh;

function handle_load(gltf) {
  console.log(gltf);
  mesh = gltf.scene;
  console.log(mesh.children[0]);
  // mesh.children[0].material = material;
  scene.add(mesh);
  mesh.position.z = -10;
}

//RENDER LOOP
render();

var delta = 0;
var prevTime = Date.now();

function render() {
  delta += 0.1;

  if (mesh) {
    mesh.rotation.y += 0.01;

    //animation mesh
    // mesh.morphTargetInfluences[ 0 ] = Math.sin(delta) * 20.0;
  }

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

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
  exporter.parse(
    scene,
    function (result) {
      saveArrayBuffer(result, "Sphere_result.glb");
    },
    {
      binary: true,
    }
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
