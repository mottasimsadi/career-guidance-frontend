const BASE_URL = "http://127.0.0.1:8000";
const chat = document.getElementById("chatWindow");
const input = document.getElementById("userInput");
const send = document.getElementById("sendBtn");

// Track conversation state
let step = 0;
let data = {};

function addMessage(text, sender = "agent", html = false) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerHTML = html ? text : text.replace(/\n/g, "<br>");
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function ask(question) {
  addMessage(question);
}

// API helper
async function api(path, method = "GET", body = null) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    try {
      return JSON.parse(text);
    } catch {
      console.warn("Invalid JSON:", text);
      return { error: "Invalid JSON", raw: text };
    }
  } catch (e) {
    addMessage(`⚠️ Error: ${e.message}`, "agent");
    throw e;
  }
}

function renderJSON(obj) {
  return `<div class="scroll-box">${JSON.stringify(obj, null, 2)}</div>`;
}


// Main Chat Flow

async function nextStep(userInput) {
  addMessage(userInput, "user");

  switch (step) {
    case 0:
      // Step 0 — Decide the job role
      if (userInput.toLowerCase().includes("data")) {
        data.job_role = "data_analyst";
      } else {
        data.job_role = "software_engineer";
      }
      ask("🌍 Do you want to prepare for Bangladesh or Global market?");
      step++;
      break;

    case 1:
      // Step Location
      data.location = userInput.toLowerCase().includes("bang")
        ? "Bangladesh"
        : "Global";

      // Step Ask for specialization
      if (data.job_role === "software_engineer") {
        ask(
          "⚙️ Which specialization are you interested in? (Frontend, Backend, Full-Stack, DevOps, or Mobile)"
        );
      } else {
        ask(
          "📊 Which area would you like to focus on? (BI Analyst, SQL Analyst, or Data Visualization)"
        );
      }
      step++;
      break;

    case 2:
      //  Capture specialization / persona
      data.persona = userInput.trim(); 
      addMessage(`Got it! You want to prepare for <b>${data.persona}</b>.`, "agent", true);

      ask("⏱️ How much time do you have to prepare? (e.g., 6 months, 1 year)");
      step++;
      break;

    case 3:
      //  Capture time preference
      data.time_preference = userInput.trim();
      addMessage(`Okay, noted: ${data.time_preference}.`, "agent");
      ask("Any special preferences? (e.g., already know Java, prefer remote) — or say 'no'.");
      step++;
      break;

    case 4:
      data.preference = userInput.toLowerCase().includes("no") ? "" : userInput;
      addMessage("Generating your personalized skills list… ⏳");
      try {
        const res = await api("/generate_skills", "POST", data);
        if (res.error) {
          addMessage("⚠️ Failed to generate skills. Please try again.", "agent");
          return;
        }
        addMessage("✅ Skills generated successfully!", "agent");

        // show button
        addMessage(
          `<button type="button" class='see-btn' onclick="window.open('skills.html','_blank')">📘 See Skill List</button>`,
          "agent",
          true
        );

        // immediately ask for known skills
        ask("Do you already know any of these skills? (List them comma-separated, or say 'no')");
        step++; // go to new known-skill step
      } catch (e) {
        addMessage("⚠️ Something went wrong: " + e.message, "agent");
      }
      break;

    case 5:
      // Handle known skills
      const knownInput = userInput.trim();
      if (knownInput.toLowerCase() === "no" || knownInput.toLowerCase() === "none") {
        addMessage("Got it — keeping all recommended skills.", "agent");
      } else {
        const known_skills = knownInput.split(",").map(s => s.trim());
        addMessage("Updating your skill list by removing known skills… 🔄", "agent");

        try {
          const res2 = await api("/remove_known_skills", "POST", { known_skills });
          if (res2.error) {
            addMessage("⚠️ Failed to update skill list.", "agent");
            return;
          }
          addMessage("✅ Skill list updated! You can click the same button again to view the updated version.", "agent");
        } catch (e) {
          addMessage("⚠️ Something went wrong: " + e.message, "agent");
        }
      }

      addMessage(
        "<b>Next:</b> When you’re ready, type 'continue' to generate your personalized learning plan.",
        "agent",
        true
      );
      step++; // move to continue step
      break;


    case 6:
      if (userInput.toLowerCase().includes("continue")) {
        ask("⏰ How many hours can you study per day?");
        step++; // move to hour input
      } else {
        addMessage("You can type 'continue' anytime to proceed.", "agent");
      }
      break;

    case 7:
      const hours = parseFloat(userInput.trim()) || 3;
      addMessage(`Generating your learning plan for ${hours} hours/day… 📚`, "agent");
      try {
        const res3 = await api("/generate_learning_plan", "POST", {
          job_role: data.job_role,
          time_preference: data.time_preference,
          daily_hours: hours,
        });
        if (res3.error) {
          addMessage("⚠️ Failed to generate learning plan.", "agent");
          return;
        }
        addMessage("✅ Learning plan generated successfully!", "agent");
        addMessage(
          `<button type="button" class='see-btn' onclick="window.open('learning_plan.html','_blank')">📘 See Learning Plan</button>`,
          "agent",
          true
        );
        addMessage("🚀 You can now review your full plan and calibration on that page!", "agent");
      } catch (e) {
        addMessage("⚠️ Something went wrong: " + e.message, "agent");
      }
      break;

  }
}


// Prevent accidental form reload

document.querySelector("footer").addEventListener("submit", e => e.preventDefault());

send.addEventListener("click", e => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) return;
  input.value = "";
  nextStep(val);
});

// Handle Enter key safely
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    send.click();
  }
});

// Initial greeting
addMessage(
  "👋 Hi! I’m your AI Career Guidance Agent.<br>Would you like help preparing for a <b>Software Engineering</b> or <b>Data Analyst</b> job?",
  "agent",
  true
);
