
let questions = [];
let currentQuestion = 0;
let answers = [];
let careerChartInstance = null;

// On page load
document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/questions.json")
    .then(res => res.json())
    .then(data => { questions = data; });

  document.getElementById("quiz-begin-btn").addEventListener("click", startQuiz);
  document.getElementById("next-btn").addEventListener("click", nextQuestion);
  document.getElementById("prev-btn").addEventListener("click", prevQuestion);
});

function startQuiz() {
  document.getElementById("quiz-start").classList.add("hidden");
  document.getElementById("quiz-question").classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question-text").innerText = q.text;

  // progress
  document.getElementById("question-progress").innerText =
    `Question ${currentQuestion + 1} of ${questions.length}`;

  // options
  const optionsList = document.getElementById("options-list");
  optionsList.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt.text;
    btn.onclick = () => selectOption(opt.id, btn);

    // restore if already answered
    if (answers[currentQuestion] && answers[currentQuestion].id === opt.id) {
      btn.classList.add("selected");
    }

    optionsList.appendChild(btn);
  });

  // prev button visibility
  document.getElementById("prev-btn").classList.toggle("hidden", currentQuestion === 0);

  // next button label
  document.getElementById("next-btn").innerText =
    currentQuestion === questions.length - 1 ? "Finish" : "Next";
}

function selectOption(optionId, btn) {
  document.querySelectorAll("#options-list button").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");

  const currentQuestionData = questions[currentQuestion];
  const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);

  // Save full object (so score mapping is available later)
  answers[currentQuestion] = selectedOptionData;
}

function nextQuestion() {
  if (!answers[currentQuestion]) {
    alert("Please select an option!");
    return;
  }

  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    finishQuiz();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function finishQuiz() {
  document.getElementById("quiz-question").classList.add("hidden");
  document.getElementById("quiz-result").classList.remove("hidden");

  document.getElementById("result-summary").innerText =
    "Thanks, your answers have been saved!";
  showResults();
}

function calculateScores() {
  let careerScores = {
    finance: 0,
    research: 0,
    "data analysis": 0,
    entrepreneurship: 0,
    tech: 0,
    Marketing: 0,
    design: 0,
    law: 0,
    business: 0
  };

  answers.forEach(selectedOption => {
    if (selectedOption && selectedOption.score) {
      for (const career in selectedOption.score) {
        if (careerScores.hasOwnProperty(career)) {
          careerScores[career] += selectedOption.score[career];
        }
      }
    }
  });

  return careerScores;
}

function showResults() {
  const finalScores = calculateScores();
  console.log("Final Scores:", finalScores);

  // Find top career
  let topCareer = null;
  let highestScore = 0;
  for (const career in finalScores) {
    if (finalScores[career] > highestScore) {
      highestScore = finalScores[career];
      topCareer = career;
    }
  }

  // ✅ Save everything to localStorage for profile.js
  localStorage.setItem("cb_quiz_last", JSON.stringify({
    answers: answers.map(ans => ans.id),
    result: topCareer,
    careerScores: finalScores
  }));

  // Show summary
  document.getElementById("result-summary").innerText =
    `Your top career match is: ${topCareer ? topCareer.toUpperCase() : "None"}`;

  // // Draw chart
  // const ctx = document.getElementById("careerChart").getContext("2d");

  // if (careerChartInstance) {
  //   careerChartInstance.destroy();
  // }

  // careerChartInstance = new Chart(ctx, {
  //   type: "pie",
  //   data: {
  //     labels: Object.keys(finalScores),
  //     datasets: [{
  //       data: Object.values(finalScores),
  //       backgroundColor: [
  //         "#FF6384", "#36A2EB", "#FFCE56",
  //         "#4CAF50", "#9966FF", "#FF9F40",
  //         "#00C49F", "#FF6B6B", "#6A5ACD"
  //       ]
  //     }]
  //   },
  //   options: {
  //     responsive: true,
  //     plugins: {
  //       legend: { position: "bottom" },
  //       title: { display: true, text: "Career Score Distribution" }
  //     }
  //   }
  // });

  // Draw chart
  const ctx = document.getElementById("careerChart").getContext("2d");

  if (careerChartInstance) {
    careerChartInstance.destroy();
  }

  careerChartInstance = new Chart(ctx, {
    type: "doughnut", // ✅ donut chart looks cleaner than pie
    data: {
      labels: Object.keys(finalScores),
      datasets: [{
        data: Object.values(finalScores),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56",
          "#4CAF50", "#9966FF", "#FF9F40",
          "#00C49F", "#FF6B6B", "#6A5ACD"
        ],
        borderWidth: 2,
        borderColor: "#fff", // ✅ white borders for clarity
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right", // ✅ move legend to side for readability
          labels: { usePointStyle: true, padding: 15 }
        },
        title: {
          display: true,
          text: `Career Score Distribution (Top: ${topCareer.toUpperCase()})`,
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let total = context.dataset.data.reduce((a, b) => a + b, 0);
              let value = context.raw;
              let percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} (${percentage}%)`; // ✅ show percentage
            }
          }
        }
      },
      cutout: "50%" // ✅ makes it a donut chart
    }
  });


}
