// document.addEventListener("DOMContentLoaded", () => {
//   const ball = document.getElementById("chatbot-ball");
//   const sidebar = document.getElementById("chatbot-sidebar");
//   const closeBtn = document.getElementById("chatbot-close");

//   if (ball && sidebar) {
//     ball.addEventListener("click", () => {
//       sidebar.classList.add("active");
//       ball.style.display = "none"; // hide icon when sidebar open
//     });
//   }

//   if (closeBtn) {
//     closeBtn.addEventListener("click", () => {
//       sidebar.classList.remove("active");
//       ball.style.display = "flex"; // show icon again when closed
//     });
//   }
// });

// // chatbot.js me add karo
// document.getElementById("chatbot-send").addEventListener("click", () => {
//   const input = document.getElementById("chatbot-input");
//   const body = document.getElementById("chatbot-body");

//   if (input.value.trim() !== "") {
//     // user msg
//     const userMsg = document.createElement("div");
//     userMsg.className = "user-msg";
//     userMsg.textContent = input.value;
//     body.appendChild(userMsg);

//     // bot reply
//     const botMsg = document.createElement("div");
//     botMsg.className = "bot-msg";
//     botMsg.textContent = "Thanks for your question! (AI integration coming soon 🤖)";
//     body.appendChild(botMsg);

//     input.value = "";
//     body.scrollTop = body.scrollHeight; // auto scroll
//   }
// });

// // chatbot.js
// function initChatbot() {
//   const ball = document.getElementById("chatbot-ball");
//   const sidebar = document.getElementById("chatbot-sidebar");
//   const closeBtn = document.getElementById("chatbot-close");
//   const sendBtn = document.getElementById("chatbot-send");
//   const input = document.getElementById("chatbot-input");
//   const body = document.getElementById("chatbot-body");
//   const aiBuddy = document.getElementById("AIBUDDY");

//   if (!ball || !sidebar) {
//     console.error("Chatbot elements not found!");
//     return;
//   }

//   function openChat() {
//     sidebar.classList.add("active");
//     sidebar.setAttribute("aria-hidden", "false");
//     ball.style.display = "none";
//     input.focus();
//   }

//   function closeChat() {
//     sidebar.classList.remove("active");
//     sidebar.setAttribute("aria-hidden", "true");
//     ball.style.display = "flex";
//     ball.focus();
//   }


//   if (aiBuddy) {
//     aiBuddy.addEventListener("click", (e) => {
//       e.preventDefault(); // prevent # reload
//       openChat();
//     });

//     // open on click / keyboard
//     ball.addEventListener("click", openChat);
//     ball.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openChat(); });

//     closeBtn.addEventListener("click", closeChat);

//     // ESC to close when sidebar focused
//     sidebar.addEventListener("keydown", (e) => {
//       if (e.key === "Escape") closeChat();
//     });

//     // send message helpers
//     function sendMessage() {
//       const text = input.value.trim();
//       if (!text) return;
//       const userMsg = document.createElement("div"); userMsg.className = "user-msg"; userMsg.textContent = text;
//       body.appendChild(userMsg);

//       const botMsg = document.createElement("div"); botMsg.className = "bot-msg";
//       botMsg.textContent = "Thanks for your question! (AI integration coming soon 🤖)";
//       body.appendChild(botMsg);

//       input.value = "";
//       body.scrollTop = body.scrollHeight;
//       input.focus();
//     }

//     sendBtn.addEventListener("click", sendMessage);
//     input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
//   }

// }

document.addEventListener("DOMContentLoaded", () => {
  initChatbot();
});

function initChatbot() {
  const ball = document.getElementById("chatbot-ball");
  const sidebar = document.getElementById("chatbot-sidebar");
  const closeBtn = document.getElementById("chatbot-close");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const body = document.getElementById("chatbot-body");
  const aiBuddy = document.getElementById("AIBUDDY");

  if (!ball || !sidebar || !closeBtn || !sendBtn || !input || !body) {
    console.error("Chatbot elements not found!");
    return;
  }

  // --- Helpers ---
  function openChat() {
    sidebar.classList.add("active");
    sidebar.setAttribute("aria-hidden", "false");
    ball.style.display = "none";
    input.focus();
  }

  function closeChat() {
    sidebar.classList.remove("active");
    sidebar.setAttribute("aria-hidden", "true");
    ball.style.display = "flex";
    ball.focus();
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // User message
    const userMsg = document.createElement("div");
    userMsg.className = "user-msg";
    userMsg.textContent = text;
    body.appendChild(userMsg);

    // Bot reply (dummy for now)
    const botMsg = document.createElement("div");
    botMsg.className = "bot-msg";
    botMsg.textContent = "Thanks for your question! (AI integration coming soon 🤖)";
    body.appendChild(botMsg);

    input.value = "";
    body.scrollTop = body.scrollHeight;
    input.focus();
  }

  // --- Event Listeners ---

  // AI Buddy button
  if (aiBuddy) {
    aiBuddy.addEventListener("click", (e) => {
      e.preventDefault(); // prevent anchor reload if <a href="#">
      openChat();
    });
    aiBuddy.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openChat();
      }
    });
  }

  // Open chat via floating ball
  ball.addEventListener("click", openChat);
  ball.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openChat();
  });

  // Close button
  closeBtn.addEventListener("click", closeChat);

  // ESC key to close sidebar
  sidebar.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeChat();
  });

  // Send message
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}
