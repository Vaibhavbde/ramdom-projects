// // careers.js (supports full detailed career.json structure)

// let careers = [];
// const detectedCourse = getElementById("detectedCourse")

// // ========== LIST PAGE ==========
// function renderCareerList() {
//   fetch("/data/careers.json")
//     .then(res =>res.json())
//     .then(data =>{
//       careers = data;
//       showCareerList(data);

//       const searchInput = document.getElementById("career-search-input");
//       const searchBtn = document.getElementById("career-search-btn");

//       if (searchInput && searchBtn) {
//         searchBtn.addEventListener("click", () =>{
//           filterCareers(searchInput.value.trim().toLowerCase());
//         });

//         searchInput.addEventListener("keyup", () =>{
//           filterCareers(searchInput.value.trim().toLowerCase());
//         });
//       }
//     })
//     .catch(err =>console.error("Error loading careers.json:", err));
// }

// function showCareerList(data) {
//   const list = document.getElementById("career-list");
//   if (!list) return;

//   list.innerHTML = "";
//   if (data.length === 0) {
//     list.innerHTML = `<p>No careers found.</p>`;
//     return;
//   }

//   data.forEach(career =>{
//     const div = document.createElement("div");
//     div.className = "career-card";
//     div.innerHTML = `
//       <h3>${career.title}</h3>
//       <p>${career.overview || "Click to see details"}</p>
//     `;
//     div.addEventListener("click", () =>{
//       window.location.href = `career-detail.html?career=${career.id}`;
//     });
//     list.appendChild(div);
//   });
// }

// function filterCareers(query) {
//   const filtered = query
//     ? careers.filter(c =>
//         c.title.toLowerCase().includes(query) ||
//         (c.overview && c.overview.toLowerCase().includes(query)) ||
//         (c.skills && c.skills.some(s =>s.toLowerCase().includes(query)))
//       )
//     : careers;
//   showCareerList(filtered);
// }

// // ========== DETAIL PAGE ==========
// function renderCareerDetail() {
//   const params = new URLSearchParams(window.location.search);
//   const careerId = params.get("career");
//   if (!careerId) return;

//   fetch("/data/careers.json")
//     .then(res =>res.json())
//     .then(data =>{
//       const career = data.find(c =>String(c.id) === String(careerId));
//       const container = document.querySelector(".career-card-detail");

//       if (!career || !container) {
//         if (container) container.innerHTML = "<p>Career not found!</p>";
//         return;
//       }

//       // Build detail view dynamically
//       container.innerHTML = `
//         <h2 id="career-title">${career.title}</h2>
//         <div class="career-info">
//           <h3> Career Overview</h3>
//           <p>${career.overview || "N/A"}</p>
//           <p><strong>Work Profile:</strong>${career.work_profile || "N/A"}</p>
//           <p><strong>Industry Relevance:</strong>${career.industry || "N/A"}</p>

//           <h3>✅ Why Choose This Career?</h3>
//           <ul>${(career.pros || []).map(p =>`<li>${p}</li>`).join("")}</ul>
//           <ul>${(career.cons || []).map(c =>`<li> ${c}</li>`).join("")}</ul>

//           <h3> Skills Required</h3>
//           <ul>${(career.skills || []).map(s =>`<li>${s}</li>`).join("")}</ul>

//           <h3> Eligibility & Education Path</h3>
//           <ul>${(career.education || []).map(e =>`<li>${e}</li>`).join("")}</ul>

//           <h3> Career Roadmap</h3>
//           <ul>${(career.roadmap || []).map(r =>`<li>${r}</li>`).join("")}</ul>

//           <h3> Specializations</h3>
//           <ul>${(career.specializations || []).map(s =>`<li>${s}</li>`).join("")}</ul>

//           <h3> Top Colleges & Institutes</h3>
//           <ul>${(career.colleges || []).map(c =>`<li>${c}</li>`).join("")}</ul>

//           <h3> Cost & Duration</h3>
//           <p><strong>Cost:</strong>${career.cost || "N/A"}</p>
//           <p><strong>Duration:</strong>${career.duration || "N/A"}</p>

//           <h3> Job Roles & Designations</h3>
//           <ul>${(career.job_roles || []).map(j =>`<li>${j}</li>`).join("")}</ul>

//           <h3> Top Recruiters</h3>
//           <ul>${(career.recruiters || []).map(r =>`<li>${r}</li>`).join("")}</ul>

//           <h3> Salary Insights</h3>
//           <ul>${(career.salary || []).map(s =>`<li>${s}</li>`).join("")}</ul>

//           <h3>Future Scope</h3>
//           <p>${career.future_scope || "N/A"}</p>

//           <h3> Day in the Life</h3>
//           <p>${career.day_in_life || "N/A"}</p>

//           <h3> Success Stories</h3>
//           <ul>${(career.success_stories || []).map(s =>`<li>${s}</li>`).join("")}</ul>

//           <h3>Alternative / Related Careers</h3>
//           <ul>${(career.alternatives || []).map(a =>`<li>${a}</li>`).join("")}</ul>

