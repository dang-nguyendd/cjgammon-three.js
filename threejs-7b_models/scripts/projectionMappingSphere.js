/////////////////////////////////////////////////////////////
/////Using standard three.js's Proected Materials Library////
/////////////////////////////////////////////////////////////

import * as THREE from "three";
import WebGLApp from "./WebGLApp.js";
// import { GLTFExporter } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/GLTFExporter.js";
import ProjectedMaterial from "https://unpkg.com/three-projected-material/build/ProjectedMaterial.module.js";
// import { loadGltf, extractGeometry } from "./three-utils.js";
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

/*Loading Mesh file*/
var gltf;
// gltf = await loadGltf("objects/Sphere.glb");
// const geometry = extractGeometry(gltf.scene);
// geometry.clearGroups();
//Alternative: Creating Sphere object
const geometry = new THREE.IcosahedronGeometry(1.3, 30);

//Adjust camera settings for projection
webgl.camera.zoom = 1;
webgl.camera.position.normalize().multiplyScalar(1000);
// FOV calculating
const angle = Math.atan2(
  geometry.parameters.radius,
  webgl.camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
);
const angleDegrees = (angle * 180) / Math.PI;
webgl.camera.fov = angleDegrees * 2.1;

var materials = [];
var material;
// reserve a group for the material on the geometry
// https://stackoverflow.com/a/49708915
geometry.addGroup(0, Infinity, 0);
geometry.addGroup(0, Infinity, 1);

// load the texture with transparent background
var texture;
texture = new THREE.TextureLoader().load(
  "textures/1.png",
  function (loadedTexture) {
    var image = loadedTexture.image;
    console.log("Texture 1 Resolution:", image.width, "x", image.height);
  }
);

material = new ProjectedMaterial({
  camera: webgl.camera,
  texture,
  textureScale: 1,
  flatShading: true,
  transparent: true,
});
materials.push(material);

texture = new THREE.TextureLoader().load(
  "textures/2.png",
  function (loadedTexture) {
    var image = loadedTexture.image;
    console.log("Texture 2 Resolution:", image.width, "x", image.height);
  }
);

material = new ProjectedMaterial({
  camera: webgl.camera,
  texture,
  textureScale: 1,
  flatShading: true,
  transparent: true,
});
materials.push(material);

const mesh = new THREE.Mesh(geometry, materials);
mesh.material[0].project(mesh);
mesh.rotation.y = Math.PI;
mesh.material[1].project(mesh);
webgl.scene.add(mesh);

// mesh.rotation.y = Math.PI / 2;
// webgl.camera.position.normalize().multiplyScalar(10);
// webgl.onUpdate(() => {
//   mesh.rotation.y -= 0.003;
// });S

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

// webgl.onPointerUp((event, { x, y, dragX, dragY }) => {
//   // return if we used the orbit controls
//   if (Math.hypot(dragX, dragY) > 2) {
//     return;
//   }

//   // move the texture to where we clicked with the mouse
//   const center = new THREE.Vector2(webgl.width / 2, webgl.height / 2);

//   const mouse = new THREE.Vector2(x, y);
//   const offset = new THREE.Vector2().subVectors(center, mouse);
//   // convert it to 0 to 1 range
//   offset.divide(new THREE.Vector2(webgl.width, webgl.height));
//   offset.y *= -1;
//   webgl.scene.rotation.y += Math.PI / 2;
//   var rotation = webgl.scene.rotation;
//   var data = {
//     center,
//     mouse,
//     offset,
//     rotation,
//   };

//   console.log(data);
// });

/////////////////////////////////////////////////////////////
//////////////////////////Raycasting/////////////////////////
/////////////////////////////////////////////////////////////

