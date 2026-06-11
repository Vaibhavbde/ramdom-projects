document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();

  if (!user) {
    alert("Sign In to access your profile");
    window.location.href = "index.html";
    return;
  }

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  };

  setText("profile-name", user?.name || "Guest User");
  setText("profile-email", user?.email || "guest@example.com");
  setText("profile-gender", user?.gender || "Not specified");
  setText("profile-age", user?.age || "Not specified");
  setText("profile-class", user?.class || "Not specified");
  setText("profile-stream", user?.stream || "Not decided");
  setText("profile-interests", user?.interests || "Not provided");
  setText("profile-careerGoal", user?.careerGoal || "Not specified");
  setText("profile-skills", user?.skills || "Not provided");
  setText("profile-location", user?.location || "Not specified");

  const editBtn = document.getElementById("edit-profile-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const modal = document.getElementById("auth-modal");
      if (!modal) return;
      modal.classList.remove("hidden");

      const setInput = (id, value) => {
        const input = document.getElementById(id);
        if (input) input.value = value;
      };

      setInput("input-name", user?.name || "");
      setInput("input-email", user?.email || "");
      setInput("input-gender", user?.gender || "");
      setInput("input-age", user?.age || "");
      setInput("input-class", user?.class || "");
      setInput("input-stream", user?.stream || "");
      setInput("input-interests", user?.interests || "");
      setInput("input-career-goal", user?.careerGoal || "");
      setInput("input-skills", user?.skills || "");
      setInput("input-location", user?.location || "");
    });
  }

  const quizData = JSON.parse(localStorage.getItem("cb_quiz_last"));
  const resultBox = document.getElementById("quiz-result-box");

  if (resultBox) {
    if (!quizData || !quizData.answers?.length) {
      resultBox.innerHTML = `
        <p>You haven't taken the quiz yet!</p>
        <a href="quiz.html" class="btn-primary">Take the Quiz Now</a>
      `;
    } else {
      const score = quizData.result;

      resultBox.innerHTML = `
        <p><strong>Top Interest Detected Field:</strong> ${score}</p>
        <p>We recommend exploring careers in the <strong>${score}</strong> stream!</p>
        <br>
        <a href="careers.html" class="btn-primary">Explore Courses</a>
      `;

      if (quizData.careerScores) {
        renderCareerChart(quizData.careerScores);
      }
    }
  }
});

function renderCareerChart(careerScores) {
  const ctx = document.getElementById("careerChart");
  if (!ctx) return;

  if (window.careerChartInstance) {
    window.careerChartInstance.destroy();
  }

  window.careerChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(careerScores),
      datasets: [{
        data: Object.values(careerScores),
        backgroundColor: [
          "#7993d3ff",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#baf568ff",
          "#f47eb1ff",
          "#ff6961ff"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Career Score Distribution" }
      }
    }
  });
}
