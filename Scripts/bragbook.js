const bragForm = document.getElementById("brag-form");

const fields = {
  accomplishment: document.querySelectorAll("textarea")[0],
  learning: document.querySelectorAll("textarea")[1],
  braveMoment: document.querySelectorAll("textarea")[2],
  selfKindness: document.querySelectorAll("textarea")[3],
  image: document.getElementById("brag-image"),
  link: document.getElementById("brag-link"),
  pride: document.getElementById("pride-slider")
};

const prideLevels = {
  1: "😐 Meh",
  2: "🙂 A little proud",
  3: "😊 Proud",
  4: "😄 Very proud",
  5: "🎉 Super proud!"
};

// --- Preview Slider Emoji ---
const prideDisplay = document.createElement("p");
fields.pride.after(prideDisplay);
prideDisplay.textContent = prideLevels[fields.pride.value];

fields.pride.addEventListener("input", () => {
  prideDisplay.textContent = prideLevels[fields.pride.value];
});

// --- Preview Image ---
const imagePreview = document.createElement("img");
imagePreview.id = "image-preview";
imagePreview.style.display = "none";
imagePreview.style.maxWidth = "100%";
imagePreview.style.borderRadius = "10px";
imagePreview.style.marginTop = "1rem";
fields.image.after(imagePreview);

fields.image.addEventListener("change", () => {
  const file = fields.image.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }
});

// --- Save Entry ---
bragForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const today = new Date().toLocaleDateString();
  const newEntry = {
    date: today,
    accomplishment: fields.accomplishment.value.trim(),
    learning: fields.learning.value.trim(),
    braveMoment: fields.braveMoment.value.trim(),
    selfKindness: fields.selfKindness.value.trim(),
    link: fields.link.value.trim(),
    pride: parseInt(fields.pride.value),
    image: imagePreview.src || ""
  };

  let brags = JSON.parse(localStorage.getItem("bragBookEntries")) || [];

  brags.push(newEntry);
  localStorage.setItem("bragBookEntries", JSON.stringify(brags));

  alert("✨ Brag saved!");
  bragForm.reset();
  imagePreview.style.display = "none";
  displayTodaysBrags();
});

// --- Display Today's Brags (max 2) ---
function displayTodaysBrags() {
  const container = document.getElementById("brag-entries");
  const brags = JSON.parse(localStorage.getItem("bragBookEntries")) || [];
  const today = new Date().toLocaleDateString();

  const todaysBrags = brags
    .map((brag, index) => ({ ...brag, index }))
    .filter(brag => brag.date === today);

  container.innerHTML = "";

  if (todaysBrags.length === 0) {
    container.innerHTML = "<p>No brags yet for today. 🌱</p>";
    return;
  }

  const maxDisplay = 2;
  const visibleBrags = todaysBrags.slice(-maxDisplay).reverse();

  visibleBrags.forEach(entry => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("brag-entry");

    entryDiv.innerHTML = `
      <p><strong>🎯 Accomplishment:</strong> ${entry.accomplishment}</p>
      <p><strong>🧠 Learned:</strong> ${entry.learning}</p>
      <p><strong>💪 Brave Moment:</strong> ${entry.braveMoment}</p>
      <p><strong>💖 Self-Kindness:</strong> ${entry.selfKindness}</p>
      <p><strong>🌟 Pride:</strong> ${prideLevels[entry.pride]}</p>
      ${entry.link ? `<p><strong>🔗 Link:</strong> <a href="${entry.link}" target="_blank">${entry.link}</a></p>` : ""}
      ${entry.image ? `<img src="${entry.image}" alt="Brag Image" class="brag-img" />` : ""}
      <div class="brag-actions">
        <button class="entry-btn edit" data-index="${entry.index}">✏️ Edit</button>
        <button class="entry-btn delete" data-index="${entry.index}">🗑️ Delete</button>
      </div>
    `;

    container.appendChild(entryDiv);
  });

  attachDeleteListeners();
  attachEditListeners();
}

// --- Delete ---
function attachDeleteListeners() {
  document.querySelectorAll(".entry-btn.delete").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this brag?")) {
        const index = parseInt(btn.dataset.index);
        const brags = JSON.parse(localStorage.getItem("bragBookEntries")) || [];
        brags.splice(index, 1);
        localStorage.setItem("bragBookEntries", JSON.stringify(brags));
        displayTodaysBrags();
      }
    });
  });
}

// --- Edit ---
function attachEditListeners() {
  document.querySelectorAll(".entry-btn.edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      const brags = JSON.parse(localStorage.getItem("bragBookEntries")) || [];
      const entry = brags[index];

      fields.accomplishment.value = entry.accomplishment;
      fields.learning.value = entry.learning;
      fields.braveMoment.value = entry.braveMoment;
      fields.selfKindness.value = entry.selfKindness;
      fields.link.value = entry.link;
      fields.pride.value = entry.pride;
      prideDisplay.textContent = prideLevels[entry.pride];
      imagePreview.src = entry.image || "";
      imagePreview.style.display = entry.image ? "block" : "none";

      // Remove to allow re-save
      brags.splice(index, 1);
      localStorage.setItem("bragBookEntries", JSON.stringify(brags));
      displayTodaysBrags();
    });
  });
}

document.addEventListener("DOMContentLoaded", displayTodaysBrags);
