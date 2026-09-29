// ----- Math functions -----
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  if (operator === "+") {
    return add(a, b);
  } else if (operator === "-") {
    return subtract(a, b);
  } else if (operator === "*") {
    return multiply(a, b);
  } else if (operator === "/") {
    return divide(a, b);
  }
}

// ----- State -----
let firstNumber = "";
let operator = "";
let secondNumber = "";
let resultShown = false;

// ----- Elements -----
const display = document.querySelector("#display");
const digitButtons = document.querySelectorAll(".digit");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector("#equals");
const clearButton = document.querySelector("#clear");
const backspaceButton = document.querySelector("#backspace");
const decimalButton = document.querySelector("#decimal");

// ----- Display -----
function getActiveNumber() {
  if (operator === "") {
    return firstNumber;
  }
  return secondNumber;
}

function updateDisplay() {
  if (operator !== "" && secondNumber !== "") {
    display.textContent = secondNumber;
  } else if (firstNumber !== "") {
    display.textContent = firstNumber;
  } else {
    display.textContent = "0";
  }

  decimalButton.disabled = !resultShown && getActiveNumber().includes(".");
}

// ----- Reset / errors -----
function resetState() {
  firstNumber = "";
  operator = "";
  secondNumber = "";
  resultShown = false;
}

function clearCalculator() {
  resetState();
  updateDisplay();
}

function showError(message) {
  resetState();
  updateDisplay();
  display.textContent = message;
}

// ----- Typing numbers -----
function appendDigit(current, digit) {
  if (current.length >= 12) {
    return current;
  }
  if (current === "0") {
    return digit;
  }
  return current + digit;
}

function inputDigit(digit) {
  if (resultShown) {
    resetState();
  }

  if (operator === "") {
    firstNumber = appendDigit(firstNumber, digit);
  } else {
    secondNumber = appendDigit(secondNumber, digit);
  }

  updateDisplay();
}

function appendDecimal(current) {
  if (current.includes(".")) {
    return current;
  }
  if (current === "") {
    return "0.";
  }
  return current + ".";
}

function inputDecimal() {
  if (resultShown) {
    resetState();
  }

  if (operator === "") {
    firstNumber = appendDecimal(firstNumber);
  } else {
    secondNumber = appendDecimal(secondNumber);
  }

  updateDisplay();
}

function handleBackspace() {
  if (resultShown) {
    return;
  }

  if (operator === "") {
    firstNumber = firstNumber.slice(0, -1);
  } else if (secondNumber !== "") {
    secondNumber = secondNumber.slice(0, -1);
  } else {
    operator = "";
  }

  updateDisplay();
}

// ----- Calculating -----
function calculate() {
  const a = Number(firstNumber);
  const b = Number(secondNumber);

  if (operator === "/" && b === 0) {
    showError("Nice try! Can't divide by 0.");
    return null;
  }

  const result = operate(operator, a, b);
  return String(parseFloat(result.toFixed(8)));
}

function handleOperator(newOperator) {
  if (firstNumber === "") {
    firstNumber = "0";
  }

  if (operator !== "" && secondNumber !== "") {
    const result = calculate();
    if (result === null) {
      return;
    }
    firstNumber = result;
    secondNumber = "";
  }

  operator = newOperator;
  resultShown = false;
  updateDisplay();
}

function handleEquals() {
  if (firstNumber === "" || operator === "" || secondNumber === "") {
    return;
  }

  const result = calculate();
  if (result === null) {
    return;
  }

  firstNumber = result;
  operator = "";
  secondNumber = "";
  resultShown = true;
  updateDisplay();
}

// ----- Connect buttons -----
digitButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    inputDigit(button.dataset.digit);
  });
});

operatorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    handleOperator(button.dataset.operator);
  });
});

equalsButton.addEventListener("click", handleEquals);
clearButton.addEventListener("click", clearCalculator);
backspaceButton.addEventListener("click", handleBackspace);
decimalButton.addEventListener("click", inputDecimal);

// ----- Keyboard support -----
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if ("0123456789".includes(key)) {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    event.preventDefault();
    handleOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    handleEquals();
  } else if (key === "Backspace") {
    handleBackspace();
  } else if (key === "Escape") {
    clearCalculator();
  }
});

// ----- Start -----
updateDisplay();