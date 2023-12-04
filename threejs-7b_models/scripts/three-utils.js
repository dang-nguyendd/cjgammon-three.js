import { mergeBufferGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// from https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
export function visibleHeightAtZDepth(depth, camera) {
  if (camera.isOrthographicCamera) {
    return Math.abs(camera.top - camera.bottom);
  }

  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if (depth < cameraOffset) {
    depth -= cameraOffset;
  } else {
    depth += cameraOffset;
  }

  // vertical fov in radians
  const vFOV = (camera.fov * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
}

export function visibleWidthAtZDepth(depth, camera) {
  if (camera.isOrthographicCamera) {
    return Math.abs(camera.right - camera.left);
  }

  const height = visibleHeightAtZDepth(depth, camera);
  return height * camera.aspect;
}

// extract all geometry from a gltf scene
export function extractGeometry(gltf) {
  const geometries = [];
  gltf.traverse((child) => {
    if (child.isMesh) {
      geometries.push(child.geometry);
    }
  });

  return mergeBufferGeometries(geometries);
}

// promise wrapper of the GLTFLoader
export function loadGltf(url) {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(url, resolve, null, reject);
  });
}

export function monkeyPatch(
  shader,
  { defines = "", header = "", main = "", ...replaces }
) {
  let patchedShader = shader;

  const replaceAll = (str, find, rep) => str.split(find).join(rep);
  Object.keys(replaces).forEach((key) => {
    patchedShader = replaceAll(patchedShader, key, replaces[key]);
  });

  patchedShader = patchedShader.replace(
    "void main() {",
    `
    ${header}
    void main() {
      ${main}
    `
  );

  const stringDefines = Object.keys(defines)
    .map((d) => `#define ${d} ${defines[d]}`)
    .join("\n");

  return `
    ${stringDefines}
    ${patchedShader}
  `;
}

// run the callback when the image will be loaded
export function addLoadListener(texture, callback) {
  // return if it's already loaded
  if (
    texture.image &&
    texture.image.videoWidth !== 0 &&
    texture.image.videoHeight !== 0
  ) {
    return;
  }

  const interval = setInterval(() => {
    if (
      texture.image &&
      texture.image.videoWidth !== 0 &&
      texture.image.videoHeight !== 0
    ) {
      clearInterval(interval);
      return callback(texture);
    }
  }, 16);
}
