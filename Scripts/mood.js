// Summary Data Storage/Display
const summaryData = {
  mood: null,
  energy: null,
  stress: null,
  reflection: "",
  kindness: false,
  date: "",
};

function updateSummary() {
  const summaryBox = document.getElementById("summary-box");
  let summaryHTML = "";

  if (summaryData.mood) {
    summaryHTML += `<p><strong>Mood:</strong> ${summaryData.mood}</p>`;
  }

  if (summaryData.energy !== null) {
    summaryHTML += `<p><strong>Energy:</strong> ${summaryData.energy}/10</p>`;
  }

  if (summaryData.stress !== null) {
    summaryHTML += `<p><strong>Stress:</strong> ${summaryData.stress}/10</p>`;
  }

  if (summaryData.kindness) {
    summaryHTML += `<p>💖 You did something kind today!</p>`;
  }

  if (summaryData.reflection) {
    summaryHTML += `<p><strong>Your Reflection:</strong> "${summaryData.reflection}"</p>`;
  }

  // Default message if nothing filled
  if (summaryHTML === "") {
    summaryBox.innerHTML =
      "<p>Fill in your day’s details to see your summary 🌱</p>";
  } else {
    summaryBox.innerHTML = summaryHTML;
  }
}
// Soulful Tips
const soulTips = {
  Happy:
    "Enjoy this moment — you deserve every bit of this joy 🌞\n\n**Mini Task:** 🌻 Send a kind message to someone.",
  Anxious:
    "Breathe deeply, you're doing better than you think 🫶\n\n**Mini Task:** 🧘 Try a 2-minute breathing exercise.",
  Tired:
    "Your body and mind need rest — be gentle with yourself 😴\n\n**Mini Task:** 💤 Close your eyes or stretch for 5 minutes.",
  Angry:
    "It’s okay to feel anger. Let it pass like a cloud ☁️\n\n**Mini Task:** ✍️ Write one thing bothering you in the journal.",
  Sad: "Let your tears fall. You’ll bloom again 💧\n\n**Mini Task:** 🎵 Play a comforting song or revisit a happy photo.",
};

// Buttons
const moodButtons = document.querySelectorAll(".mood-btn");
const soulTip = document.getElementById("soul-tip");
moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moodButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    const selectedMood = button.querySelector(".mood-label").textContent;
    summaryData.mood = selectedMood;
    updateSummary();
    soulTip.innerHTML =
      soulTips[selectedMood]
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>") ||
      "You’re doing your best, and that’s enough 💖";
  });
});

// Energy/Stress Sliders
const energySlider = document.getElementById("energy-range");
const stressSlider = document.getElementById("stress-range");
const energyValueSpan = document.getElementById("energy-value");
const stressValueSpan = document.getElementById("stress-value");

energySlider.addEventListener("input", () => {
  const value = energySlider.value;
  summaryData.energy = value;
  energyValueSpan.textContent = value + " " + getEnergyEmoji(value);
  updateSummary();
});

stressSlider.addEventListener("input", () => {
  const value = stressSlider.value;
  summaryData.stress = value;
  stressValueSpan.textContent = value + " " + getStressEmoji(value);
  updateSummary();
});

function getEnergyEmoji(value) {
  const num = parseInt(value);
  if (num <= 2) return "🪫";
  if (num <= 5) return "🔋";
  if (num <= 8) return "⚡";
  return "🚀";
}

function getStressEmoji(value) {
  const num = parseInt(value);
  if (num <= 2) return "😌";
  if (num <= 5) return "😐";
  if (num <= 8) return "😰";
  return "😵‍💫";
}

// Reflection Input
const reflectionInput = document.getElementById("reflection-input");

reflectionInput.addEventListener("input", () => {
  const text = reflectionInput.value.trim();
  summaryData.reflection = text;
  updateSummary();
});
const charProgressFill = document.getElementById("char-progress-fill");
const maxChars = reflectionInput.maxLength || 500;

reflectionInput.addEventListener("input", () => {
  const currentLength = reflectionInput.value.length;
  const percentage = (currentLength / maxChars) * 100;
  charProgressFill.style.width = `${percentage}%`;
  summaryData.reflection = reflectionInput.value.trim();
  updateSummary();
});
// Save Buttons
const saveBtn = document.getElementById("save-reflection");
const editBtn = document.getElementById("edit-reflection");
const deleteBtn = document.getElementById("delete-reflection");

saveBtn.addEventListener("click", () => {
  const text = reflectionInput.value.trim();
  if (text) {
    localStorage.setItem("todayReflection", text);
    reflectionInput.disabled = true;
    updateSummary();
    summaryData.reflection = text;
    saveEntryToLocalStorage();
  }
});

editBtn.addEventListener("click", () => {
  reflectionInput.disabled = false;
  reflectionInput.focus();
});

deleteBtn.addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure? This will delete your reflection for today.");
  
  if (confirmDelete) {
    localStorage.removeItem("todayReflection");
    reflectionInput.value = "";
    reflectionInput.disabled = false;
    summaryData.reflection = "";
    updateSummary();
  }
});

// Kindness
const kindnessToggle = document.getElementById("kindness-toggle");
const kindnessFeedback = document.getElementById("kindness-feedback");

kindnessToggle.addEventListener("change", () => {
  summaryData.kindness = kindnessToggle.checked;

  if (kindnessToggle.checked) {
    kindnessFeedback.style.display = "block";
    launchConfetti();
  } else {
    kindnessFeedback.style.display = "none";
  }

  updateSummary();
});
function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// local Storage
function saveEntryToLocalStorage() {
  const now = new Date();
  const today = now.toLocaleDateString(); 
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g. "03:27 PM"

  const newEntry = {
    ...summaryData,
    date: today,
    time: time
  };

  const existingEntries = JSON.parse(localStorage.getItem('soulSyncEntries')) || [];
  existingEntries.push(newEntry);

  localStorage.setItem('soulSyncEntries', JSON.stringify(existingEntries));
  console.log('📝 New entry saved:', newEntry);
  alert("🌿 Your entry has been saved!");
}

function loadTodaySummaryOnly() {
  const today = new Date().toLocaleDateString();
  const entries = JSON.parse(localStorage.getItem('soulSyncEntries')) || [];

  // Filter only today’s entries
  const todayEntries = entries.filter(entry => entry.date === today);

  const summaryBox = document.getElementById('summary-box');

  if (todayEntries.length === 0) {
    summaryBox.innerHTML = '<p>Fill in your day’s details to see your summary 🌱</p>';
    return;
  }

  const latestEntry = todayEntries[todayEntries.length - 1];

  let summaryHTML = '';

  if (latestEntry.mood) {
    summaryHTML += `<p><strong>Mood:</strong> ${latestEntry.mood}</p>`;
  }
  if (latestEntry.energy !== null) {
    summaryHTML += `<p><strong>Energy:</strong> ${latestEntry.energy}/10</p>`;
  }
  if (latestEntry.stress !== null) {
    summaryHTML += `<p><strong>Stress:</strong> ${latestEntry.stress}/10</p>`;
  }
  if (latestEntry.kindness) {
    summaryHTML += `<p>💖 You did something kind today!</p>`;
  }
  if (latestEntry.reflection) {
    summaryHTML += `<p><strong>Your Reflection:</strong> "${latestEntry.reflection}"</p>`;
  }

  // Add entry count note
  summaryHTML += `
  <div class="entry-count">
    📝 <span>${todayEntries.length}</span> entr${todayEntries.length === 1 ? 'y' : 'ies'} logged today
  </div>
`;

  summaryBox.innerHTML = summaryHTML;
}
loadTodaySummaryOnly();
