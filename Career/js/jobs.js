// jobs.js (reads refined data only from jobs.json)

let jobs = [];

// DOM Ready
document.addEventListener("DOMContentLoaded", () =>{
  const page = window.location.pathname.split("/").pop();

  if (page === "jobs.html") {
    loadJobs();
    initSearch();
  } else if (page === "job-details.html") {
    loadJobDetail();
  }
});

// ========== LIST PAGE ==========
function loadJobs() {
  fetch("/data/jobs.json")
    .then(res =>res.json())
    .then(data =>{
      jobs = data;
      renderJobs(jobs);
    })
    .catch(err =>console.error("Error loading jobs.json:", err));
}

function renderJobs(data) {
  const list = document.getElementById("jobs-list");
  if (!list) return;

  list.innerHTML = "";

  if (!data || data.length === 0) {
    list.innerHTML = `<p>No jobs found.</p>`;
    return;
  }

  data.forEach(job =>{
    const div = document.createElement("div");
    div.className = "job-card";
    div.setAttribute("tabindex", "0");

    div.innerHTML = `
      <h3>${job.title}</h3>
      <p class="company">${job.company}</p>
      <p> ${job.location}</p>
      <p> ${job.type}</p>
      <p> Deadline: ${job.application_deadline || "N/A"}</p>
    `;

    div.addEventListener("click", () =>{
      window.location.href = `job-details.html?id=${job.id}`;
    });

    div.addEventListener("keydown", (e) =>{
      if (e.key === "Enter") {
        window.location.href = `job-details.html?id=${job.id}`;
      }
    });

    list.appendChild(div);
  });
}

function initSearch() {
  const searchInput = document.getElementById("job-search-input");
  const searchBtn = document.getElementById("job-search-btn");

  if (searchInput && searchBtn) {
    const handleSearch = () =>{
      filterJobs(searchInput.value.trim().toLowerCase());
    };
    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keyup", handleSearch);
  }
}

function filterJobs(query) {
  const filtered = query
    ? jobs.filter(j =>
        j.title.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        j.location.toLowerCase().includes(query) ||
        (j.skills && j.skills.some(s =>s.toLowerCase().includes(query)))
      )
    : jobs;

  renderJobs(filtered);
}

// ========== DETAIL PAGE ==========
function loadJobDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch("/data/jobs.json")
    .then(res =>res.json())
    .then(data =>{
      const job = data.find(j =>j.id === id);
      const container = document.getElementById("job-detail");

      if (!job || !container) {
        if (container) container.innerHTML = `<p>Job not found!</p>`;
        return;
      }

      container.innerHTML = `
        <h2>${job.title}</h2>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Type:</strong> ${job.type}</p>
        <p><strong>Experience:</strong> ${job.experience}</p>
        <p><strong>Salary:</strong> ${job.salary}</p>
        <p><strong>Skills:</strong> ${(job.skills || []).join(", ")}</p>

        <h3> Overview</h3>
        <p>${job.overview || job.description || "N/A"}</p>

        <h3> Perks & Benefits</h3>
        <ul>${(job.perks || []).map(p =>`<li>${p}</li>`).join("")}</ul>

        <h3> Challenges</h3>
        <ul>${(job.cons || []).map(c =>`<li> ${c}</li>`).join("")}</ul>

        <h3> Eligibility</h3>
        <ul>${(job.eligibility || []).map(e =>`<li>${e}</li>`).join("")}</ul>

        <h3> Top Recruiters</h3>
        <ul>${(job.recruiters || []).map(r =>`<li>${r}</li>`).join("")}</ul>

        <p><strong>Email:</strong> <a href="mailto:${job.email}">${job.email}</a></p>
        <p><strong>Deadline:</strong> ${job.application_deadline || "N/A"}</p>
        <a href="${job.website}" target="_blank" class="btn-primary">Apply Now </a>
      `;
    })
    .catch(err =>console.error("Error loading job detail:", err));
}
