import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls;
let objects = [];
let isPlaying = false;
let clock = new THREE.Clock();

init();
animate();

function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(3, 3, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("viewport"), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  // Default light
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(3, 5, 2);
  scene.add(directional);

  // Add ground
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  // Events
  window.addEventListener("resize", onWindowResize);
  document.getElementById("play").addEventListener("click", playScene);
  document.getElementById("pause").addEventListener("click", pauseScene);
  document.getElementById("stop").addEventListener("click", stopScene);
  document.getElementById("addCube").addEventListener("click", addCube);
  document.getElementById("addSphere").addEventListener("click", addSphere);
  document.getElementById("addLight").addEventListener("click", addLight);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addCube() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(Math.random() * 4 - 2, 1, Math.random() * 4 - 2);
  scene.add(cube);
  objects.push(cube);
}

function addSphere() {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff5500 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(Math.random() * 4 - 2, 1, Math.random() * 4 - 2);
  scene.add(sphere);
  objects.push(sphere);
}

function addLight() {
  const light = new THREE.PointLight(0xffffff, 1, 20);
  light.position.set(Math.random() * 6 - 3, 3, Math.random() * 6 - 3);
  scene.add(light);
}

function playScene() {
  isPlaying = true;
}

function pauseScene() {
  isPlaying = false;
}

function stopScene() {
  isPlaying = false;
  objects.forEach((obj) => {
    obj.rotation.set(0, 0, 0);
  });
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (isPlaying) {
    objects.forEach((obj) => {
      obj.rotation.y += delta;
      obj.rotation.x += delta * 0.5;
    });
  }

  controls.update();
  renderer.render(scene, camera);
}
