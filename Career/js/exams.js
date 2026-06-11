// exams.js (refined - only fetches from exams.json)

let exams = [];

// DOM Ready
document.addEventListener("DOMContentLoaded", () =>{
  const page = window.location.pathname.split("/").pop();

  if (page === "exam.html") {
    loadExams();
    initExamSearch();
  } else if (page === "exam-detail.html") {
    loadExamDetail();
  }
});

// ========== LIST PAGE ==========
function loadExams() {
  fetch("/data/exams.json")
    .then(res =>res.json())
    .then(data =>{
      exams = data;
      renderExams(exams);
    })
    .catch(err =>console.error("Error loading exams.json:", err));
}

function renderExams(data) {
  const list = document.getElementById("exams-list");
  if (!list) return;

  list.innerHTML = "";

  if (!data || data.length === 0) {
    list.innerHTML = `<p>No exams found.</p>`;
    return;
  }

  data.forEach(exam =>{
    const div = document.createElement("div");
    div.className = "exam-card";
    div.setAttribute("tabindex", "0");

    div.innerHTML = `
      <h3>${exam.name}</h3>
      <p>🎯 ${exam.overview?.importance || exam.stream || ""}</p>
      <p>📅 Next Exam: ${exam.dates?.exam_date || "N/A"}</p>
    `;

    div.addEventListener("click", () =>{
      window.location.href = `exam-detail.html?id=${exam.id}`;
    });
    div.addEventListener("keydown", (e) =>{
      if (e.key === "Enter") {
        window.location.href = `exam-detail.html?id=${exam.id}`;
      }
    });

    list.appendChild(div);
  });
}

function initExamSearch() {
  const searchInput = document.getElementById("exam-search-input");
  const searchBtn = document.getElementById("exam-search-btn");

  if (searchInput && searchBtn) {
    const handleSearch = () =>{
      filterExams(searchInput.value.trim().toLowerCase());
    };
    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keyup", handleSearch);
  }
}

function filterExams(query) {
  const filtered = query
    ? exams.filter(e =>
        e.name.toLowerCase().includes(query) ||
        (e.overview?.importance?.toLowerCase().includes(query)) ||
        (e.eligibility?.academic?.toLowerCase().includes(query))
      )
    : exams;

  renderExams(filtered);
}

// ========== DETAIL PAGE ==========
function loadExamDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  fetch("/data/exams.json")
    .then(res =>res.json())
    .then(data =>{
      const exam = data.find(e =>e.id === id);
      const container = document.getElementById("exam-detail");

      if (!exam || !container) {
        if (container) container.innerHTML = `<p>Exam not found!</p>`;
        return;
      }

      container.innerHTML = `
        <h2>${exam.name}</h2>

        <h3> Basic Info</h3>
        <p><strong>Conducted By:</strong>${exam.basic?.conductedBy}</p>
        <p><strong>Level:</strong>${exam.basic?.level}</p>
        <p><strong>Type:</strong>${exam.basic?.type}</p>
        <p><strong>Frequency:</strong>${exam.basic?.frequency}</p>
        <p><strong>Mode:</strong>${exam.basic?.mode}</p>
        <p><a href="${exam.basic?.website}" target="_blank"> Official Website</a></p>

        <h3> Exam Overview</h3>
        <p>${exam.overview?.description}</p>
        <p><strong>Importance:</strong>${exam.overview?.importance}</p>
        <p><strong>Competition:</strong>${exam.overview?.competition}</p>
        <p><strong>Languages:</strong>${exam.overview?.languages?.join(", ")}</p>

        <h3> Eligibility Criteria</h3>
        <ul>
          <li>Academic: ${exam.eligibility?.academic}</li>
          <li>Percentage: ${exam.eligibility?.percentage}</li>
          <li>Age Limit: ${exam.eligibility?.age}</li>
          <li>Nationality: ${exam.eligibility?.nationality}</li>
          <li>Attempts: ${exam.eligibility?.attempts}</li>
        </ul>

        <h3> Important Dates</h3>
        <ul>
          <li>Application Start: ${exam.dates?.application_start}</li>
          <li>Last Date: ${exam.dates?.last_date}</li>
          <li>Admit Card: ${exam.dates?.admit_card}</li>
          <li>Exam Date: ${exam.dates?.exam_date}</li>
          <li>Result: ${exam.dates?.result}</li>
        </ul>

        <h3> Exam Pattern</h3>
        <p>Mode: ${exam.pattern?.mode}</p>
        <p>Duration: ${exam.pattern?.duration}</p>
        <p>Sections: ${exam.pattern?.sections}</p>
        <p>Total Qs/Marks: ${exam.pattern?.questions} / ${exam.pattern?.marks}</p>
        <p>Marking Scheme: ${exam.pattern?.marking}</p>
        <p>Medium: ${exam.pattern?.medium}</p>

        <h3> Syllabus</h3>
        <ul>${(exam.syllabus || []).map(s =>`<li>${s}</li>`).join("")}</ul>

        <h3> Application Process</h3>
        <p>${exam.application?.steps}</p>
        <p>Fee: ${exam.application?.fee}</p>
        <p>Correction Window: ${exam.application?.correction || "N/A"}</p>

        <h3> Preparation Strategy</h3>
        <ul>${(exam.preparation || []).map(p =>`<li>${p}</li>`).join("")}</ul>

        <h3> Reference Material</h3>
        <ul>${(exam.references || []).map(r =>`<li>${r}</li>`).join("")}</ul>

        <h3> Cutoffs & Results</h3>
        <p>${exam.cutoff || "N/A"}</p>

        <h3> Colleges Accepting</h3>
        <ul>${(exam.colleges || []).map(c =>`<li>${c}</li>`).join("")}</ul>

        <h3> Job & Career Opportunities</h3>
        <ul>${(exam.careers || []).map(c =>`<li>${c}</li>`).join("")}</ul>

        <h3>â“ FAQs</h3>
        <ul>${(exam.faqs || []).map(f =>`<li>${f}</li>`).join("")}</ul>

        <h3> Quick Info</h3>
        <p> ${exam.name} | ${exam.basic?.conductedBy} |  ${exam.basic?.level} |  ${exam.dates?.exam_date} |  ${exam.pattern?.duration} |  ${exam.application?.fee}</p>
      `;
    })
    .catch(err =>console.error("Error loading exam detail:", err));
}
