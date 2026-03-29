/* -------------------------------------------------- */
/* NAVIGATION ENTRE SECTIONS */
/* -------------------------------------------------- */

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    const section = document.getElementById(target);

    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

/* -------------------------------------------------- */
/* OBJECTIF DE LA SEMAINE (localStorage) */
/* -------------------------------------------------- */

const goalInput = document.getElementById("weekly-goal-input");
const goalDisplay = document.getElementById("weekly-goal-display");
const saveGoalBtn = document.getElementById("save-goal-btn");

function loadGoal() {
  const saved = localStorage.getItem("weeklyGoal");
  if (saved) {
    goalDisplay.textContent = saved;
  }
}

function saveGoal() {
  const value = goalInput.value.trim();
  if (value.length === 0) return;

  localStorage.setItem("weeklyGoal", value);
  goalDisplay.textContent = value;
  goalInput.value = "";
}

if (saveGoalBtn) {
  saveGoalBtn.addEventListener("click", saveGoal);
}

loadGoal();

/* -------------------------------------------------- */
/* RESSOURCES PERSONNELLES */
/* -------------------------------------------------- */

const resourceForm = document.getElementById("resource-form");
const tableBody = document.querySelector("#resources-table tbody");

function getResources() {
  const raw = localStorage.getItem("resources");
  return raw ? JSON.parse(raw) : [];
}

function saveResources(list) {
  localStorage.setItem("resources", JSON.stringify(list));
}

function renderResources() {
  const resources = getResources();
  tableBody.innerHTML = "";

  resources.forEach((res, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${res.category}</td>
      <td>${res.title}</td>
      <td><a href="${res.link}" target="_blank">Ouvrir</a></td>
      <td>${res.notes || ""}</td>
      <td><button class="delete-btn" data-index="${index}">✕</button></td>
    `;

    tableBody.appendChild(tr);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      deleteResource(index);
    });
  });
}

function addResource(resource) {
  const list = getResources();
  list.push(resource);
  saveResources(list);
  renderResources();
}

function deleteResource(index) {
  const list = getResources();
  list.splice(index, 1);
  saveResources(list);
  renderResources();
}

if (resourceForm) {
  resourceForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const category = document.getElementById("resource-category").value;
    const title = document.getElementById("resource-title").value.trim();
    const link = document.getElementById("resource-link").value.trim();
    const notes = document.getElementById("resource-notes").value.trim();

    if (!title || !link) return;

    addResource({ category, title, link, notes });

    resourceForm.reset();
  });
}

renderResources();
