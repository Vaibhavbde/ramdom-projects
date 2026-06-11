// colleges.js (final merged + fixed version)

let colleges = [];

// ========== LIST PAGE ==========
function showColleges(query = "", location = "") {
  fetch("/data/colleges.json")
    .then(res =>res.json())
    .then(data =>{
      colleges = data;

      let filtered = data;

      // Filter by search
      if (query) {
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(query) ||
          (c.location && c.location.toLowerCase().includes(query)) ||
          (c.courses && c.courses.some(course =>course.toLowerCase().includes(query)))
        );
      }

      // Filter by location
      if (location) {
        filtered = filtered.filter(c =>
          c.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      renderColleges(filtered);
    })
    .catch(err =>console.error("Error loading colleges.json:", err));
}

function renderColleges(data) {
  const list = document.getElementById("colleges-list");
  if (!list) return;

  list.innerHTML = "";
  if (data.length === 0) {
    list.innerHTML = `<p>No colleges found.</p>`;
    return;
  }

  data.forEach(college =>{
    const div = document.createElement("div");
    div.className = "college-card";
    div.innerHTML = `
      <h3>${college.name}</h3>
      <p> ${college.location}</p>
      <p> ${college.type}</p>
      <p> <a href="${college.website}" target="_blank">Visit Website</a></p>
    `;
    div.addEventListener("click", () =>{
      window.location.href = `college-details.html?id=${college.id}`;
    });
    list.appendChild(div);
  });
}

function initCollegeFilters() {
  const searchInput = document.getElementById("college-search-input");
  const searchBtn = document.getElementById("college-search-btn");
  const locationSelect = document.getElementById("location-select");

  if (searchBtn) {
    searchBtn.addEventListener("click", () =>{
      showColleges(searchInput.value.trim().toLowerCase(), locationSelect.value);
    });
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", () =>{
      showColleges(searchInput.value.trim().toLowerCase(), locationSelect.value);
    });
  }

  if (locationSelect) {
    locationSelect.addEventListener("change", () =>{
      showColleges(searchInput.value.trim().toLowerCase(), locationSelect.value);
    });
  }
}

// ========== DETAIL PAGE ==========
function renderCollegeDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch("/data/colleges.json")
    .then(res =>res.json())
    .then(data =>{
      const college = data.find(c =>String(c.id) === String(id));
      const container = document.querySelector(".college-card-detail");

      if (!college || !container) {
        if (container) container.innerHTML = "<p>College not found!</p>";
        return;
      }

      container.innerHTML = `
        <h2 id="college-name">${college.name}</h2>
        <div class="college-info">
          <p><strong> Location:</strong>${college.location}</p>
          <p><strong> Established:</strong>${college.established || "N/A"}</p>
          <p><strong> Type:</strong>${college.type || "N/A"}</p>
          <p><strong>Affiliation:</strong>${college.affiliation || "N/A"}</p>
          <p><strong> Website:</strong><a href="${college.website}" target="_blank">${college.website}</a></p>

          <h3>Accreditation & Ranking</h3>
          <p>NAAC Grade: ${college.naac || "N/A"}</p>
          <p>NIRF Rank: ${college.nirf || "N/A"}</p>
          <p>International: ${college.international_rank || "N/A"}</p>

          <h3> Courses & Programs</h3>
          <ul>${(college.courses || []).map(c =>`<li>${c}</li>`).join("")}</ul>

          <h3> Eligibility & Admission</h3>
          <ul>${(college.eligibility || []).map(e =>`<li>${e}</li>`).join("")}</ul>
          <ul>${(college.entrance_exams || []).map(ex =>`<li>${ex}</li>`).join("")}</ul>
          <p>Admission: ${college.admission_process || "N/A"}</p>
          <p>Important Dates: ${college.important_dates || "N/A"}</p>

          <h3> Fee Structure</h3>
          <p>Tuition: ${college.fees?.tuition || "N/A"}</p>
          <p>Hostel: ${college.fees?.hostel || "N/A"}</p>
          <p>Other: ${college.fees?.other || "N/A"}</p>
          <p>Scholarships: ${college.scholarships || "N/A"}</p>

          <h3>Infrastructure & Facilities</h3>
          <ul>${(college.facilities || []).map(f =>`<li>${f}</li>`).join("")}</ul>

          <h3> Placements & Internships</h3>
          <p>Placement %: ${college.placements?.percentage || "N/A"}</p>
          <p>Highest Package: ${college.placements?.highest || "N/A"}</p>
          <p>Average Package: ${college.placements?.average || "N/A"}</p>
          <ul>${(college.placements?.recruiters || []).map(r =>`<li>${r}</li>`).join("")}</ul>

          <h3> Faculty & Research</h3>
          <p>Faculty Ratio: ${college.faculty?.ratio || "N/A"}</p>
          <p>Qualifications: ${college.faculty?.qualifications || "N/A"}</p>
          <p>Research: ${college.faculty?.research || "N/A"}</p>

          <h3>Campus Life</h3>
          <ul>${(college.campus_life || []).map(c =>`<li>${c}</li>`).join("")}</ul>

          <h3> Location Advantage</h3>
          <p>${college.location_advantage || "N/A"}</p>

          <h3> Alumni & Achievements</h3>
          <ul>${(college.alumni || []).map(a =>`<li>${a}</li>`).join("")}</ul>

          <h3> Extra Info</h3>
          <ul>${(college.extra_info || []).map(e =>`<li>${e}</li>`).join("")}</ul>

          <h3> Quick Info Box</h3>
          <p> ${college.location} |  ${college.type} |  ${college.courses?.slice(0,3).join(", ")} |  ${college.fees?.tuition} |  ${college.placements?.average}</p>
        </div>
      `;
    })
    .catch(err =>console.error("Error loading college details:", err));
}

// INIT
document.addEventListener("DOMContentLoaded", () =>{
  if (document.getElementById("colleges-list")) {
    showColleges();
    initCollegeFilters();
  }
  if (document.querySelector(".college-card-detail")) renderCollegeDetail();
});

document.addEventListener("DOMContentLoaded", () =>{
  const user = getUser();
  const locationFilter = document.getElementById("college-location-filter");

  if (user?.location && locationFilter) {
    locationFilter.value = user.location; // pre-select user location
  }
});
