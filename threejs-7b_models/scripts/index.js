/////////////////////////////////////////////////////////////
////////////Using standard three.js library//////////////////
/////////////////////////////////////////////////////////////

import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/GLTFExporter.js";
import WebGL from "./WebGLApp.js";
import ProjectedMaterial from "./ProjectedMaterial.js";

// Get the canvas elements and their 2D contexts
const demo = document.getElementById("demo");
const ctx = demo.getContext("2d");
// Create an Image object
const img = new Image();
img.src = "textures/1.png";

// Wait for the image to load
img.onload = function () {
  const aspectRatio = img.width / img.height;

  // Draw the image onto the canvas, maintaining the aspect ratio
  const canvasWidth = demo.width;
  const canvasHeight = demo.height;
  ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

  // Calculate the aspect ratio of the canvas
  const canvasAspectRatio = canvasWidth / canvasHeight;

  // Draw a red dot at coordinates (x, y), adjusting for aspect ratio
  drawDot(ctx, 90, 90, 1, "red");
};

// Function to draw a dot on the canvas
function drawDot(context, x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
  context.closePath();
}

// load a texture
const spaceTexture = new THREE.TextureLoader().load("textures/space.jpeg");

const texture = new THREE.TextureLoader().load("textures/texture2.png");
//   uvTexture.wrapS = THREE.RepeatWrapping;
//   uvTexture.wrapT = THREE.RepeatWrapping;
//   uvTexture.repeat.set(1, 1);
texture.flipY = false;

const material = new THREE.MeshStandardMaterial({
  map: texture,
});

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

loader.load("objects/Sphere.glb", handle_load);

var mesh;

function handle_load(gltf) {
  console.log(gltf);
  mesh = gltf.scene;
  console.log(mesh.children[0]);
  mesh.children[0].material = material;
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

function cameraToImageCoordinates(cameraX, cameraY, imageWidth, imageHeight) {
  const canvasWidth = imageWidth;
  const canvasHeight = imageHeight;
  // Calculate the aspect ratio of the canvas
  const canvasAspectRatio = canvasWidth / canvasHeight;

  // Calculate the aspect ratio of the image
  const imageAspectRatio = imageWidth / imageHeight;

  // Calculate the scaling factor for the width and height
  const scaleWidth = canvasWidth / imageWidth;
  const scaleHeight = canvasHeight / imageHeight;

  // Calculate the normalized coordinates in the camera view (-1 to 1)
  const normalizedX = cameraX / (canvasWidth / 2);
  const normalizedY = cameraY / (canvasHeight / 2);

  // Adjust for aspect ratio differences
  const adjustedX = normalizedX * (canvasAspectRatio / imageAspectRatio);
  const adjustedY = normalizedY;

  // Map to image coordinates
  const imageX = (adjustedX + 1) * (imageWidth / 2);
  const imageY = (1 - adjustedY) * (imageHeight / 2);

  return { imageX, imageY };
}

// Example usage
const imageWidth = 490; // Width of the image
const imageHeight = 490; // Height of the image

const cameraX = 100; // Example camera X coordinate
const cameraY = 100; // Example camera Y coordinate

const { imageX, imageY } = cameraToImageCoordinates(
  cameraX,
  cameraY,
  imageWidth,
  imageHeight
);

console.log(`Image Coordinates: (${imageX}, ${imageY})`);

function normalizeCoordinates(x, y, width, height) {
  const normalizedX = (x / width) * 2 - 1;
  const normalizedY = 1 - (y / height) * 2;
  return { x: normalizedX, y: normalizedY };
}

function normalizeToZeroOne(originalValue, minValue, maxValue) {
  return (originalValue - minValue) / (maxValue - minValue);
}

// Example usage
const originalValue = 33; // Replace this with your actual value
const minValue = -1.3;
const maxValue = 1.3;

const normalizedValue = normalizeToZeroOne(originalValue, minValue, maxValue);
console.log(`Normalized Value: ${normalizedValue}`);
