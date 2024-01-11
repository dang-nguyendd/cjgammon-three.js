import * as THREE from "three";
import WebGLApp from "../WebGLApp.js";

const loader = new THREE.TextureLoader();
loader.load("textures/uv.jpeg", (texture) => {
  const canvas = document.getElementById("myCanvas");
  canvas.width = 600;
  canvas.height = 600;
  console.log(canvas.width, "  ", canvas.height);
  const context = canvas.getContext("2d");
  context.drawImage(texture.image, 0, 0);

  const data = context.getImageData(0, 0, canvas.width, canvas.height);
  console.log(data);

  // invert colors
  //   for (let i = 0; i < data.data.length; i += 4) {
  //     data.data[i] = 255 - data.data[i];
  //     data.data[i + 1] = 255 - data.data[i + 10];
  //     data.data[i + 2] = 255 - data.data[i + 2];
  //     data.data[i + 3] = 255;
  //   }
  //   context.putImageData(data, 0, 0);
  document.addEventListener("click", (event) => {
    var xCoordinate = event.clientX;
    var yCoordinate = event.clientY;
    var r, g, b, a;
    // xCoordinate = normalize(event.clientX, 0, canvas.height);
    // yCoordinate = normalize(event.clientY, 0, canvas.width);
    r = data.data[(yCoordinate * texture.image.width + xCoordinate) * 4];
    g = data.data[(yCoordinate * texture.image.width + xCoordinate) * 4 + 1];
    b = data.data[(yCoordinate * texture.image.width + xCoordinate) * 4 + 2];
    a = data.data[(yCoordinate * texture.image.width + xCoordinate) * 4 + 3];
    console.log("Color:", r, g, b, a);
    console.log(
      "Clicked at coordinates: (" + xCoordinate + ", " + yCoordinate + ")"
    );
  });
});

function normalize(value, min, max) {
  // Use the provided value instead of finding min and max from an array
  const dataMin = min;
  const dataMax = max;

  // Calculate the range
  const dataRange = dataMax - dataMin;

  // Apply the normalization formula to the single value
  //   const normalizedValue = ((value - dataMin) / dataRange) * (max - min) + min;
  const normalizedValue = (value - dataMin) / dataRange;
  return normalizedValue;
}
