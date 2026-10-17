/* ==========================================
   ZUMAR WONDERLAND
   3D GAME ENGINE
   ========================================== */

import * as THREE from "three";
import "./countries.js";
import "./pets.js";
import "./learning.js";

// ==========================================
// 1. GAME SETTINGS
// ==========================================

const settings = {
    moveSpeed: 0.18,
    jumpPower: 0.24,
    gravity: 0.012,
    worldSize: 500
};

const keys = {};

let scene;
let camera;
let renderer;
let player;
let playerBody;
let playerHead;
let moon;
let portal;
let clock;

let velocityY = 0;
let grounded = true;
let firstPerson = false;
let gameStarted = false;
let currentDestination = "Wonder City";

let cameraButton;
let gameMessage;
let gameContainer;
let notificationTimer;

// ==========================================
// 2. SELECT HTML ELEMENTS
// ==========================================

const $ = (selector) => document.querySelector(selector);

const loadingScreen = $("#loading-screen");
const mainMenu = $("#main-menu");
const gameScreen = $("#game-screen");
const worldScreen = $("#world-screen");
const petsScreen = $("#pets-screen");
const learningScreen = $("#learning-screen");
const characterScreen = $("#character-screen");

gameContainer = $("#game-container");
gameMessage = $("#game-message");
cameraButton = $("#camera-button");

// ==========================================
// 3. SCREEN NAVIGATION
// ==========================================

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.add("hidden");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.remove("hidden");
    }

    if (screenId === "game-screen") {
        startGame();

        setTimeout(resizeGame, 100);
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
        showScreen(button.dataset.screen);
    });
});

$("#home-button").addEventListener("click", () => {
    showScreen("main-menu");
});

$("#play-button").addEventListener("click", () => {
    showScreen("game-screen");
});

// ==========================================
// 4. NOTIFICATION SYSTEM
// ==========================================

function notify(message) {
    const notification = $("#notification");

    notification.textContent = message;
    notification.classList.remove("hidden");

    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(() => {
        notification.classList.add("hidden");
    }, 2800);
}

// ==========================================
// 5. CREATE THE 3D WORLD
// ==========================================

function createWorld() {
    if (renderer) return;

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x080b22);

    scene.fog = new THREE.FogExp2(0x080b22, 0.003);

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(
        70,
        1,
        0.1,
        1500
    );

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 1.5)
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    gameContainer.prepend(renderer.domElement);

    // LIGHTS

    const ambientLight = new THREE.HemisphereLight(
        0xaacbff,
        0x17102f,
        2.0
    );

    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(
        0x91baff,
        2.0
    );

    moonLight.position.set(-40, 70, -30);
    moonLight.castShadow = true;

    scene.add(moonLight);

    // FLOOR

    const floorGeometry = new THREE.PlaneGeometry(
        settings.worldSize,
        settings.worldSize
    );

    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x10162f,
        roughness: 0.8,
        metalness: 0.25
    });

    const floor = new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;

    scene.add(floor);

    // GLOWING GRID

    const grid = new THREE.GridHelper(
        settings.worldSize,
        100,
        0x4b6bff,
        0x24345e
    );

    grid.position.y = 0.025;

    scene.add(grid);

    // CREATE THE CITY

    createCity();

    // CREATE THE SKY

    createStars();

    createMoon();

    // CREATE THE PLAYER

    createPlayer();

    // CREATE THE PORTAL

    createPortal();

    // INITIAL CAMERA

    updateCamera();

    resizeGame();

    animate();
}

// ==========================================
// 6. CREATE FUTURISTIC BUILDINGS
// ==========================================

