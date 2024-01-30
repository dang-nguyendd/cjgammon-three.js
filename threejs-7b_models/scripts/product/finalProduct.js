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
  textureScale: 1.5,
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
  textureScale: 1.5,
  flatShading: true,
  transparent: true,
});

materials.push(material);
geometry.addGroup(0, Infinity, 1);

// webgl.scene.background = envMap;
webgl.gui.add({ scaling: 1.5 }, "scaling", 0, 2);

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
    getMassColor();
  }
});

document.addEventListener("keypress", (event) => {
  if (event.key === "o") {
    ExtractThermalFromJson("outputs/output_color(3).json");
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
  var colorMap = [];
  const demo = document.createElement("canvas");
  demo.width = webgl.width;
  demo.height = webgl.height;
  document.body.appendChild(demo);
  const ctx = demo.getContext("2d");
  const canvasWidth = webgl.width;
  const canvasHeight = webgl.height;

  // Create an Image object
  const img = new Image();
  img.src = captureImage();

  // Wait for the image to load
  img.onload = function () {
    // Draw the image onto the canvas, maintaining the aspect ratio

    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    console.log(imageData);
    var count = 0;

    for (let xCoor = 0; xCoor < webgl.width; xCoor++) {
      for (let yCoor = 0; yCoor < webgl.height; yCoor++) {
        var muse = new THREE.Vector2();
        muse.x = (xCoor / window.innerWidth) * 2 - 1;
        muse.y = -(yCoor / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(muse, webgl.camera);
        var intersects = raycaster.intersectObjects(webgl.scene.children);
        if (intersects.length > 0) {
          count++;
          // var x = Math.floor(xCoor, 0, canvas.width, 0, canvasWidth);
          // var y = Math.floor(yCoor, 0, canvas.height, 0, canvasHeight);
          var x = xCoor;
          var y = yCoor;
          var r, g, b, a;

          r = imageData.data[(y * imageData.width + x) * 4];
          g = imageData.data[(y * imageData.width + x) * 4 + 1];
          b = imageData.data[(y * imageData.width + x) * 4 + 2];
          a = imageData.data[(y * imageData.width + x) * 4 + 3];
          var hexColor = rgbToHex(r, g, b);
          var result = {
            hex: hexColor,
            coordinate: intersects[0].point,
          };

          // Perform raycasting to find intersected objects

          colorMap.push(result);
          // colorMap.push(intersects[0].point);
        }
      }
    }
    console.log(colorMap);
    extractColor(colorMap);
    document.body.removeChild(demo);
  };
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getColor(xCoor, yCoor) {
  // Get the canvas elements and their 2D contexts
  const demo = document.createElement("canvas");
  demo.width = webgl.width;
  demo.height = webgl.height;
  document.body.appendChild(demo);
  const ctx = demo.getContext("2d");
  // Create an Image object
  const img = new Image();
  img.src = captureImage();

  // Wait for the image to load
  img.onload = function () {
    // demo.style.width = webgl.width / 3;
    // demo.style.height = webgl.height / 3;

    // Draw the image onto the canvas, maintaining the aspect ratio
    const canvasWidth = webgl.width;
    const canvasHeight = webgl.height;
    ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    var x = Math.floor(xCoor, 0, canvas.width, 0, canvasWidth);
    var y = Math.floor(yCoor, 0, canvas.height, 0, canvasHeight);
    var r, g, b, a;
    // console.log(imageData.data);
    // xCoordinate = normalize(event.clientX, 0, canvas.height);
    // yCoordinate = normalize(event.clientY, 0, canvas.width);
    r = imageData.data[(y * imageData.width + x) * 4];
    g = imageData.data[(y * imageData.width + x) * 4 + 1];
    b = imageData.data[(y * imageData.width + x) * 4 + 2];
    a = imageData.data[(y * imageData.width + x) * 4 + 3];
    console.log("Color:", r, g, b, a);
    // console.log("Clicked at coordinates: (" + x + ", " + y + ")");
    document.body.removeChild(demo);
  };
}

function captureImage() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(webgl.width, webgl.height);
  renderer.render(webgl.scene, webgl.camera);
  // Capture the rendered image as a data URL
  const imageDataURL = renderer.domElement.toDataURL("image/png");
  console.log(imageDataURL);
  return imageDataURL;
}

function normalize_data(value, XMin, XMax, newMin, newMax) {
  var normalizedValue =
    newMin + ((value - XMin) / (XMax - XMin)) * (newMax - newMin);
  // console.log(normalizedValue);
  return normalizedValue;
}
function extractColor(array) {
  var object = {
    size: array.length,
    data: array,
  };
  const jsonString = JSON.stringify(object, null, 4);
  const blob = new Blob([jsonString], { type: "application/json" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "output_color.json";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function findMinMaxHexColor(hexColors) {
  function isValidHex(hex) {
    return /^#[0-9a-f]{3}|[0-9a-f]{6}$/i.test(hex);
  }
  // Validate input
  if (!Array.isArray(hexColors) || hexColors.some((hex) => !isValidHex(hex))) {
    throw new Error("Invalid input: Array of valid hex colors expected.");
  }

  // Initialize min and max colors
  let minColor = hexColors[0];
  let maxColor = hexColors[0];

  // Iterate through the array and compare colors
  hexColors.forEach((hex) => {
    const [r, g, b] = hex.match(/\w{2}/g).map((x) => parseInt(x, 16)); // Get RGB values
    const currentBrightness = r + g + b; // Calculate brightness
    const minBrightness = parseInt(
      minColor.match(/\w{2}/g).reduce((sum, x) => sum + parseInt(x, 16), 0),
      10
    );
    const maxBrightness = parseInt(
      maxColor.match(/\w{2}/g).reduce((sum, x) => sum + parseInt(x, 16), 0),
      10
    );

    if (currentBrightness < minBrightness) {
      minColor = hex;
    }
    if (currentBrightness > maxBrightness) {
      maxColor = hex;
    }
  });

  return { minColor, maxColor };
}

// async function loadHexValuesFromFile(filePath) {
//   try {
//     const response = await fetch(filePath);
//     const jsonData = await response.json();
//     const hexValues = jsonData.data.map((item) => item.hex); // Extract hex values
//     console.log(findMinMaxHexColor(hexValues)); // Return the array of hex values
//   } catch (error) {
//     console.error("Error loading JSON file:", error);
//     return []; // Return an empty array on error
//   }
// }

// function hexToThermal(hexColors) {
//   const maxThermal = 100;
//   const minThermal = 10;
//   const maxHex = "a0ff95";
//   const minHex = "000000";
//   // Validate input
//   if (!Array.isArray(hexColors)) {
//     throw new Error("Invalid input: Array of hex colors expected.");
//   }

//   const colorRange = parseInt(maxHex, 16) - parseInt(minHex, 16); // Calculate hex range

//   return hexColors.map((hex) => {
//     const value = parseInt(hex.slice(1), 16); // Get integer value without #
//     const normalizedValue = value / colorRange; // Normalize between 0 and 1
//     const thermalValue =
//       Math.round(normalizedValue * (maxThermal - minThermal)) + minThermal;

//     return thermalValue;
//   });
// }

async function ExtractThermalFromJson(filePath) {
  try {
    // Load JSON file using appropriate method (fetch or fs)
    const response = await fetch(filePath); // Assuming file is accessible via HTTP
    const jsonData = await response.json();

    const maxThermal = 100;
    const minThermal = 10;
    const maxHex = "a0ff95";
    const minHex = "000000";
    const colorRange = parseInt(maxHex, 16) - parseInt(minHex, 16); // Calculate hex range

    // Validate JSON structure (optional)
    if (!jsonData || !Array.isArray(jsonData.data)) {
      throw new Error("Invalid JSON structure: Expected 'data' array.");
    }

    // Process jsonData, ensuring consistent thermal value mapping
    jsonData.data.forEach((item, index) => {
      // Calculate thermal value based on a suitable mapping function
      // (e.g., linear mapping assuming hex range from #000000 to #ffffff)
      const value = parseInt(item.hex.slice(1), 16); // Get integer value without #
      const normalizedValue = value / colorRange; // Normalize between 0 and 1
      const thermalValue =
        normalizedValue * (maxThermal - minThermal) + minThermal;

      // Add thermal value to the item
      item.thermal = thermalValue;
    });

    const jsonString = JSON.stringify(jsonData, null, 4);
    const blob = new Blob([jsonString], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "output_color.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error("Error loading or processing JSON file:", error);
    return null; // Indicate error (or throw if preferred)
  }
}
