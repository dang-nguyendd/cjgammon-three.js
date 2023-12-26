import * as THREE from "three";
import ProjectedMaterial from "https://unpkg.com/three-projected-material/build/ProjectedMaterial.module.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

async function importModel(src) {
  var gltf;
  gltf = await loadGltf(src);
  const geometry = extractGeometry(gltf.scene);
  geometry.clearGroups();
  return geometry;
}

function onMouseMove(event) {
  // Convert mouse coordinates to normalized device coordinates (NDC)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function dataExtraction(event, { x, y, dragX, dragY }) {
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
    // if (intersects[0].object.material) {
    //   const materialSide = intersects[0].object.material.side;
    //   console.log("Material Side:", materialSide);
    // }
  }
}

function addLights() {
  // add lights
  const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
  directionalLight.position.set(0, 10, 10);
  webgl.scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight("#ffffff", 0.2);
  directionalLight2.position.set(10, 0, -5);
  webgl.scene.add(directionalLight2);

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
  webgl.scene.add(ambientLight);
}

function createMaterial(src, geometry) {
  var texture;
  var material;
  var mesh;

  texture = new THREE.TextureLoader().load(src);
  material = new ProjectedMaterial({
    camera: webgl.camera,
    side: THREE.DoubleSide,
    texture,
    textureScale: 1,
    flatShading: true,
    transparent: true,
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.material.project(mesh);
  webgl.scene.add(mesh);
  return { texture, material, mesh };
}

var materials = [];
function createMultipleMaterials(src, geometry, mesh) {
  var texture;
  var material;
  geometry.addGroup(0, Infinity, materials.length);
  texture = new THREE.TextureLoader().load(src);
  material = new ProjectedMaterial({
    camera: webgl.camera,
    side: THREE.DoubleSide,
    texture,
    textureScale: 1,
    flatShading: true,
    transparent: true,
  });
  materials.push(material);
  mesh.materials = materials;
  mesh.material[materials.length - 1].project(mesh);
  webgl.scene.add(mesh);
  return { texture, material };
}

function setCameraDistance(distance, geometry) {
  webgl.camera.position.normalize().multiplyScalar(distance);
  // FOV calculating
  const angle = Math.atan2(
    geometry.parameters.height / 2,
    webgl.camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
  );
  const angleDegrees = (angle * 180) / Math.PI;
  webgl.camera.fov = angleDegrees * 2;
}

function setCameraDistanceSphere(distance, geometry) {
  webgl.camera.position.normalize().multiplyScalar(distance);
  // FOV calculating
  const angle = Math.atan2(
    geometry.parameters.radius,
    webgl.camera.position.distanceTo(new THREE.Vector3(0, 0, 0))
  );
  const angleDegrees = (angle * 180) / Math.PI;
  webgl.camera.fov = angleDegrees * 2.1;
}

/*Normalisation*/
function normaliseData(value) {
  const maxValue = geometry.parameters.radius;
  const minValue = -1 * maxValue;
  // Ensure the value is within the specified range
  value = Math.max(minValue, Math.min(maxValue, value));

  // Normalize the value to [0, 1]
  return (value - minValue) / (maxValue - minValue);
}

/*Export result.glb and bind to "s" key*/

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

export {
  dataExtraction,
  onMouseMove,
  addLights,
  setCameraDistance,
  createMaterial,
  importModel,
  setCameraDistanceSphere,
  materials,
  createMultipleMaterials,
};