function createCity() {
    const buildingColours = [
        0x18244d,
        0x20204f,
        0x172f4f,
        0x30204f,
        0x15374a
    ];

    for (let x = -80; x <= 80; x += 16) {
        for (let z = -80; z <= 80; z += 16) {

            // Keep the central plaza clear.

            if (Math.abs(x) < 13 && Math.abs(z) < 13) {
                continue;
            }

            if (Math.random() > 0.78) {
                continue;
            }

            const width = 7 + Math.random() * 4;
            const depth = 7 + Math.random() * 4;
            const height = 8 + Math.random() * 36;

            const colour = buildingColours[
                Math.floor(Math.random() * buildingColours.length)
            ];

            const building = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshStandardMaterial({
                    color: colour,
                    metalness: 0.65,
                    roughness: 0.3,
                    emissive: colour,
                    emissiveIntensity: 0.08
                })
            );

            building.position.set(
                x + (Math.random() - 0.5) * 4,
                height / 2,
                z + (Math.random() - 0.5) * 4
            );

            building.castShadow = true;
            building.receiveShadow = true;

            scene.add(building);

            // Glowing windows

            const windowMaterial = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5
                    ? 0x48eaff
                    : 0xb28aff
            });

            const rows = Math.floor(height / 3);

            for (let row = 0; row < rows; row++) {
                for (let column = -1; column <= 1; column++) {

                    const windowMesh = new THREE.Mesh(
                        new THREE.BoxGeometry(0.65, 0.9, 0.08),
                        windowMaterial
                    );

                    windowMesh.position.set(
                        building.position.x + column * 1.7,
                        2 + row * 2.4,
                        building.position.z + depth / 2 + 0.05
                    );

                    scene.add(windowMesh);
                }
            }

            // Rooftop glow

            const roof = new THREE.Mesh(
                new THREE.BoxGeometry(
                    width + 0.5,
                    0.3,
                    depth + 0.5
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x5c8cff
                })
            );

            roof.position.set(
                building.position.x,
                height + 0.1,
                building.position.z
            );

            scene.add(roof);
        }
    }

    // CENTRAL PLAZA

    const plaza = new THREE.Mesh(
        new THREE.CylinderGeometry(11, 12, 0.4, 64),
        new THREE.MeshStandardMaterial({
            color: 0x25285a,
            metalness: 0.8,
            roughness: 0.25,
            emissive: 0x3725a3,
            emissiveIntensity: 0.3
        })
    );

    plaza.position.y = 0.2;

    scene.add(plaza);

    // Plaza rings

    for (let radius of [5, 8, 10]) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(radius, 0.08, 8, 80),
            new THREE.MeshBasicMaterial({
                color: 0x46eaff
            })
        );

        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.45;

        scene.add(ring);
    }
}

// ==========================================
// 7. CREATE STARS
// ==========================================

function createStars() {
    const starCount = 1800;

    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 800;

        positions[i * 3 + 1] = 25 + Math.random() * 250;

        positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.8,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(geometry, material);

    scene.add(stars);
}

// ==========================================
// 8. CREATE THE MOON
// ==========================================

function createMoon() {
    const geometry = new THREE.SphereGeometry(13, 32, 32);

    const material = new THREE.MeshBasicMaterial({
        color: 0xc4caff
    });

    moon = new THREE.Mesh(geometry, material);

    moon.position.set(-100, 100, -180);

    scene.add(moon);

    // Moon glow

    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(15, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0x6e87ff,
            transparent: true,
            opacity: 0.12
        })
    );

    glow.position.copy(moon.position);

    scene.add(glow);
}

// ==========================================
// 9. CREATE THE PLAYER
// ==========================================

function createPlayer() {
    player = new THREE.Group();

    const suitMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.5,
        roughness: 0.35
    });

    const darkMaterial = new THREE.MeshStandardMaterial({
        color: 0x171b39,
        metalness: 0.7,
        roughness: 0.3
    });

    // BODY

    playerBody = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.55, 1.0, 5, 12),
        suitMaterial
    );

    playerBody.position.y = 1.15;

    playerBody.castShadow = true;

    player.add(playerBody);

    // HELMET

    playerHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 24, 24),
        new THREE.MeshStandardMaterial({
            color: 0x252b55,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x171b55,
            emissiveIntensity: 0.5
        })
    );

    playerHead.position.y = 2.15;

    playerHead.castShadow = true;

    player.add(playerHead);

    // HELMET VISOR

    const visor = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.37,
            24,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        ),
        new THREE.MeshBasicMaterial({
            color: 0x46eaff
        })
    );

    visor.position.set(0, 2.18, -0.12);

    visor.rotation.x = -0.2;

    player.add(visor);

    // SHOULDERS

    for (const side of [-1, 1]) {
        const shoulder = new THREE.Mesh(
            new THREE.SphereGeometry(0.32, 16, 16),
            suitMaterial
        );

        shoulder.position.set(side * 0.65, 1.55, 0);

        player.add(shoulder);

        const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.34, 0.7, 0.4),
            darkMaterial
        );

        leg.position.set(side * 0.27, 0.45, 0);

        player.add(leg);
    }

    player.position.set(0, 0, 0);

    scene.add(player);
}

// ==========================================
// 10. CREATE THE PORTAL
// ==========================================

