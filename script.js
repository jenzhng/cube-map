// Ensure Three.js and OrbitControls are included
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

if (!THREE || !THREE.OrbitControls) {
    console.error("Three.js or OrbitControls library is not loaded.");
}

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-container').appendChild(renderer.domElement);

// Create a cube map texture using BMP images
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
    'https://raw.githubusercontent.com/jenzhng/cube-map/main/files/nvposx.bmp', // positive x
    'https://raw.githubusercontent.com/jenzhng/cube-map/main/files/nvnegx.bmp', // negative x
    'https://raw.githubusercontent.com/jenzhng/cube-map/main/files/nvposy.bmp', // positive y
    'https://raw.githubusercontent.com/jenzhng/cube-map/main/files/nvnegy.bmp', // negative y
    'https://raw.githubusercontent.com/jenzhng/cube-map/main/files/nvposz.bmp', // positive z
    'https://raw.githubusercontent.com/jenzhng/cube-map/main/files/nvnegz.bmp'  // negative z
], undefined, undefined, (err) => {
    console.error("An error occurred while loading the textures:", err);
});

// Set the scene background to the cube map texture
scene.background = cubeTexture;

// Create a reflective sphere
const sphereGeometry = new THREE.SphereGeometry(500, 64, 32); // Large sphere to encompass the scene
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    envMap: cubeTexture,
    metalness: 1.0, // High metalness for a reflective effect
    roughness: 0.0, // Low roughness for high reflectivity
    side: THREE.FrontSide // Render the outside of the sphere
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Set up initial camera position
const radius = 1000; // Distance from the center of the sphere
camera.position.set(radius, 0, 0);
camera.lookAt(scene.position);

// Add a point light to illuminate the sphere
const light = new THREE.PointLight(0xffffff, 1, 10000);
light.position.set(1000, 1000, 1000);
scene.add(light);

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // The center of the sphere
controls.update(); // Ensure the controls are updated

// Create GUI for controlling sphere material properties and camera position
const gui = new dat.GUI();
const guiControls = {
    metalness: 1.0,
    roughness: 0.0,
    radius: 1000,
    fullscreen: () => toggleFullScreen()
};

// Add GUI controls for sphere material properties
gui.add(guiControls, 'metalness', 0, 1).step(0.01).name('Metalness').onChange(value => {
    sphereMaterial.metalness = value;
});
gui.add(guiControls, 'roughness', 0, 1).step(0.01).name('Roughness').onChange(value => {
    sphereMaterial.roughness = value;
});

// Add GUI controls for camera distance
gui.add(guiControls, 'radius', 500, 2000).step(10).name('Camera Radius').onChange(value => {
    camera.position.set(value, 0, 0);
    camera.lookAt(scene.position);
});

// Add GUI control for fullscreen toggle
gui.add(guiControls, 'fullscreen').name('Toggle Fullscreen');

// Function to toggle fullscreen mode
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
}

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
