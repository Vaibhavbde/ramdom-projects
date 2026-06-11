
// // app.js

// //  Safe reusable loader
// function loadComponent(file, placeholderId, callback) {
//   const placeholder = document.getElementById(placeholderId);
//   if (!placeholder) {
//     console.warn(`ï¸ Placeholder #${placeholderId} not found on this page, skipping ${file}`);
//     return;
//   }

//   fetch(file)
//     .then(res => res.text())
//     .then(data => {
//       placeholder.innerHTML = data;
//       if (callback) callback();
//     })
//     .catch(err => console.error(" Error loading component:", file, err));
// }

// //  Render user info in header
// function renderHeaderUserInfo() {
//   const userInfo = document.getElementById("user-info");
//   if (!userInfo) return;

//   const user = getUser(); // from storage.js
//   if (user) {
//     userInfo.innerHTML = `
//       <span>Welcome, ${user.name}</span>
//       <button onclick="signOut()" class="btn-secondary">Sign Out</button>
//     `;
//   } else {
//     userInfo.innerHTML = `
//       <button onclick="document.getElementById('auth-modal').classList.remove('hidden')" class="btn-primary">
//         Sign In
//       </button>
//     `;
//   }
// }

// //  initAuthModal
// function initAuthModal() {
//   const modal = document.getElementById("auth-modal");
//   const saveBtn = document.getElementById("auth-save-btn");
//   const cancelBtn = document.getElementById("auth-cancel-btn");
//   const closeBtn = document.getElementById("auth-close-btn");
//   const openTriggers = document.querySelectorAll("[aria-controls='auth-modal'], #btn-auth");

//   function getFocusable(el) {
//     return el.querySelectorAll(
//       'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
//     );
//   }

//   let trapRemover = null;
//   let lastFocused = null;

//   function openModal() {
//     if (!modal) return;
//     lastFocused = document.activeElement;
//     modal.classList.remove("hidden");
//     modal.setAttribute("aria-hidden", "false");
//     const focusable = getFocusable(modal);
//     if (focusable.length) focusable[0].focus();

//     function keyHandler(e) {
//       if (e.key === "Escape") {
//         e.preventDefault();
//         closeModal();
//         return;
//       }
//       if (e.key === "Tab") {
//         const focusables = Array.from(getFocusable(modal));
//         if (!focusables.length) return;
//         const first = focusables[0],
//           last = focusables[focusables.length - 1];
//         if (e.shiftKey && document.activeElement === first) {
//           e.preventDefault();
//           last.focus();
//         } else if (!e.shiftKey && document.activeElement === last) {
//           e.preventDefault();
//           first.focus();
//         }
//       }
//     }
//     modal.addEventListener("keydown", keyHandler);
//     trapRemover = () => modal.removeEventListener("keydown", keyHandler);
//   }

//   function closeModal() {
//     if (!modal) return;
//     modal.classList.add("hidden");
//     modal.setAttribute("aria-hidden", "true");
//     if (trapRemover) trapRemover();
//     trapRemover = null;
//     if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
//   }

//   openTriggers.forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       e.preventDefault();
//       openModal();
//     });
//     btn.addEventListener("keydown", (e) => {
//       if (e.key === "Enter" || e.key === " ") {
//         e.preventDefault();
//         openModal();
//       }
//     });
//   });

//   if (saveBtn) {
//     saveBtn.addEventListener("click", () => {
//       const nameEl = document.getElementById("input-name");
//       const emailEl = document.getElementById("input-email");
//       const genderEl = document.getElementById("input-gender");
//       const ageEl = document.getElementById("input-age");
//       const classEl = document.getElementById("input-class");
//       const streamEl = document.getElementById("input-stream");
//       const interestsEl = document.getElementById("input-interests");
//       const careerGoalEl = document.getElementById("input-career-goal");
//       const skillsEl = document.getElementById("input-skills");
//       const locationEl = document.getElementById("input-location");

//       if (
//         !nameEl.value.trim() ||
//         !emailEl.value.trim() ||
//         !genderEl.value ||
//         !ageEl.value.trim() ||
//         !classEl.value ||
//         !streamEl.value ||
//         !locationEl.value.trim()
//       ) {
//         alert("Please fill all required fields!");
//         return;
//       }

//       const userObj = {
//         name: nameEl.value.trim(),
//         email: emailEl.value.trim(),
//         gender: genderEl.value,
//         age: ageEl.value.trim(),
//         class: classEl.value,
//         stream: streamEl.value,
//         interests: interestsEl.value.trim(),
//         careerGoal: careerGoalEl.value.trim(),
//         skills: skillsEl.value.trim(),
//         location: locationEl.value.trim(),
//         createdAt: new Date().toISOString(),
//       };

//       saveUser(userObj); // storage.js
//       closeModal();
//       setTimeout(renderHeaderUserInfo, 80);
//     });
//   }

//   if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
//   if (closeBtn) closeBtn.addEventListener("click", closeModal);

//   const overlay = modal ? modal.querySelector(".auth-modal-overlay") : null;
//   if (overlay) overlay.addEventListener("click", closeModal);
// }