function createPortal() {
    portal = new THREE.Group();

    const outerRing = new THREE.Mesh(
        new THREE.TorusGeometry(4, 0.3, 16, 100),
        new THREE.MeshStandardMaterial({
            color: 0x8b5cf6,
            emissive: 0x713dff,
            emissiveIntensity: 2
        })
    );

    portal.add(outerRing);

    const innerRing = new THREE.Mesh(
        new THREE.TorusGeometry(3.5, 0.12, 12, 100),
        new THREE.MeshBasicMaterial({
            color: 0x46eaff
        })
    );

    portal.add(innerRing);

    const portalSurface = new THREE.Mesh(
        new THREE.CircleGeometry(3.4, 64),
        new THREE.MeshBasicMaterial({
            color: 0x3d20a8,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide
        })
    );

    portal.add(portalSurface);

    portal.position.set(0, 4, -35);

    scene.add(portal);
}

// ==========================================
// 11. CAMERA SYSTEM
// ==========================================

function updateCamera() {
    if (!player || !camera) return;

    if (firstPerson) {
        camera.position.set(
            player.position.x,
            player.position.y + 2.1,
            player.position.z
        );

        const direction = new THREE.Vector3(0, 0, -1);

        direction.applyQuaternion(player.quaternion);

        camera.lookAt(
            camera.position.clone().add(direction)
        );
    } else {
        const offset = new THREE.Vector3(0, 5, 10);

        offset.applyQuaternion(player.quaternion);

        camera.position.copy(
            player.position.clone().add(offset)
        );

        camera.lookAt(
            player.position.x,
            player.position.y + 1.5,
            player.position.z
        );
    }

    // Hide the character in first-person mode.

    player.visible = !firstPerson;
}

cameraButton.addEventListener("click", () => {
    firstPerson = !firstPerson;

    cameraButton.textContent = firstPerson
        ? "🎥 First Person"
        : "🎥 Third Person";

    updateCamera();

    notify(
        firstPerson
            ? "First-person view activated!"
            : "Third-person view activated!"
    );
});

// ==========================================
// 12. KEYBOARD CONTROLS
// ==========================================

window.addEventListener("keydown", (event) => {
    if (
        [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "Space"
        ].includes(event.code)
    ) {
        event.preventDefault();
    }

    keys[event.code] = true;

    if (
        event.code === "Space" &&
        grounded &&
        gameStarted &&
        !gameScreen.classList.contains("hidden")
    ) {
        velocityY = settings.jumpPower;

        grounded = false;
    }
});

window.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});

window.addEventListener("blur", () => {
    Object.keys(keys).forEach((key) => {
        keys[key] = false;
    });
});

// ==========================================
// 13. PLAYER MOVEMENT
// ==========================================

function movePlayer(delta) {
    if (!player || !gameStarted) return;

    if (gameScreen.classList.contains("hidden")) return;

    const forward =
        (keys.ArrowUp ? 1 : 0) -
        (keys.ArrowDown ? 1 : 0);

    const sideways =
        (keys.ArrowRight ? 1 : 0) -
        (keys.ArrowLeft ? 1 : 0);

    const movement = new THREE.Vector3(
        sideways,
        0,
        -forward
    );

    if (movement.lengthSq() > 0) {
        movement.normalize();

        // Move in the direction the character faces.

        movement.applyQuaternion(player.quaternion);

        const speed = settings.moveSpeed * Math.min(delta * 60, 2);

        player.position.x += movement.x * speed;

        player.position.z += movement.z * speed;

        // Turn the character towards movement.

        const angle = Math.atan2(
            movement.x,
            movement.z
        );

        player.rotation.y = angle + Math.PI;
    }

    // GRAVITY AND JUMPING

    if (!grounded) {
        velocityY -= settings.gravity * Math.min(delta * 60, 2);

        player.position.y += velocityY * Math.min(delta * 60, 2);

        if (player.position.y <= 0) {
            player.position.y = 0;

            velocityY = 0;

            grounded = true;
        }
    }

    // WORLD BOUNDARIES

    const limit = settings.worldSize / 2 - 5;

    player.position.x = THREE.MathUtils.clamp(
        player.position.x,
        -limit,
        limit
    );

    player.position.z = THREE.MathUtils.clamp(
        player.position.z,
        -limit,
        limit
    );

    updateCamera();
}

// ==========================================
// 14. GAME ANIMATION
// ==========================================

function animate() {
    requestAnimationFrame(animate);

    if (!renderer || !scene || !camera) return;

    const delta = Math.min(clock.getDelta(), 0.05);

    if (portal) {
        portal.rotation.y += delta * 0.4;

        portal.children[1].rotation.z += delta * 0.6;
    }

    if (moon) {
        moon.rotation.y += delta * 0.02;
    }

    movePlayer(delta);

    renderer.render(scene, camera);
}

// ==========================================
// 15. START THE GAME
// ==========================================

