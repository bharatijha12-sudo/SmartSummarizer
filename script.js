// script.js

// Load existing user data if any
let userData = JSON.parse(localStorage.getItem("userData") || "{}");

// ---------- LOGIN PAGE ----------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const cls = document.getElementById("class").value.trim();
    const age = document.getElementById("age").value.trim();
    const board = document.getElementById("board").value;

    userData = { name, class: cls, age, board };
    localStorage.setItem("userData", JSON.stringify(userData));
    window.location.href = "dashboard.html";
  });
}

// ---------- SUMMARY GENERATION (Dashboard) ----------
const generateBtn = document.getElementById("generateSummary");
if (generateBtn) {
  generateBtn.addEventListener("click", () => {
    const textEl = document.getElementById("textInput");
    const fileEl = document.getElementById("textImage");

    const text = textEl ? textEl.value.trim() : "";

    if (!text && (!fileEl || !fileEl.files || fileEl.files.length === 0)) {
      alert("Please paste some text or upload an image.");
      return;
    }

    // If there is text, generate summary from text
    if (text) {
      const sentences = text
        .split(/(?<=[.?!])\s+/)
        .filter((s) => s.trim().length > 15);

      const summary = sentences.slice(0, Math.min(5, sentences.length));
      localStorage.setItem("originalText", text);
      localStorage.setItem("summaryPoints", JSON.stringify(summary));

      // Reading time approx: 200 words per minute
      const words = text.split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.round(words / 200));
      localStorage.setItem("readingTime", minutes.toString());

      window.location.href = "summary.html";
      return;
    }

    // If no text but image is uploaded (we just show a message; no OCR here)
    if (fileEl && fileEl.files.length > 0) {
      const file = fileEl.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        localStorage.setItem("originalText", "(Image uploaded - text extraction not available in this version.)");
        localStorage.setItem("summaryPoints", JSON.stringify(["Please type or paste the content for accurate summarization."]));
        localStorage.setItem("readingTime", "1");
        window.location.href = "summary.html";
      };
      reader.readAsDataURL(file);
    }
  });
}

// Clear input on dashboard
const clearBtn = document.getElementById("clearInput");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    const textEl = document.getElementById("textInput");
    const fileEl = document.getElementById("textImage");
    if (textEl) textEl.value = "";
    if (fileEl) fileEl.value = "";
  });
}

// ---------- SUMMARY PAGE DISPLAY ----------
const originalTextDisplay = document.getElementById("originalTextDisplay");
const summaryList = document.getElementById("summaryList");
const readingTimeEl = document.getElementById("readingTime");

if (originalTextDisplay && summaryList && readingTimeEl) {
  const originalText = localStorage.getItem("originalText") || "";
  const summaryPoints = JSON.parse(localStorage.getItem("summaryPoints") || "[]");
  const readingTime = localStorage.getItem("readingTime") || "1";

  originalTextDisplay.textContent = originalText || "No text found.";

  summaryList.innerHTML = "";
  summaryPoints.forEach((point) => {
    const li = document.createElement("li");
    li.textContent = point;
    summaryList.appendChild(li);
  });

  readingTimeEl.textContent = `Estimated reading time for original text: ~${readingTime} minute(s).`;
}
