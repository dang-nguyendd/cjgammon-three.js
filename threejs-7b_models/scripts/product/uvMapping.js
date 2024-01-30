import * as THREE from "three";
const textureLoader = new THREE.TextureLoader();
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   90,
//   window.innerWidth / window.innerHeight,
//   0.01,
//   3000
// );

// const frustumSize = 10;
// const near = 0.1;
// const far = 20;
// const aspect = 1;
// const camera = new THREE.OrthographicCamera(
//   -(frustumSize * aspect) / 2,
//   (frustumSize * aspect) / 2,
//   frustumSize / 2,
//   -frustumSize / 2,
//   near,
//   far
// );

const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 30);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

// Create a cube geometry
const geometry = new THREE.BoxGeometry(2, 2, 2);

textureLoader.load("textures/Thermal_cube.png", (texture) => {
  const material = new THREE.MeshStandardMaterial({
    map: texture,
  });

  // Create a mesh using the geometry and material
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(1600, 1600);
  document.body.appendChild(renderer.domElement);

  // add lights
  const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
  directionalLight.position.set(0, 10, 10);
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight("#ffffff", 0.2);
  directionalLight2.position.set(10, 0, -5);
  scene.add(directionalLight2);

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
  scene.add(ambientLight);
  // Render the scene

  const helper = new THREE.CameraHelper(camera);
  scene.add(helper);
  // function animate() {
  //   requestAnimationFrame(animate);
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  //   renderer.render(scene, camera);
  // }

  const quaternion = new THREE.Quaternion(
    -0.221083,
    0.468124,
    0.694217,
    0.500046
  );
  cube.setRotationFromQuaternion(quaternion);
  cube.rotation.y = Math.PI;
  // const yAxis = new THREE.Quaternion(0, 0, 1, 0);
  // const oppositeQuaternion = yAxis.clone().multiply(quaternion);
  // const angle = quaternion.angleTo(oppositeQuaternion);
  // // Convert radians to degrees using THREE.MathUtils.radToDeg
  // const angleInDegrees = THREE.MathUtils.radToDeg(angle);

  // const oppositeQuaternion = quaternion.clone().conjugate();
  // cube.setRotationFromQuaternion(oppositeQuaternion);
  // animate();

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

  // Log the data URL (you can use it as an image source or for other purposes)

  console.log(renderer.info);
  // Optionally, create an image element and set its source
  const imageElement = new Image();
});