function startGame() {
    if (gameStarted) return;

    gameMessage.classList.remove("hidden");

    gameMessage.textContent = "🌌 Creating your futuristic world...";

    try {
        createWorld();

        gameStarted = true;

        gameMessage.classList.add("hidden");

        notify("Welcome to Wonder City! 🚀");
    } catch (error) {
        console.error("Game startup error:", error);

        gameMessage.textContent =
            "The 3D world could not load. Check your internet connection and refresh the page.";

        notify("The game couldn't start. Please refresh and try again.");
    }
}

// ==========================================
// 16. RESIZE THE GAME
// ==========================================

function resizeGame() {
    if (!renderer || !camera || !gameContainer) return;

    const width = gameContainer.clientWidth;
    const height = gameContainer.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}

window.addEventListener("resize", resizeGame);

// ==========================================
// 17. DESTINATION SYSTEM
// ==========================================

const destinations = [
    {
        name: "Wonder City",
        emoji: "🏙️",
        x: 0,
        z: 0
    },
    {
        name: "Paris",
        emoji: "🗼",
        x: 35,
        z: -35
    },
    {
        name: "London",
        emoji: "🇬🇧",
        x: -35,
        z: -35
    },
    {
        name: "New York",
        emoji: "🌆",
        x: 35,
        z: 35
    },
    {
        name: "Switzerland",
        emoji: "🏔️",
        x: -35,
        z: 35
    },
    {
        name: "Space Station",
        emoji: "🚀",
        x: 0,
        z: -60
    }
];

const destinationList = $("#destination-list");
const destinationsPanel = $("#destinations-panel");

destinations.forEach((destination) => {
    const button = document.createElement("button");

    button.className = "destination-card";

    button.textContent =
        `${destination.emoji} ${destination.name}`;

    button.addEventListener("click", () => {
        if (!player) return;

        player.position.set(
            destination.x,
            0,
            destination.z
        );

        currentDestination = destination.name;

        const hud = $(".game-hud .hud-pill");

        if (hud) {
            hud.textContent =
                `${destination.emoji} ${destination.name}`;
        }

        destinationsPanel.classList.add("hidden");

        updateCamera();

        notify(
            `Travelled to ${destination.name}! 🌀`
        );
    });

    destinationList.appendChild(button);
});

$("#destination-button").addEventListener("click", () => {
    destinationsPanel.classList.toggle("hidden");
});

$("#close-destinations").addEventListener("click", () => {
    destinationsPanel.classList.add("hidden");
});

// ==========================================
// 18. CHARACTER CUSTOMIZATION
// ==========================================

const characterNameInput = $("#character-name");
const suitColourInput = $("#suit-colour");
const characterPreview = $("#character-preview");
const characterMessage = $("#character-message");

function loadCharacter() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("zumarCharacter") || "{}"
        );

        if (saved.name) {
            characterNameInput.value = saved.name;
        }

        if (saved.colour) {
            suitColourInput.value = saved.colour;
        }
    } catch (error) {
        console.warn("Could not load the saved character.");
    }

    updateCharacterPreview();
}

function updateCharacterPreview() {
    const colour = suitColourInput.value;

    characterPreview.style.borderColor = colour;

    characterPreview.style.boxShadow =
        `0 0 35px ${colour}66`;

    if (playerBody && playerBody.material) {
        playerBody.material.color.set(colour);
    }
}

suitColourInput.addEventListener("input", () => {
    updateCharacterPreview();
});

$("#save-character").addEventListener("click", () => {
    const name = characterNameInput.value.trim();

    if (!name) {
        characterMessage.textContent =
            "Please choose a name for your explorer.";

        return;
    }

    const character = {
        name,
        colour: suitColourInput.value
    };

    try {
        localStorage.setItem(
            "zumarCharacter",
            JSON.stringify(character)
        );

        updateCharacterPreview();

        characterMessage.textContent =
            `Your explorer, ${name}, has been saved! ⭐`;

        notify("Character saved successfully!");
    } catch (error) {
        characterMessage.textContent =
            "Your browser couldn't save the character.";
    }
});

loadCharacter();

// ==========================================
// 19. LEARNING GARDEN CONNECTION
// ==========================================

document.querySelectorAll(".subject-button").forEach((button) => {
    button.addEventListener("click", () => {
        const subject = button.dataset.subject;

        if (typeof window.startLearningQuiz === "function") {
            window.startLearningQuiz(subject);
        } else {
            notify(
                `${subject} will be available when learning.js is connected.`
            );
        }
    });
});

// ==========================================
// 20. INITIAL LOADING SCREEN
// ==========================================

window.addEventListener("load", () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }
    }, 1200);
});

console.log("🌎 Zumar Wonderland game engine loaded!");
