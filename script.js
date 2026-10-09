/* ===== Chatty – Chatbot for Simple Questions =====
   Plain HTML + CSS + JavaScript. No libraries needed.

   HOW IT WORKS
   1. The user types a question and presses Send / Enter.
   2. getReply() checks the text against the `rules` list below.
   3. The first rule whose pattern matches gives the answer.
   4. If nothing matches, the bot shows a friendly fallback.

   TO TEACH THE BOT SOMETHING NEW, add one more object to `rules`.
*/

const messagesEl = document.getElementById("messages");
const chipsEl = document.getElementById("chips");
const form = document.getElementById("form");
const input = document.getElementById("input");
const clearBtn = document.getElementById("clear");

const suggestions = [
  "What can you do?",
  "What time is it?",
  "Tell me a joke",
  "What is 12 * 8?",
  "What is HTML?",
  "Who made you?"
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "Why did the developer go broke? He used up all his cache.",
  "I would tell you a UDP joke, but you might not get it.",
  "There are 10 types of people: those who understand binary and those who don't."
];

/* ---------- Rules (the chatbot's "brain") ---------- */
const rules = [
  {
    patterns: [/\b(hi|hello|hey|hola|namaste)\b/, /good (morning|afternoon|evening)/],
    reply: () => pick([
      "Hello! How can I help you today?",
      "Hi there! Ask me a simple question.",
      "Hey! Nice to see you."
    ])
  },
  {
    patterns: [/how are you/, /how('s| is) it going/, /how do you do/],
    reply: () => "I'm doing great, thanks for asking! How about you?"
  },
  {
    patterns: [/(i am|i'm|im) (fine|good|great|okay|ok|well)/],
    reply: () => "Glad to hear that! What would you like to ask?"
  },
  {
    patterns: [/your name/, /who are you/, /what are you/],
    reply: () => "I'm Chatty, a simple chatbot built with HTML, CSS and JavaScript."
  },
  {
    patterns: [/who (made|created|built|developed) you/, /\b(developer|creator|owner)\b/],
    reply: () => "I was built by Priyanka Reddy, a Computer Science student at VIT-AP University."
  },
  {
    patterns: [/what can you do/, /\bhelp\b/, /\bcommands?\b/],
    reply: () =>
      "I can answer simple questions. Try asking me:\n" +
      "• What time is it?\n• What is today's date?\n• Tell me a joke\n" +
      "• What is 12 * 8?\n• What is HTML, CSS or JavaScript?"
  },
  {
    patterns: [/weather/, /temperature/, /\brain\b/],
    reply: () => "I can't check live weather, but a weather app or website will have it."
  },
  {
    patterns: [/\btime\b/],
    reply: () => "It's " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " right now."
  },
  {
    patterns: [/\bdate\b/, /\bday\b/, /\btoday\b/],
    reply: () => "Today is " + new Date().toLocaleDateString([], {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }) + "."
  },
  {
    patterns: [/\bjokes?\b/, /make me laugh/, /something funny/],
    reply: () => pick(jokes)
  },
  {
    patterns: [/\bhtml\b/],
    reply: () => "HTML (HyperText Markup Language) gives a web page its structure: headings, paragraphs, links and images."
  },
  {
    patterns: [/\bcss\b/],
    reply: () => "CSS (Cascading Style Sheets) controls how a web page looks: colors, fonts, spacing and layout."
  },
  {
    patterns: [/\bjavascript\b/, /\bjs\b/],
    reply: () => "JavaScript makes web pages interactive. It reacts to clicks, updates content and powers apps like this chatbot."
  },
  {
    patterns: [/\bpython\b/],
    reply: () => "Python is a beginner-friendly programming language used for web apps, data science and AI."
  },
  {
    patterns: [/thank/, /\bthanks\b/, /\bthx\b/],
    reply: () => pick(["You're welcome!", "Happy to help!", "Anytime!"])
  },
  {
    patterns: [/\b(bye|goodbye|see you|good night)\b/],
    reply: () => "Goodbye! Come back whenever you have a question."
  }
];

/* ---------- Simple maths: "what is 12 * 8", "5 plus 3" ---------- */
function tryMath(text) {
  const m = text.match(
    /(-?\d+(?:\.\d+)?)\s*(\+|-|\*|x|×|\/|÷|plus|minus|times|divided by|multiplied by)\s*(-?\d+(?:\.\d+)?)/
  );
  if (!m) return null;

  const a = parseFloat(m[1]);
  const b = parseFloat(m[3]);
  const op = m[2];
  let result;

  if (["+", "plus"].includes(op)) result = a + b;
  else if (["-", "minus"].includes(op)) result = a - b;
  else if (["*", "x", "×", "times", "multiplied by"].includes(op)) result = a * b;
  else {
    if (b === 0) return "I can't divide by zero.";
    result = a / b;
  }
  return "The answer is " + Number(result.toFixed(6)) + ".";
}

/* ---------- Find the best reply ---------- */
function getReply(rawText) {
  const text = rawText.toLowerCase().trim();

  const maths = tryMath(text);
  if (maths) return maths;

  for (const rule of rules) {
    if (rule.patterns.some((p) => p.test(text))) return rule.reply();
  }

  return "Sorry, I don't know that one yet. Try asking about the time, the date, a joke, simple maths or type \"help\".";
}

/* ---------- Showing messages on the page (DOM) ---------- */
function timeLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollToEnd() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addMessage(text, sender) {
  const row = document.createElement("div");
  row.className = "row row--" + sender;

  const bubble = document.createElement("p");
  bubble.className = "bubble";
  bubble.textContent = text;          // textContent keeps user input safe

  const time = document.createElement("span");
  time.className = "time";
  time.textContent = timeLabel();

  row.append(bubble, time);
  messagesEl.appendChild(row);
  scrollToEnd();
}

function showTyping() {
  const row = document.createElement("div");
  row.className = "row row--bot";
  row.innerHTML = '<div class="typing" aria-label="Chatty is typing"><span></span><span></span><span></span></div>';
  messagesEl.appendChild(row);
  scrollToEnd();
  return row;
}

function sendMessage(text) {
  const clean = text.trim();
  if (!clean) return;

  addMessage(clean, "user");
  input.value = "";

  const typing = showTyping();
  setTimeout(() => {
    typing.remove();
    addMessage(getReply(clean), "bot");
  }, 500 + Math.random() * 400);       // short, natural-feeling delay
}

function welcome() {
  addMessage("Hi, I'm Chatty! Ask me a simple question, or tap one of the suggestions below.", "bot");
}

/* ---------- Events ---------- */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

clearBtn.addEventListener("click", () => {
  messagesEl.innerHTML = "";
  welcome();
  input.focus();
});

suggestions.forEach((label) => {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = label;
  chip.addEventListener("click", () => sendMessage(label));
  chipsEl.appendChild(chip);
});

welcome();
input.focus();
