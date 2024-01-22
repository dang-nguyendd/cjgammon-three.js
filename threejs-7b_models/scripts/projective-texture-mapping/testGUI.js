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
// webgl.scene.add(helper);

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
var materials = [];
texture = new THREE.TextureLoader().load(
  "textures/thermal_cube_perspective.png"
);
console.log(texture);
// load the envMap
// const envMap = new THREE.TextureLoader().load("textures/bg.jpg");
// envMap.mapping = THREE.EquirectangularReflectionMapping;

var material;
material = new ProjectedMaterial({
  camera,
  texture,
  textureScale: 1,
  flatShading: true,
  transparent: true,
});
materials.push(material);
geometry.addGroup(0, Infinity, 0);

texture = new THREE.TextureLoader().load(
  "textures/thermal_cube_perspective_2.png"
);
material = new ProjectedMaterial({
  camera,
  texture,
  textureScale: 1,
  flatShading: true,
  transparent: true,
});

materials.push(material);
geometry.addGroup(0, Infinity, 1);

// webgl.scene.background = envMap;
webgl.gui.add({ scaling: 1 }, "scaling", 0, 2);

webgl.gui.onChange((scaling) => {
  material.textureScale = scaling.value;
  console.log(scaling.value);
});
const mesh = new THREE.Mesh(geometry, materials);
const quaternion = new THREE.Quaternion(
  -0.221083,
  0.468124,
  0.694217,
  0.500046
);
mesh.setRotationFromQuaternion(quaternion);
mesh.material[0].project(mesh);
// const yAxis = new THREE.Quaternion(0, 0, 1, 0);
// const oppositeQuaternion = yAxis.clone().multiply(quaternion);
// oppositeQuaternion.invert();
// mesh.setRotationFromQuaternion(oppositeQuaternion);
mesh.rotation.y = Math.PI;
mesh.material[1].project(mesh);

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
  console.log(mouse);
  console.log(event.clientX);
  console.log(event.clientY);

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
    getColor(x, y);
  }
});
document.addEventListener("keypress", (event) => {
  if (event.key === "p") {
    // Code to execute when 's' is pressed
    console.log("'p' key pressed!");
    const muse = new THREE.Vector2();

    muse.x = (501.6000061035156 / window.innerWidth) * 2 - 1;
    muse.y = -(284.6000061035156 / window.innerHeight) * 2 + 1;
    // muse.x.normalize() * 2 - 1;
    // muse.y.normalize() * 2 + 1;
    //Vector2 {x: -0.0940325497287523, y: 0.1827338129496403}

    raycaster.setFromCamera(muse, webgl.camera);
    const intersects = raycaster.intersectObjects(webgl.scene.children);
    console.log(intersects);
    console.log(muse);
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

function getMassColor() {
  const colorMap = {};
  const demo = document.getElementById("demo");
  const ctx = demo.getContext("2d");
  demo.style.width = webgl.width / 3;
  demo.style.height = webgl.height / 3;
  const canvasWidth = webgl.width / 4;
  const canvasHeight = webgl.height / 4;
  // Create an Image object
  const img = new Image();
  img.src = captureImage();

  // Wait for the image to load
  img.onload = function () {
    // Draw the image onto the canvas, maintaining the aspect ratio

    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    console.log(imageData);

    // for (let xCoor = 0; xCoor < webgl.width; xCoor++) {
    //   for (let yCoor = 0; yCoor < webgl.height; yCoor++) {
    //     raycaster.setFromCamera({ xCoor, yCoor }, webgl.camera);
    //     const intersects = raycaster.intersectObjects(webgl.scene.children);
    //     console.log(intersects);
    //     if (intersects.length > 0) {
    //       var x = Math.floor(
    //         normalize_data(xCoor, 0, canvas.width, 0, canvasWidth)
    //       );
    //       var y = Math.floor(
    //         normalize_data(yCoor, 0, canvas.height, 0, canvasHeight)
    //       );
    //       var r, g, b, a;

    //       // xCoordinate = normalize(event.clientX, 0, canvas.height);
    //       // yCoordinate = normalize(event.clientY, 0, canvas.width);
    //       r = imageData.data[(y * imageData.width + x) * 4];
    //       g = imageData.data[(y * imageData.width + x) * 4 + 1];
    //       b = imageData.data[(y * imageData.width + x) * 4 + 2];
    //       a = imageData.data[(y * imageData.width + x) * 4 + 3];
    //       hexColor = rgbToHex(255, 0, 0); // Returns "#FF0000"

    //       // Perform raycasting to find intersected objects

    //       colorMap[hexColor] = intersects[0].point;
    //     }
    //   }
    // }
    console.log(colorMap);
  };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getColor(xCoor, yCoor) {
  // Get the canvas elements and their 2D contexts
  const demo = document.getElementById("demo");
  const ctx = demo.getContext("2d");
  // Create an Image object
  const img = new Image();
  img.src = captureImage();

  // Wait for the image to load
  img.onload = function () {
    demo.style.width = webgl.width / 3;
    demo.style.height = webgl.height / 3;

    // Draw the image onto the canvas, maintaining the aspect ratio
    const canvasWidth = webgl.width / 4;
    const canvasHeight = webgl.height / 4;
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    var x = Math.floor(normalize_data(xCoor, 0, canvas.width, 0, canvasWidth));
    var y = Math.floor(
      normalize_data(yCoor, 0, canvas.height, 0, canvasHeight)
    );
    var r, g, b, a;
    console.log(imageData.data);
    // xCoordinate = normalize(event.clientX, 0, canvas.height);
    // yCoordinate = normalize(event.clientY, 0, canvas.width);
    r = imageData.data[(y * imageData.width + x) * 4];
    g = imageData.data[(y * imageData.width + x) * 4 + 1];
    b = imageData.data[(y * imageData.width + x) * 4 + 2];
    a = imageData.data[(y * imageData.width + x) * 4 + 3];
    console.log("Color:", r, g, b, a);
    console.log("Clicked at coordinates: (" + x + ", " + y + ")");
  };
}

function captureImage() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(webgl.width / 2, webgl.height / 2);
  renderer.render(webgl.scene, webgl.camera);
  // Capture the rendered image as a data URL
  const imageDataURL = renderer.domElement.toDataURL("image/png");
  console.log(imageDataURL);
  return imageDataURL;
}

function normalize_data(value, XMin, XMax, newMin, newMax) {
  var normalizedValue =
    newMin + ((value - XMin) / (XMax - XMin)) * (newMax - newMin);
  console.log(normalizedValue);
  return normalizedValue;
}