// //  Animate feature cards
// function initFeatureCardsAnimation() {
//   document.addEventListener("scroll", () => {
//     document.querySelectorAll(".feature-card").forEach((card) => {
//       const rect = card.getBoundingClientRect();
//       if (rect.top < window.innerHeight - 50) {
//         card.style.opacity = "1";
//         card.style.transform = "translateY(0)";
//       }
//     });
//   });
// }

// //  Detect current page
// function getCurrentPage() {
//   const path = window.location.pathname;
//   return path.split("/").pop();
// }

// //  Bootstrap per-page
// function initPage() {
//   const page = getCurrentPage();

//   switch (page) {
//     case "index.html":
//       if (typeof loadFeaturedColleges === "function") loadFeaturedColleges();
//       if (typeof loadFeaturedScholarships === "function") loadFeaturedScholarships();
//       break;

//     case "quiz.html":
//       if (typeof startQuiz === "function") console.log("Quiz page ready ");
//       break;

//     case "colleges.html":
//       if (typeof showColleges === "function") showColleges("");
//       break;

//     case "career-detail.html":
//       if (typeof renderCareerDetail === "function") renderCareerDetail();
//       break;

//     case "careers.html":
//       if (typeof renderCareerList === "function") renderCareerList();
//       break;

//     case "scholarships.html":
//       if (typeof renderScholarships === "function") renderScholarships(scholarships);
//       break;

//     case "jobs.html":
//       if (typeof loadJobs === "function") loadJobs();
//       break;

//     case "job-details.html":
//       if (typeof loadJobDetail === "function") loadJobDetail();
//       break;

//     case "exams.html":
//       if (typeof loadExams === "function") loadExams();
//       break;

//     case "profile.html":
//       break;

//     default:
//       console.log("No specific init for", page);
//   }
// }

// //  Safe stub for navbar (prevents crash if not defined elsewhere)
// function initNavbar() {
//   console.log("Navbar initialized ");
// }

// // DOM Ready
// document.addEventListener("DOMContentLoaded", () => {
//   // Header
//   loadComponent("/components/header.html", "header-placeholder", () => {
//     renderHeaderUserInfo();
//     if (typeof initNavbar === "function") initNavbar();
//     window.addEventListener("storage", renderHeaderUserInfo);
//   });

//   // Footer, modal, chatbot
//   loadComponent("/components/footer.html", "footer-placeholder");
//   loadComponent("/components/auth-modal.html", "modal-placeholder", () => {
//     initAuthModal();
//   });
//   loadComponent("/components/chatbot-widget.html", "chatbot-placeholder", () => {
//     if (typeof initChatbot === "function") initChatbot();
//   });

//   initFeatureCardsAnimation();

//   // Init per-page
//   setTimeout(() => {
//     renderHeaderUserInfo();
//     initPage();
//   }, 300);
// });

// // Accessibility helpers
// function addEscapeClose(ctrl, closeFn) {
//   if (!ctrl) return;
//   ctrl.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") closeFn();
//   });
// }

// function openAuthModal() {
//   const modal = document.getElementById("auth-modal");
//   if (modal) {
//     modal.classList.remove("hidden");
//     document.body.style.overflow = "hidden";
//   }
// }

// function closeAuthModal() {
//   const modal = document.getElementById("auth-modal");
//   if (modal) {
//     modal.classList.add("hidden");
//     document.body.style.overflow = "";
//   }
// }

// // Safe stub for navbar (prevents crash if not defined elsewhere)
// function initNavbar() {
//   console.log("Navbar initialized ");
// }

// const hamburgerBtn = document.getElementById("hamburger-btn");
// const mobileMenu = document.getElementById("mobile-menu");

// hamburgerBtn.addEventListener("click", () => {
//   const isActive = mobileMenu.classList.toggle("active");
//   hamburgerBtn.setAttribute("aria-expanded", isActive);
// });

// app.js

//  Safe reusable loader
function loadComponent(file, placeholderId, callback) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    console.warn(`ï¸ Placeholder #${placeholderId} not found on this page, skipping ${file}`);
    return;
  }

  fetch(file)
    .then(res => res.text())
    .then(data => {
      placeholder.innerHTML = data;
      if (callback) callback();
    })
    .catch(err => console.error(" Error loading component:", file, err));
}

//  Render user info in header
function renderHeaderUserInfo() {
  const userInfo = document.getElementById("user-info");
  if (!userInfo) return;

  const user = getUser(); // from storage.js
  if (user) {
    userInfo.innerHTML = `
      <span>Welcome, ${user.name}</span>
      <button onclick="signOut()" class="btn-secondary">Sign Out</button>
    `;
  } else {
    userInfo.innerHTML = `
      <button onclick="document.getElementById('auth-modal').classList.remove('hidden')" class="btn-primary">
        Sign In
      </button>
    `;
  }
}

