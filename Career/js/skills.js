// skills.js (refined - only fetch from JSON)

let skills = [];

// DOM Ready
document.addEventListener("DOMContentLoaded", () =>{
  const page = window.location.pathname.split("/").pop();

  if (page === "skills.html") {
    loadSkills();
    initSkillFilters();
  } else if (page === "skill-detail.html") {
    loadSkillDetail();
  }
});

// ========== LIST PAGE ==========
function loadSkills() {
  fetch("/data/skills.json")
    .then(res =>res.json())
    .then(data =>{
      skills = data;
      renderSkills(skills);
    })
    .catch(err =>console.error("Error loading skills.json:", err));
}

function renderSkills(data) {
  const list = document.getElementById("skills-list");
  if (!list) return;

  list.innerHTML = "";
  if (!data || data.length === 0) {
    list.innerHTML = `<p>No skills found.</p>`;
    return;
  }

  data.forEach(skill =>{
    const div = document.createElement("div");
    div.className = "skill-card";
    div.setAttribute("tabindex", "0");

    div.innerHTML = `
      <h3>${skill.emoji || ""} ${skill.name}</h3>
      <p>🎯 Level: ${skill.basic?.level}</p>
      <p>📌 Type: ${skill.basic?.type}</p>
      <p> Industry: ${skill.basic?.industry}</p>
    `;

    div.addEventListener("click", () =>{
      window.location.href = `skill-detail.html?id=${skill.id}`;
    });
    div.addEventListener("keydown", (e) =>{
      if (e.key === "Enter") {
        window.location.href = `skill-detail.html?id=${skill.id}`;
      }
    });

    list.appendChild(div);
  });
}

function initSkillFilters() {
  const searchInput = document.getElementById("skill-search-input");
  const searchBtn = document.getElementById("skill-search-btn");
  const levelFilter = document.getElementById("skill-level-filter");
  const modeFilter = document.getElementById("skill-mode-filter");

  const handleFilter = () =>{
    const query = searchInput.value.trim().toLowerCase();
    const level = levelFilter.value;
    const mode = modeFilter.value;

    let filtered = skills;

    if (query) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        (s.overview?.description?.toLowerCase().includes(query)) ||
        (s.topics?.some(t =>t.toLowerCase().includes(query)))
      );
    }

    if (level) {
      filtered = filtered.filter(s =>s.basic?.level === level);
    }

    if (mode) {
      filtered = filtered.filter(s =>s.basic?.mode === mode);
    }

    renderSkills(filtered);
  };

  if (searchBtn) searchBtn.addEventListener("click", handleFilter);
  if (searchInput) searchInput.addEventListener("keyup", handleFilter);
  if (levelFilter) levelFilter.addEventListener("change", handleFilter);
  if (modeFilter) modeFilter.addEventListener("change", handleFilter);
}

// ========== DETAIL PAGE ==========
function loadSkillDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch("/data/skills.json")
    .then(res =>res.json())
    .then(data =>{
      const skill = data.find(s =>s.id === id);
      const container = document.getElementById("skill-detail");

      if (!skill || !container) {
        if (container) container.innerHTML = `<p> Skill not found!</p>`;
        return;
      }

      container.innerHTML = `
        <h2>${skill.emoji || ""} ${skill.name}</h2>

        <h3> Basic Info</h3>
        <p>Type: ${skill.basic?.type}</p>
        <p>Industry: ${skill.basic?.industry}</p>
        <p>Level: ${skill.basic?.level}</p>
        <p>Mode: ${skill.basic?.mode}</p>

        <h3> Overview</h3>
        <p>${skill.overview?.description}</p>
        <p><strong>Importance:</strong>${skill.overview?.importance}</p>
        <p><strong>Use cases:</strong>${skill.overview?.use_cases?.join(", ")}</p>

        <h3> Prerequisites</h3>
        <ul>${(skill.prerequisites || []).map(p =>`<li>${p}</li>`).join("")}</ul>

        <h3> Learning Roadmap</h3>
        <ul>${(skill.roadmap || []).map(r =>`<li>${r}</li>`).join("")}</ul>

        <h3> Topics Covered</h3>
        <ul>${(skill.topics || []).map(t =>`<li>${t}</li>`).join("")}</ul>

        <h3> How to Learn</h3>
        <ul>${(skill.learning || []).map(l =>`<li>${l}</li>`).join("")}</ul>

        <h3> Skill Level Assessment</h3>
        <ul>${(skill.assessment || []).map(a =>`<li>${a}</li>`).join("")}</ul>

        <h3> Career Impact</h3>
        <ul>${(skill.career || []).map(c =>`<li>${c}</li>`).join("")}</ul>

        <h3> Salary Impact</h3>
        <ul>${(skill.salary || []).map(s =>`<li>${s}</li>`).join("")}</ul>

        <h3> Top Companies Using</h3>
        <ul>${(skill.companies || []).map(c =>`<li>${c}</li>`).join("")}</ul>

        <h3>Future Scope</h3>
        <p>${skill.future || "N/A"}</p>

        <h3>Daily Life Examples</h3>
        <p>${skill.daily || "N/A"}</p>

        <h3> Related Skills</h3>
        <ul>${(skill.related || []).map(r =>`<li>${r}</li>`).join("")}</ul>

        <h3> Success Stories</h3>
        <ul>${(skill.success || []).map(s =>`<li>${s}</li>`).join("")}</ul>

        <h3> Resources & Tools</h3>
        <ul>${(skill.resources || []).map(r =>`<li>${r}</li>`).join("")}</ul>

        <h3> Skill Validation</h3>
        <ul>${(skill.validation || []).map(v =>`<li>${v}</li>`).join("")}</ul>

        <h3>â“ FAQs</h3>
        <ul>${(skill.faqs || []).map(f =>`<li>${f}</li>`).join("")}</ul>

        <h3> Quick Info</h3>
        <p> ${skill.name} | ${skill.basic?.level} |  ${skill.overview?.use_cases?.[0] || "N/A"} |  ${skill.salary?.[0] || "N/A"} |  ${skill.basic?.industry} |  ${skill.validation?.[0] || "N/A"}</p>
      `;
    })
    .catch(err =>console.error("Error loading skill detail:", err));
}
