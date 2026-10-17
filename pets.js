```javascript
// ZUMAR WONDERLAND — VIRTUAL PETS 🐾

const pets = [
  { name: "Bunny", emoji: "🐰", description: "A fluffy, friendly bunny!" },
  { name: "Bear", emoji: "🐻", description: "A cuddly bear who loves adventures!" },
  { name: "Cat", emoji: "🐱", description: "A playful cat who loves attention!" },
  { name: "Fox", emoji: "🦊", description: "A clever fox who loves exploring!" },
  { name: "Panda", emoji: "🐼", description: "A sleepy panda who loves snacks!" },
  { name: "Dragon", emoji: "🐉", description: "A magical dragon with big dreams!" }
];

let selectedPet = localStorage.getItem("zw-selected-pet") || "Bunny";

let petStats = JSON.parse(
  localStorage.getItem("zw-pet-stats") ||
  '{"hunger":80,"happiness":80}'
);

function savePetProgress() {
  localStorage.setItem("zw-selected-pet", selectedPet);
  localStorage.setItem("zw-pet-stats", JSON.stringify(petStats));
}

function showPetMessage(message) {
  const box = document.getElementById("pet-message");
  if (box) box.textContent = message;
}

function renderPets() {
  const list = document.getElementById("pet-list");
  if (!list) return;

  list.innerHTML = "";

  pets.forEach((pet) => {
    const button = document.createElement("button");
    button.className = "pet-choice";
    button.type = "button";
    button.style.cssText =
      "padding:16px;margin:6px;border-radius:14px;" +
      "border:2px solid #a78bfa;background:#24133f;" +
      "color:white;cursor:pointer;font-size:16px;";

    button.innerHTML =
      `<div style="font-size:38px">${pet.emoji}</div>` +
      `<strong>${pet.name}</strong>`;

    if (pet.name === selectedPet) {
      button.style.borderColor = "#22d3ee";
    }

    button.addEventListener("click", () => {
      selectedPet = pet.name;
      savePetProgress();
      renderPets();
      updateSelectedPet();
      showPetMessage(`You chose ${pet.name}! ${pet.description}`);
    });

    list.appendChild(button);
  });
}

function updateSelectedPet() {
  const pet = pets.find((item) => item.name === selectedPet);
  if (!pet) return;

  const display = document.getElementById("selected-pet");
  if (display) {
    display.innerHTML = `
      <div style="font-size:70px">${pet.emoji}</div>
      <h3>${pet.name}</h3>
      <p>${pet.description}</p>
      <p>🍎 Hunger: ${petStats.hunger}/100</p>
      <p>❤️ Happiness: ${petStats.happiness}/100</p>
    `;
  }
}

function feedSelectedPet() {
  petStats.hunger = Math.min(100, petStats.hunger + 20);
  petStats.happiness = Math.min(100, petStats.happiness + 5);

  savePetProgress();
  updateSelectedPet();
  showPetMessage(`Yummy! Your ${selectedPet.toLowerCase()} enjoyed its snack! 🍎`);
}

function playWithSelectedPet() {
  petStats.happiness = Math.min(100, petStats.happiness + 20);
  petStats.hunger = Math.max(0, petStats.hunger - 5);

  savePetProgress();
  updateSelectedPet();
  showPetMessage(`Wheee! Your ${selectedPet.toLowerCase()} had fun playing! 🎾`);
}

function connectPetButtons() {
  const feedButton = document.getElementById("feed-pet");
  const playButton = document.getElementById("play-pet");

  if (feedButton) feedButton.addEventListener("click", feedSelectedPet);
  if (playButton) playButton.addEventListener("click", playWithSelectedPet);

  renderPets();
  updateSelectedPet();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", connectPetButtons);
} else {
  connectPetButtons();
}
```