//           <h3> Resources & Tools</h3>
//           <ul>${(career.resources || []).map(r =>`<li>${r}</li>`).join("")}</ul>

//           <h3>â“ FAQs</h3>
//           <ul>${(career.faqs || []).map(f =>`<li>${f}</li>`).join("")}</ul>
//         </div>
//       `;
//     })
//     .catch(err =>console.error("Error loading career details:", err));
// }

// // INIT
// document.addEventListener("DOMContentLoaded", () =>{
//   if (document.getElementById("career-list")) renderCareerList();
//   if (document.querySelector(".career-card-detail")) renderCareerDetail();
// });


// careers.js

let careers = [];

// ========== LIST PAGE ==========
function renderCareerList() {
  fetch("/data/careers.json")
    .then(res =>res.json())
    .then(data =>{
      careers = data;

      // Check URL param for pre-filter
      const urlParams = new URLSearchParams(window.location.search);
      const stream = urlParams.get("stream");
      if (stream) {
        data = data.filter(c =>c.stream && c.stream.toLowerCase() === stream.toLowerCase());
      }

      showCareerList(data);

      // Search filter
      const searchInput = document.getElementById("career-search-input");
      const searchBtn = document.getElementById("career-search-btn");

      if (searchInput && searchBtn) {
        searchBtn.addEventListener("click", () =>{
          filterCareers(searchInput.value.trim().toLowerCase());
        });

        searchInput.addEventListener("keyup", () =>{
          filterCareers(searchInput.value.trim().toLowerCase());
        });
      }
    })
    .catch(err =>console.error("Error loading careers.json:", err));
}

function showCareerList(data) {
  const list = document.getElementById("career-list");
  if (!list) return;

  list.innerHTML = "";
  if (data.length === 0) {
    list.innerHTML = `<p>No careers found.</p>`;
    return;
  }

  data.forEach(career =>{
    const div = document.createElement("div");
    div.className = "career-card";
    div.innerHTML = `
      <h3>${career.title}</h3>
      <p>${career.overview || "Click to see details"}</p>
    `;
    div.addEventListener("click", () =>{
      window.location.href = `career-detail.html?career=${career.id}`;
    });
    list.appendChild(div);
  });
}

function filterCareers(query) {
  const filtered = query
    ? careers.filter(c =>
      c.title.toLowerCase().includes(query) ||
      (c.overview && c.overview.toLowerCase().includes(query)) ||
      (c.skills && c.skills.some(s =>s.toLowerCase().includes(query)))
    )
    : careers;
  showCareerList(filtered);
}

// ========== DETAIL PAGE ==========
function renderCareerDetail() {
  const params = new URLSearchParams(window.location.search);
  const careerId = params.get("career");
  if (!careerId) return;

  fetch("/data/careers.json")
    .then(res =>res.json())
    .then(data =>{
      const career = data.find(c =>String(c.id) === String(careerId));
      const container = document.querySelector(".career-card-detail");
      const urlParams = new URLSearchParams(window.location.search);
      const stream = urlParams.get("stream");
      if (stream) {
        data = data.filter(c =>c.stream && c.stream.toLowerCase() === stream.toLowerCase());
      }
      showCareerList(data);

      if (!career || !container) {
        if (container) container.innerHTML = "<p>Career not found!</p>";
        return;
      }

      container.innerHTML = `
        <h2 id="career-title">${career.title}</h2>
        <div class="career-info">
          <h3> Career Overview</h3>
          <p>${career.overview || "N/A"}</p>
          <p><strong>Work Profile:</strong>${career.work_profile || "N/A"}</p>
          <p><strong>Industry:</strong>${career.industry || "N/A"}</p>
          <h3>✅ Why Choose This Career?</h3>
          <ul>${(career.pros || []).map(p =>`<li>${p}</li>`).join("")}</ul>
          <ul>${(career.cons || []).map(c =>`<li> ${c}</li>`).join("")}</ul>
          <h3> Skills Required</h3>
          <ul>${(career.skills || []).map(s =>`<li>${s}</li>`).join("")}</ul>
          <h3> Education Path</h3>
          <ul>${(career.education || []).map(e =>`<li>${e}</li>`).join("")}</ul>
          <h3> Career Roadmap</h3>
          <ul>${(career.roadmap || []).map(r =>`<li>${r}</li>`).join("")}</ul>
          <h3>Alternatives</h3>
          <ul>${(career.alternatives || []).map(a =>`<li>${a}</li>`).join("")}</ul>
        </div>
      `;
    })
    .catch(err =>console.error("Error loading career details:", err));
}

// ========== GLOBAL FUNCTION FOR PROFILE BUTTON ==========
window.showCareersByStream = function (stream) {
  // Navigate to careers.html with stream filter
  window.location.href = `careers.html?stream=${encodeURIComponent(stream)}`;
};

// INIT
document.addEventListener("DOMContentLoaded", () =>{
  if (document.getElementById("career-list")) renderCareerList();
  if (document.querySelector(".career-card-detail")) renderCareerDetail();
});


