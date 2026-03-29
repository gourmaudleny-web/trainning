// Navigation par boutons
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    if (!targetId) return;
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Objectif de la semaine (localStorage)
const weeklyGoalInput = document.getElementById("weekly-goal-input");
const weeklyGoalDisplay = document.getElementById("weekly-goal-display");
const saveGoalBtn = document.getElementById("save-goal-btn");

function loadWeeklyGoal() {
  const goal = localStorage.getItem("weeklyGoal");
  if (goal && weeklyGoalDisplay) {
    weeklyGoalDisplay.textContent = goal;
  }
}

function saveWeeklyGoal() {
  const value = weeklyGoalInput.value.trim();
  if (!value) return;
  localStorage.setItem("weeklyGoal", value);
  weeklyGoalDisplay.textContent = value;
  weeklyGoalInput.value = "";
}

if (saveGoalBtn) {
  saveGoalBtn.addEventListener("click", saveWeeklyGoal);
}

loadWeeklyGoal();

// Gestion des ressources (localStorage)
const resourceForm = document.getElementById("resource-form");
const resourcesTableBody = document.querySelector("#resources-table tbody");

function getResources() {
  const raw = localStorage.getItem("resources");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveResources(resources) {
  localStorage.setItem("resources", JSON.stringify(resources));
}

function renderResources() {
  const resources = getResources();
  if (!resourcesTableBody) return;
  resourcesTableBody.innerHTML = "";

  resources.forEach((res, index) => {
    const tr = document.createElement("tr");

    const tdCat = document.createElement("td");
    tdCat.textContent = res.category;

    const tdTitle = document.createElement("td");
    tdTitle.textContent = res.title;

    const tdLink = document.createElement("td");
    const a = document.createElement("a");
    a.href = res.link;
    a.target = "_blank";
    a.textContent = "Ouvrir";
    tdLink.appendChild(a);

    const tdNotes = document.createElement("td");
    tdNotes.textContent = res.notes || "";

    const tdDelete = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.className = "delete-btn";
    btn.addEventListener("click", () => {
      deleteResource(index);
    });
    tdDelete.appendChild(btn);

    tr.appendChild(tdCat);
    tr.appendChild(tdTitle);
    tr.appendChild(tdLink);
    tr.appendChild(tdNotes);
    tr.appendChild(tdDelete);

    resourcesTableBody.appendChild(tr);
  });
}

function addResource(resource) {
  const resources = getResources();
  resources.push(resource);
  saveResources(resources);
  renderResources();
}

function deleteResource(index) {
  const resources = getResources();
  resources.splice(index, 1);
  saveResources(resources);
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
