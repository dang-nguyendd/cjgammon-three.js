// /////////////////////////////////////////////////////////////
// /////Using standard three.js's Proected Materials Library////
// /////////////////////////////////////////////////////////////

// import * as THREE from "three";
// import WebGLApp from "../WebGLApp.js";
// import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
// import { GLTFExporter } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/exporters/GLTFExporter.js";
// import ProjectedMaterial from "https://unpkg.com/three-projected-material/build/ProjectedMaterial.module.js";
// import { random } from "../math-utils.js";
// import { loadGltf, extractGeometry } from "../three-utils.js";
// import "numeric";
// // grab our canvas
// const canvas = document.querySelector("#myCanvas");
// // WebGLApp is a really basic wrapper around the three.js setup,
// // it hides all unnecessary stuff not related to this example

// /*Loading Mesh file*/
// var gltf;
// var texture;
// texture = new THREE.TextureLoader().load("textures/uv.jpeg", (texture) => {
//   console.log(texture);

//   const webgl = new WebGLApp({
//     canvas,
//     // set the scene background color
//     background: "#000",
//     // show the fps counter from stats.js
//     showFps: true,
//     // enable orbit-controls
//     orbitControls: true,
//     cameraPosition: new THREE.Vector3(0, 0, 10),
//   });

//   const frustumSize = 3;
//   const near = 90;
//   const far = 110;
//   const aspect = 1;
//   const camera = new THREE.OrthographicCamera(
//     -(frustumSize * aspect) / 2,
//     (frustumSize * aspect) / 2,
//     frustumSize / 2,
//     -frustumSize / 2,
//     near,
//     far
//   );

//   // const camera = new THREE.OrthographicCamera(
//   //   webgl.width / -2,
//   //   webgl.width / 2,
//   //   webgl.height / 2,
//   //   webgl.height / -2,
//   //   0.01,
//   //   1000
//   // );
//   // webgl.camera = camera;

//   // Update the camera used by the renderer
//   webgl.camera.updateProjectionMatrix();

//   // const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 3);
//   camera.position.set(0, 0, 10);
//   camera.lookAt(0, 0, 0);

//   const helper = new THREE.CameraHelper(camera);
//   // webgl.scene.add(helper);

//   // attach it to the window to inspect in the console
//   window.webgl = webgl;
//   // Create cube geometry with custom dimensions
//   const cubeWidth = 2;
//   const cubeHeight = 2;
//   const cubeDepth = 2;
//   const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
//   geometry.clearGroups();

//   // Define the distance of the point in 3D
//   const point = new THREE.Vector3(1.26092, -2.73594, 4.11874);
//   const center = new THREE.Vector3(0, 0, 0);
//   const distance = point.distanceTo(center);

//   console.log("Distance from the point to the center:", distance);

//   // webgl.camera.position.normalize().multiplyScalar(10);
//   // // FOV calculating
//   // const angle = Math.atan2(
//   //   geometry.parameters.height / 2,
//   //   webgl.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) -
//   //     geometry.parameters.depth / 2
//   // );
//   // const angleDegrees = (angle * 180) / Math.PI;
//   // webgl.camera.fov = angleDegrees * 2;

//   var materials = [];
//   for (let i = 0; i < 6; i++) {
//     var material;
//     material = new ProjectedMaterial({
//       camera,
//       texture,
//       textureScale: 1,
//       flatShading: true,
//       transparent: true,
//     });
//     materials.push(material);
//     geometry.addGroup(0, Infinity, i);
//   }

//   const mesh = new THREE.Mesh(geometry, materials);
//   const quaternion = new THREE.Quaternion(
//     -0.221083,
//     0.468124,
//     0.694217,
//     0.500046
//   );

//   const currentRotation = webgl.camera.rotation.clone();

//   // Convert Euler angles to quaternion
//   // const quaternion = new THREE.Quaternion().setFromEuler(currentRotation);

//   // Step 1: Invert quaternion1
//   const invQuaternion1 = quaternion.clone().invert();

//   // Step 2: Multiply quaternion1 by invQuaternion1 to get a double rotation
//   const doubleRotation = quaternion.clone().multiply(invQuaternion1);

//   // Step 3: Create a quaternion for a 180-degree rotation (angle in radians)
//   const angle180 = Math.PI; // 180 degrees in radians
//   const axis180 = new THREE.Vector3(1, 0, 0); // Choose an appropriate axis
//   const quaternion180 = new THREE.Quaternion().setFromAxisAngle(
//     axis180,
//     angle180
//   );

//   // Step 4: Multiply quaternion1 by quaternion180 to get quaternion2
//   const quaternion2 = quaternion.clone().multiply(quaternion180);

//   console.log(quaternion2);

//   console.log(quaternion);
//   for (let i = 0; i < 4; i++) {
//     mesh.material[i].project(mesh);
//     mesh.rotation.y += Math.PI / 2;
//   }
//   mesh.rotation.x += Math.PI / 2;
//   for (let i = 0; i < 2; i++) {
//     mesh.material[4 + i].project(mesh);
//     mesh.rotation.x += Math.PI;
//   }
//   mesh.rotation.x -= Math.PI / 2;
//   webgl.scene.add(mesh);

//   // add lights
//   const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
//   directionalLight.position.set(0, 10, 10);
//   webgl.scene.add(directionalLight);

//   const directionalLight2 = new THREE.DirectionalLight("#ffffff", 0.2);
//   directionalLight2.position.set(10, 0, -5);
//   webgl.scene.add(directionalLight2);

