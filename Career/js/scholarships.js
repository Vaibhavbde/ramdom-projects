// scholarships.js

let scholarships = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/scholarships.json")
    .then(res => res.json())
    .then(data => {
      scholarships = data;
      renderScholarships(scholarships);
    })
    .catch(err => console.error("Error loading scholarships.json:", err));

  // Search bar
  const searchInput = document.getElementById("scholarship-search-input");
  const searchBtn = document.getElementById("scholarship-search-btn");

  if (searchInput && searchBtn) {
    searchBtn.addEventListener("click", () => {
      filterScholarships(searchInput.value.trim().toLowerCase());
    });

    searchInput.addEventListener("keyup", () => {
      filterScholarships(searchInput.value.trim().toLowerCase());
    });
  }
});

function renderScholarships(data) {
  const list = document.getElementById("scholarship-list");
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = `<p>No scholarships found.</p>`;
    return;
  }

  data.forEach(s => {
    const div = document.createElement("div");
    div.className = "scholarship-card";
    div.setAttribute("role", "article");
    div.innerHTML = `
      <h3 id="sch-${s.id}">${s.name}</h3>
      <p><strong>Eligibility:</strong> ${s.eligibility}</p>
      <p><strong>Benefits:</strong> ${s.benefits}</p>
      <a href="${s.website}" target="_blank" rel="noopener noreferrer">Apply / Learn More →</a>
    `;
    list.appendChild(div);
  });
}

function filterScholarships(query) {
  const filtered = query
    ? scholarships.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.eligibility.toLowerCase().includes(query) ||
        s.benefits.toLowerCase().includes(query)
      )
    : scholarships;

  renderScholarships(filtered);
}
