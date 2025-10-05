import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js";

// Core setup
const canvas = document.getElementById("viewport");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x08121a);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
camera.position.set(6, 4, 6);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

const root = new THREE.Group();
scene.add(root);

// Lighting and environment
scene.add(new THREE.HemisphereLight(0xaaaaee, 0x222222, 0.6));
const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7);
dir.castShadow = true;
scene.add(dir);

const grid = new THREE.GridHelper(50, 50, "#24303a", "#182126");
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

// Elements
const hierarchyEl = document.getElementById("hierarchy");
const consoleEl = document.getElementById("console");
const statsEl = document.getElementById("stats");
let selected = null, running = false, lastTime = performance.now();
const physicsObjects = new Set();
const gravity = new THREE.Vector3(0, -9.81, 0);

function log(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  consoleEl.prepend(el);
}

// Object creators
function createCube() {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x88aaff })
  );
  m.name = "Cube";
  m.position.y = 1;
  root.add(m);
  updateHierarchy(m);
  log("Cube added");
}

function createSphere() {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.6, 24, 16),
    new THREE.MeshStandardMaterial({ color: 0xffb86b })
  );
  m.name = "Sphere";
  m.position.y = 1;
  root.add(m);
  updateHierarchy(m);
  log("Sphere added");
}

function createLight() {
  const l = new THREE.PointLight(0xffffff, 1, 15);
  l.name = "PointLight";
  l.position.set(2, 4, 2);
  root.add(l);
  updateHierarchy(l);
  log("Light added");
}

// Hierarchy management
function updateHierarchy(obj) {
  const el = document.createElement("div");
  el.className = "object-item";
  el.textContent = obj.name;
  el.onclick = () => selectObject(obj, el);
  hierarchyEl.prepend(el);
}

function selectObject(obj, el) {
  selected = obj;
  Array.from(hierarchyEl.children).forEach(c => c.classList.remove("selected"));
  if (el) el.classList.add("selected");
  log(`Selected ${obj.name}`);
}

// UI
document.getElementById("btnAddCube").onclick = createCube;
document.getElementById("btnAddSphere").onclick = createSphere;
document.getElementById("btnAddLight").onclick = createLight;

document.getElementById("btnPlay").onclick = () => { running = true; log("Play"); };
document.getElementById("btnPause").onclick = () => { running = false; log("Pause"); };
document.getElementById("btnStop").onclick = () => { running = false; log("Stop"); };

// Resize and render
function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
new ResizeObserver(resize).observe(canvas);
resize();

let frames = 0, fpsTime = performance.now();
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  orbit.update();
  renderer.render(scene, camera);
  frames++;
  if (now - fpsTime > 500) {
    statsEl.textContent = `FPS: ${Math.round((frames * 1000) / (now - fpsTime))}`;
    frames = 0; fpsTime = now;
  }
}
animate();

// Starter objects
createCube();
createSphere();
createLight();
log("Starter scene ready.");
