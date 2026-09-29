let firstNumber = "";
let operator = "";
let secondNumber = "";
let resultShown = false;




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



// ----- Grab elements from the page -----
const display = document.querySelector("#display");
const digitButtons = document.querySelectorAll(".digit");
const operatorButtons = document.querySelectorAll(".operator");
const equalsButton = document.querySelector("#equals");
const clearButton = document.querySelector("#clear");
const backspaceButton = document.querySelector("#backspace");
const decimalButton = document.querySelector("#decimal");

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

  // Disable "." if the number being typed already has one
  decimalButton.disabled = !resultShown && getActiveNumber().includes(".");
  decimalButton.addEventListener("click", inputDecimal);
}

function handleBackspace() {
  // Don't edit a finished answer
  if (resultShown) {
    return;
  }

  if (operator === "") {
    firstNumber = firstNumber.slice(0, -1);
  } else if (secondNumber !== "") {
    secondNumber = secondNumber.slice(0, -1);
  } else {
    operator = ""; // undo the operator you just picked
  }

  updateDisplay();
}

backspaceButton.addEventListener("click", handleBackspace);

// ----- Reset everything -----
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

// ----- Digits -----
function appendDigit(current, digit) {
  if (current.length >= 12) {
    return current; // too long, ignore extra digits
  }
  if (current === "0") {
    return digit; // replace a lone 0 so we don't get "05"
  }
  return current + digit;
}

function inputDigit(digit) {
  // If the screen shows an answer, a new digit starts a fresh calculation
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
    return current; // already has a decimal point
  }
  if (current === "") {
    return "0."; // typing "." first gives "0."
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


// ----- Errors -----
function showError(message) {
  resetState();
  updateDisplay();
  display.textContent = message;
}

// ----- Calculate one pair of numbers -----
function calculate() {
  const a = Number(firstNumber);
  const b = Number(secondNumber);

  // Dividing by zero: snarky message, no crash
  if (operator === "/" && b === 0) {
    showError("Nice try! Can't divide by 0.");
    return null;
  }

  const result = operate(operator, a, b);

  // Round long decimals, then turn back into text
  return String(parseFloat(result.toFixed(8)));
}

// ----- Operators -----
function handleOperator(newOperator) {
  if (firstNumber === "") {
    firstNumber = "0";
  }

  // We have a full pair already: calculate it first
  if (operator !== "" && secondNumber !== "") {
    const result = calculate();
    if (result === null) {
      return; // there was an error, stop here
    }
    firstNumber = result;
    secondNumber = "";
  }

  operator = newOperator;
  resultShown = false;
  updateDisplay();
}

// ----- Equals -----
function handleEquals() {
  // Not enough info to calculate: do nothing
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





// ----- Connect the buttons -----
digitButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    inputDigit(button.dataset.digit);
  });
});

clearButton.addEventListener("click", clearCalculator);


operatorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    handleOperator(button.dataset.operator);
  });
});

equalsButton.addEventListener("click", handleEquals);


updateDisplay();


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