//  initAuthModal
function initAuthModal() {
  const modal = document.getElementById("auth-modal");
  const saveBtn = document.getElementById("auth-save-btn");
  const cancelBtn = document.getElementById("auth-cancel-btn");
  const closeBtn = document.getElementById("auth-close-btn");
  const openTriggers = document.querySelectorAll("[aria-controls='auth-modal'], #btn-auth");

  function getFocusable(el) {
    return el.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  let trapRemover = null;
  let lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    const focusable = getFocusable(modal);
    if (focusable.length) focusable[0].focus();

    function keyHandler(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === "Tab") {
        const focusables = Array.from(getFocusable(modal));
        if (!focusables.length) return;
        const first = focusables[0],
          last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    modal.addEventListener("keydown", keyHandler);
    trapRemover = () => modal.removeEventListener("keydown", keyHandler);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    if (trapRemover) trapRemover();
    trapRemover = null;
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  openTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal();
      }
    });
  });

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const nameEl = document.getElementById("input-name");
      const emailEl = document.getElementById("input-email");
      const genderEl = document.getElementById("input-gender");
      const ageEl = document.getElementById("input-age");
      const classEl = document.getElementById("input-class");
      const streamEl = document.getElementById("input-stream");
      const interestsEl = document.getElementById("input-interests");
      const careerGoalEl = document.getElementById("input-career-goal");
      const skillsEl = document.getElementById("input-skills");
      const locationEl = document.getElementById("input-location");

      if (
        !nameEl.value.trim() ||
        !emailEl.value.trim() ||
        !genderEl.value ||
        !ageEl.value.trim() ||
        !classEl.value ||
        !streamEl.value ||
        !locationEl.value.trim()
      ) {
        alert("Please fill all required fields!");
        return;
      }

      const userObj = {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        gender: genderEl.value,
        age: ageEl.value.trim(),
        class: classEl.value,
        stream: streamEl.value,
        interests: interestsEl.value.trim(),
        careerGoal: careerGoalEl.value.trim(),
        skills: skillsEl.value.trim(),
        location: locationEl.value.trim(),
        createdAt: new Date().toISOString(),
      };

      saveUser(userObj); // storage.js
      closeModal();
      setTimeout(renderHeaderUserInfo, 80);
    });
  }

  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const overlay = modal ? modal.querySelector(".auth-modal-overlay") : null;
  if (overlay) overlay.addEventListener("click", closeModal);
}

//  Animate feature cards
function initFeatureCardsAnimation() {
  document.addEventListener("scroll", () => {
    document.querySelectorAll(".feature-card").forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }
    });
  });
}

//  Detect current page
function getCurrentPage() {
  const path = window.location.pathname;
  return path.split("/").pop();
}

//  Bootstrap per-page
function initPage() {
  const page = getCurrentPage();

  switch (page) {
    case "index.html":
      if (typeof loadFeaturedColleges === "function") loadFeaturedColleges();
      if (typeof loadFeaturedScholarships === "function") loadFeaturedScholarships();
      break;

    case "quiz.html":
      if (typeof startQuiz === "function") console.log("Quiz page ready ");
      break;

    case "colleges.html":
      if (typeof showColleges === "function") showColleges("");
      break;

    case "career-detail.html":
      if (typeof renderCareerDetail === "function") renderCareerDetail();
      break;

    case "careers.html":
      if (typeof renderCareerList === "function") renderCareerList();
      break;

    case "scholarships.html":
      if (typeof renderScholarships === "function") renderScholarships(scholarships);
      break;

    case "jobs.html":
      if (typeof loadJobs === "function") loadJobs();
      break;

    case "job-details.html":
      if (typeof loadJobDetail === "function") loadJobDetail();
      break;

    case "exams.html":
      if (typeof loadExams === "function") loadExams();
      break;

    case "profile.html":
      break;

    default:
      console.log("No specific init for", page);
  }
}

//  Navbar init (Hamburger + Mobile menu)
function initNavbar() {
  console.log("Navbar initialized ");

  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", () => {
      const isActive = mobileMenu.classList.toggle("active");
      hamburgerBtn.setAttribute("aria-expanded", isActive);
    });

    // Close when clicking any link or button inside menu
    mobileMenu.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Optional: close if clicked outside
    document.addEventListener("click", (e) => {
      if (
        mobileMenu.classList.contains("active") &&
        !mobileMenu.contains(e.target) &&
        e.target !== hamburgerBtn
      ) {
        mobileMenu.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  // Header
  loadComponent("/components/header.html", "header-placeholder", () => {
    renderHeaderUserInfo();
    initNavbar();
    window.addEventListener("storage", renderHeaderUserInfo);
  });

  // Footer, modal, chatbot
  loadComponent("/components/footer.html", "footer-placeholder");
  loadComponent("/components/auth-modal.html", "modal-placeholder", () => {
    initAuthModal();
  });
  loadComponent("/components/chatbot-widget.html", "chatbot-placeholder", () => {
    if (typeof initChatbot === "function") initChatbot();
  });

  initFeatureCardsAnimation();

  // Init per-page
  setTimeout(() => {
    renderHeaderUserInfo();
    initPage();
  }, 300);
});

// Accessibility helpers
function addEscapeClose(ctrl, closeFn) {
  if (!ctrl) return;
  ctrl.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFn();
  });
}

function openAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}


