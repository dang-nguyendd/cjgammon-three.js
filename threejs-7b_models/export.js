import { GLTFExporter } from "C:Users/Admin/Documents/Github/cjgammon-three.js/node_modules/three/examples/jsm/exporters/GLTFExporter.js";
// ... Your existing code ...

// Create a GLTF exporter
const gltfExporter = new GLTFExporter();

// Function to trigger the export
function exportGLTF() {
  // Export the scene to GLTF format
  gltfExporter.parse(
    scene,
    function (result) {
      // Save the result as a GLB file
      saveByteArray(result, "exported_sphere.glb");
    },
    { binary: true }
  );
}

// Function to save the GLB data as a file
function saveByteArray(data, name) {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}

// ... Continue with your existing code ...

// Add an event listener to trigger export when a key is pressed (for example, 'E' key)
document.addEventListener("keydown", function (event) {
  if (event.key === "e") {
    exportGLTF();
  }
});
