var A = 0.44;
var n = 3;
var uSteps = 249,
  vSteps = 249;
var pi = Math.PI;

// parameterization -------------------------------------------------
function f0(u, v, A, n) {
  // both u and v run from zero to one in Three.js
  var t = n * 2 * pi * u;
  var phi = 2 * pi * v;
  var h = pi / 2 - (pi / 2 - A) * Math.cos(t);
  var sinh = Math.sin(h);
  var p2 = sinh * Math.cos(t / n + A * Math.sin(2 * t));
  var p3 = sinh * Math.sin(t / n + A * Math.sin(2 * t));
  var p1 = Math.cos(h);
  var yden = Math.sqrt(2 * (1 + p1));
  var y1 = (1 + p1) / yden;
  var y2 = p2 / yden;
  var y3 = p3 / yden;
  var cosphi = Math.cos(phi);
  var sinphi = Math.sin(phi);
  var x3 = cosphi * y1; // changed
  var x4 = sinphi * y1; // changed
  var x2 = cosphi * y2 - sinphi * y3;
  var x1 = cosphi * y3 + sinphi * y2;
  return new THREE.Vector3(x1 / (1 - x4), x2 / (1 - x4), x3 / (1 - x4));
}
function g(A, n) {
  return function f(u, v, vector) {
    var out = f0(u, v, A, n);
    vector.set(out.x, out.y, out.z);
  };
}

// dat.gui controls -------------------------------------------------
var dgcontrols = new (function () {
  this.rotationSpeed = 0.001;
  this.A = A;
  this.n = n;
  this.cameraz = 17;
})();
var gui = new dat.GUI({ autoplace: false, width: 300 });
gui.add(dgcontrols, "cameraz").min(10).max(30).step(1).name("Camera position");
gui.add(dgcontrols, "rotationSpeed").min(0).max(0.005).name("Rotation speed");
var controller_A = gui.add(dgcontrols, "A").min(0.1).max(1.3).step(0.02);
controller_A.onFinishChange(function (value) {
  Rendering(value, dgcontrols.n);
});
var controller_n = gui
  .add(dgcontrols, "n")
  .min(1)
  .max(10)
  .step(1)
  .name("Number of lobes");
controller_n.onFinishChange(function (value) {
  Rendering(dgcontrols.A, value);
});