/*Normalisation*/
function normaliseData(value) {
  const maxValue = geometry.parameters.radius;
  const minValue = -1 * maxValue;
  // Ensure the value is within the specified range
  value = Math.max(minValue, Math.min(maxValue, value));

  // Normalize the value to [0, 1]
  return (value - minValue) / (maxValue - minValue);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  // Convert mouse coordinates to normalized device coordinates (NDC)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Assume you have a function to handle the mouse click event
webgl.onPointerUp((event, { x, y, dragX, dragY }) => {
  // return if we used the orbit controls
  if (Math.hypot(dragX, dragY) > 2) {
    return;
  }
  // Update the raycaster with the current mouse coordinates
  raycaster.setFromCamera(mouse, webgl.camera);

  // Perform raycasting to find intersected objects
  const intersects = raycaster.intersectObjects(webgl.scene.children);

  if (intersects.length > 0) {
    // Get the first intersection point (closest to the camera)
    const intersectionPoint = intersects[0].point;
    const intersectionUV = intersects[0].uv;
    // Use intersectionPoint as the 3D world coordinates of the clicked pixel
    console.log("****************************************");
    console.log("1. Intersection array:", intersects);
    console.log("2. Intersection:", intersects[0]);
    console.log("3. Intersection Point:", intersectionPoint);
    console.log(
      "4. Normalised XY:",
      new THREE.Vector2(
        normaliseData(intersectionPoint.x),
        normaliseData(intersectionPoint.y)
      )
    );
    console.log("5. Intersection UV:", intersectionUV);
    console.log("****************************************");
  }
});

// Attach event listeners
window.addEventListener("mousemove", onMouseMove, false);
// window.addEventListener("click", onMouseClick, false);

/////////////////////////////////////////////////////////////
////////////////////////start animation loop/////////////////
/////////////////////////////////////////////////////////////

webgl.start();
console.log("I. ", gltf ? gltf : "");
console.log("II. ", webgl.scene);
console.log("III. ", mesh);
console.log("IV. ", materials);
console.log("V. Geometry Radius:", geometry.parameters.radius);
console.log(
  "VI. Distance from camera to center of scene:",
  webgl.camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
);

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

// //Load texture
// const textureLoader = new THREE.TextureLoader();

// function loadTexture() {
//   const texture = textureLoader.load("path/to/your/texture.jpg", () => {
//     // This callback will be executed once the image is loaded
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     // Assuming uv coordinates are available
//     const uv = { x: 0.5, y: 0.5 }; // Replace with actual uv coordinates

//     const x = uv.x * texture.image.width;
//     const y = (1 - uv.y) * texture.image.height;

//     ctx.drawImage(texture.image, x, y, 1, 1, 0, 0, 1, 1);

//     const pixelData = ctx.getImageData(0, 0, 1, 1).data;

//     const color = new THREE.Color();
//     color.setRGB(pixelData[0] / 255, pixelData[1] / 255, pixelData[2] / 255);

//     console.log("Color at intersection point:", color);
//   });

//   // Set the onload event before assigning the src
//   texture.image.onload = () => {
//     // This event is triggered when the image is fully loaded
//     console.log("Texture loaded successfully");
//   };

//   // Assign the src after setting the onload event
//   texture.image.src = "path/to/your/texture.jpg";
// }

// // Call the function to load the texture
// loadTexture();

// function sampleTexture(texture, uv, color) {
//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(
//     texture.image,
//     uv.x * texture.image.width,
//     (1 - uv.y) * texture.image.height,
//     1,
//     1,
//     0,
//     0,
//     1,
//     1
//   );
//   const pixelData = ctx.getImageData(0, 0, 1, 1).data;
//   color.setRGB(pixelData[0] / 255, pixelData[1] / 255, pixelData[2] / 255);
//   console.log("Color at intersection point:", color);
// }

// if (intersects.length > 0) {
//   const intersection = intersects[0];

//   // Assuming the object has a material with a texture
//   const texture = intersection.object.material.map;

//   // Sample the texture at the UV coordinates
//   const uv = intersection.uv;
//   const color = new THREE.Color();

//   // Ensure texture is loaded before sampling
//   if (texture.image.complete) {
//     sampleTexture(texture, uv, color);
//   } else {
//     texture.image.onload = () => {
//       sampleTexture(texture, uv, color);
//     };
//   }
// }
