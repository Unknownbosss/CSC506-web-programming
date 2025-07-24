// wait for dom content to load
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth", // optional for smooth animation
  });

  const display = document.getElementById("display");
  const clearButton = document.getElementById("clear");
  const history = document.getElementById("history");
  const buttons = document.querySelectorAll("button");
  const gridButtons = document.getElementById("button-container");
  const toggleSci = document.getElementById("toggle-sci");
  const theme = document.getElementById("theme");

  // autoscroll to bottom to view calculator by default
  let expression = { question: "", answer: "" };
  let overAllHistory = [];
  let lastPressed = "";
  let result = "";
  let isScientific = false;

  function evaluateExpression(expr) {
    try {
      // Replace math symbols with JS equivalents
      expr = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/√/g, "Math.sqrt");
      expr = expr.replace(/sin\(/g, "Math.sin(");
      expr = expr.replace(/cos\(/g, "Math.cos(");
      expr = expr.replace(/tan\(/g, "Math.tan(");
      expr = expr.replace(/log\(/g, "Math.log10(");
      expr = expr.replace(/ln\(/g, "Math.log(");
      expr = expr.replace(/π/g, Math.PI);
      expr = expr.replace(/e/g, Math.E);
      expr = expr.replace(/\^/g, "**");

      const value = eval(expr);
      return +parseFloat(value).toFixed(10);
    } catch (e) {
      return "Error";
    }
  }
  function updateDisplay() {
    updateClearDisplay();
    display.innerHTML = expression.question
      ? `
        <p class="current-question">${expression.question}</p>
        <p class="current-answer">${"=" + expression.answer}</p>`
      : `<p class="current-question"></p>
        <p class="current-answer">0</p>`;
  }

  function updateClearDisplay() {
    if (expression.question) {
      clearButton.textContent = "C";
      clearButton.dataset.value = "C";
    } else {
      clearButton.textContent = "AC";
      clearButton.dataset.value = "AC";
    }
  }

  function updateHistoryDisplay() {
    history.innerHTML = "";

    overAllHistory.map(({ question, answer }) => {
      const el = document.createElement("div");
      el.innerHTML = `
          <p class="question">${question}</p>
          <p class="answer">${answer}</p>
        `;
      history.appendChild(el);
    });
  }

  function handleInput(value) {
    const operators = ["+", "-", "*", "/", "x"];
    if (value === "=") {
      if (expression.question.trim() === "") return;
      result = evaluateExpression(expression.question);
      overAllHistory = [...overAllHistory, expression];
      // overAllHistory.push(expression);
      expression.answer = result.toString();
      updateHistoryDisplay();
    } else if (value === "del") {
      expression.question = expression.question.slice(0, -1);
    } else if (value === "C") {
      expression = { question: "", answer: "" };
      clearButton.innerText = "AC";
      clearButton.dataset.value = "AC";
    } else if (value === "AC") {
      overAllHistory = [];
      updateHistoryDisplay();
      expression = { question: "", answer: "" };
    } else if (value === "^") {
      expression.question += "^";
    } else if (value === "x!") {
      try {
        let num = parseInt(expression.question);
        if (isNaN(num) || num < 0) {
          expression.question = "Error";
        } else {
          let fact = 1;
          for (let i = 2; i < num; i++) {
            fact *= i;
            expression.answer = fact.toString();
          }
        }
      } catch (err) {
        expression.question = "Error";
      }
    } else if (value === "(") {
      expression.question += "(";
    } else if (value === "(") {
      expression.question += "(";
    } else if (value === "%") {
      let num = parseInt(expression.question | "0");
      if (isNaN(num)) {
        expression.question = "Error";
      } else {
        let result = num / 100;
        expression.answer = result.toString();
      }
    } else if (value === "1/x") {
      let num = parseInt(expression.question | "0");
      if (isNaN(num)) {
        expression.question = "Error";
      } else {
        let result = 1 / num;
        expression.answer = result.toString();
      }
    } else if (value === ".") {
      if (!/[.]\d*$/.test(expression.question)) {
        expression.question += ".";
      }
    } else if (operators.includes(value)) {
      //replace last operator if another is pressed
      if (operators.includes(lastPressed)) {
        expression.question = expression.question.slice(operators, -1) + value;
      } else {
        expression.question += value;
      }
    } else if (value === "x^2") {
      let num = parseInt(expression.question | "0");
      if (isNaN(num)) {
        expression.question = "Error";
      } else {
        let squared = num ** 2;
        expression.answer = squared.toString();
      }
    } else if (value === "x^3") {
      let num = parseInt(expression.question | "0");
      if (isNaN(num)) {
        expression.question = "Error";
      } else {
        let squared = num ** 3;
        expression.answer = squared.toString();
      }
    } else if (value === "tgle") {
      document.querySelectorAll(".scientific").forEach((button) => {
        button.classList.toggle("hidden");
        isScientific = !isScientific;
        if (isScientific) {
          gridButtons.style.gridTemplateColumns = "repeat(5,1fr)";
        } else {
          gridButtons.style.gridTemplateColumns = "repeat(4,1fr)";
        }
      });
    } else {
      expression.question += value;
    }

    lastPressed = value;
    updateDisplay();
  }

  toggleSci.addEventListener("click", () => {});
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const val = button.dataset.value;
      if (val) handleInput(val);
    });
  });

  theme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    theme.innerHTML = document.body.classList.contains("dark")
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
  });
  updateDisplay();
});
