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

// Add pride label below slider
const prideDisplay = document.createElement("p");
fields.pride.after(prideDisplay);
prideDisplay.textContent = prideLevels[fields.pride.value];

fields.pride.addEventListener("input", () => {
  prideDisplay.textContent = prideLevels[fields.pride.value];
});

// Save brag entry
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
    pride: parseInt(fields.pride.value)
  };

  let brags = JSON.parse(localStorage.getItem("bragBookEntries")) || [];
  brags.push(newEntry);
  localStorage.setItem("bragBookEntries", JSON.stringify(brags));

  alert("✨ Brag saved!");
  bragForm.reset();
  prideDisplay.textContent = prideLevels[3];
  fields.pride.value = 3;

  displayTodaysBrags();
});

// Display only up to 2 brags for today
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

  // Show only 2 most recent entries
  const recentBrags = todaysBrags.slice(-2).reverse();

  recentBrags.forEach(entry => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("brag-entry");

   entryDiv.innerHTML = `
  <p><strong>🎯 Accomplishment:</strong> ${entry.accomplishment}</p>
  <p><strong>🧠 Learned:</strong> ${entry.learning}</p>
  <p><strong>💪 Brave Moment:</strong> ${entry.braveMoment}</p>
  <p><strong>💖 Self-Kindness:</strong> ${entry.selfKindness}</p>
  <p><strong>🌟 Pride:</strong> ${prideLevels[entry.pride]}</p>
  <p><strong>🔗 Link:</strong> <a href="${entry.link}" target="_blank">${entry.link}</a></p>
  <div class="brag-actions">
    <button class="entry-btn edit-brag" data-index="${entry.index}">✏️ Edit</button>
    <button class="entry-btn delete-brag" data-index="${entry.index}">🗑️ Delete</button>
  </div>
`;


    container.appendChild(entryDiv);
  });

  if (todaysBrags.length > 2) {
    const seeMore = document.createElement("p");
    seeMore.innerHTML = `+ ${todaysBrags.length - 2} more in <a href="archive.html">Soul Archive</a>`;
    seeMore.style.textAlign = "center";
    seeMore.style.marginTop = "1rem";
    container.appendChild(seeMore);
  }

  attachEditListeners();
  attachDeleteListeners();
}

// Edit brag entry
function attachEditListeners() {
  document.querySelectorAll(".edit-brag").forEach(btn => {
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

      // Remove and re-save on update
      brags.splice(index, 1);
      localStorage.setItem("bragBookEntries", JSON.stringify(brags));
      displayTodaysBrags();
    });
  });
}

// Delete brag entry
function attachDeleteListeners() {
  document.querySelectorAll(".delete-brag").forEach(btn => {
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

document.addEventListener("DOMContentLoaded", displayTodaysBrags);