//   const ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
//   webgl.scene.add(ambientLight);
//   mesh.setRotationFromQuaternion(quaternion);
//   webgl.camera.position.normalize().multiplyScalar(5);

//   webgl.renderer.render(webgl.scene, camera);
//   var imgData = webgl.renderer.domElement.toDataURL();
//   var img = new Image();
//   img.src = imgData;
//   console.log(imgData);

//   /////////////////////////////////////////////////////////////
//   ////////////////////////start animation loop/////////////////
//   /////////////////////////////////////////////////////////////
//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();

//   function onMouseMove(event) {
//     // Convert mouse coordinates to normalized device coordinates (NDC)
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   }

//   // Assume you have a function to handle the mouse click event
//   webgl.onPointerUp((event, { x, y, dragX, dragY }) => {
//     // Return if we used the orbit controls
//     if (Math.hypot(dragX, dragY) > 2) {
//       return;
//     }

//     // Update the raycaster with the current mouse coordinates
//     raycaster.setFromCamera(mouse, webgl.camera);

//     // Perform raycasting to find intersected objects
//     const intersects = raycaster.intersectObjects(webgl.scene.children);

//     if (intersects.length > 0) {
//       // Log all intersections for debugging
//       console.log("All Intersections:", intersects);

//       // Get the first intersection point (closest to the camera)
//       const intersectionPoint = intersects[0].point;
//       const intersectionUV = intersects[0].uv;

//       // Use intersectionPoint as the 3D world coordinates of the clicked pixel
//       console.log("1. Intersection Point:", intersectionPoint);
//       console.log("2. Intersection UV:", intersectionUV);

//       // Check if the material is defined before accessing properties
//       if (intersects[0].object.material) {
//         const materialSide = intersects[0].object.material.side;
//         console.log("Material Side:", materialSide);
//       }
//     }
//   });

//   // Attach event listeners
//   window.addEventListener("mousemove", onMouseMove, false);
//   // window.addEventListener("click", onMouseClick, false);

//   /////////////////////////////////////////////////////////////
//   ////////////////////////start animation loop/////////////////
//   /////////////////////////////////////////////////////////////

//   webgl.start();
//   console.log(gltf ? gltf : "");
//   console.log(webgl.scene);
//   console.log(mesh);
//   console.log(material);
// });

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
/*Loading Mesh file*/
var gltf;
var texture;
texture = new THREE.TextureLoader().load("textures/uv.jpeg", (texture) => {
  console.log(texture);
  const webgl = new WebGLApp({
    canvas,
    // set the scene background color
    background: "#000000",
    // show the fps counter from stats.js
    showFps: true,
    // enable orbit-controls
    orbitControls: true,
    cameraPosition: new THREE.Vector3(0, 0, 10),
  });
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(1600, 1600);

  // attach it to the window to inspect in the console
  window.webgl = webgl;
  // Create cube geometry with custom dimensions
  const cubeWidth = 2;
  const cubeHeight = 2;
  const cubeDepth = 2;
  const geometry = new THREE.BoxGeometry(cubeWidth, cubeHeight, cubeDepth);
  geometry.clearGroups();
  //Adjust camera settings for projection

  const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 30);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  const helper = new THREE.CameraHelper(camera);
  webgl.scene.add(helper);

  // FOV calculating
  const angle = Math.atan2(
    geometry.parameters.height / 2,
    camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) -
      geometry.parameters.depth / 2
  );
  const angleDegrees = (angle * 180) / Math.PI;
  camera.fov = angleDegrees * 2;
  console.log(camera.fov);

  var materials = [];
  for (let i = 0; i < 6; i++) {
    var material;
    material = new ProjectedMaterial({
      camera,
      texture,
      textureScale: 1,
      flatShading: true,
      transparent: true,
    });
    materials.push(material);
    geometry.addGroup(0, Infinity, i);
  }

  const mesh = new THREE.Mesh(geometry, materials);

  for (let i = 0; i < 4; i++) {
    mesh.material[i].project(mesh);
    mesh.rotation.y += Math.PI / 2;
  }
  mesh.rotation.x += Math.PI / 2;
  for (let i = 0; i < 2; i++) {
    mesh.material[4 + i].project(mesh);
    mesh.rotation.x += Math.PI;
  }
  mesh.rotation.x -= Math.PI / 2;
  webgl.scene.add(mesh);
  const quaternion = new THREE.Quaternion(
    -0.221083,
    0.468124,
    0.694217,
    0.500046
  );

  quaternion.normalize();
  mesh.setRotationFromQuaternion(quaternion);

  // // add lights
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
    // Function to capture the image
    function captureImage() {
      // Render the scene
      // const width = 1080;
      // const height = 1080;
      // const renderTarget = new THREE.WebGLRenderTarget(width, height);
      // renderer.render(scene, camera, renderTarget);
      renderer.render(scene, camera);

      // Capture the rendered image as a data URL
      const imageDataURL = renderer.domElement.toDataURL("image/png");
      // const imageData = new Uint8Array(width * height * 4); // Allocate space for pixel data
      // renderer.readRenderTargetPixels(
      //   renderTarget,
      //   0,
      //   0,
      //   width,
      //   height,
      //   imageData
      // );
      // console.log(imageData);
      // Log the data URL (you can use it as an image source or for other purposes)
      console.log(imageDataURL);
    }
    captureImage();
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
});
