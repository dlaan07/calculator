const messages = [
	"stop! you violated the law!",
	"¯\_(ツ)_/¯",
	"wait, hol up",
	"nope, can't do that",
	"sorry bruh",
	"don't destroy us, please?",
	"you okay there?",
	"dIvIDe bY zErO",
	"huh? you sure?",
	"nope, nuh uh",
]

function add(a,b){
	return a+b;
}
function subtract(a,b){
	return a-b;
}
function multiply(a,b){
	return a*b;
}
function divide(a,b){
	return a/b;
}

function operate(a,b, operator){
	switch(operator){
		case "+":
			// console.log(add(a,b));
			resultEnabled = true;
			return add(a,b);
			break;
		case "-":
			// console.log(subtract(a,b));
			resultEnabled = true;
			return subtract(a,b);
			break;
		case "*":
			// console.log(multiply(a,b));
			resultEnabled = true;
			return multiply(a,b);
			break;
		case "/":
			// console.log(divide(a,b));
			if(b === 0) {
				resultEnabled = false;
				return messages[Math.floor(Math.random()*(messages.length-1))];
			}
			else {
				resultEnabled = true;
				return divide(a,b);
			}
			break;
		default:
			break;
	}
}

const operators = ["*", "/", "+", "-"];
const precedence = [2, 2, 1, 1];

function toRPN(expression){
	// expression = expression.split("");
	let stack = [];
	let output = [];
	for(var i = 0; i < expression.length; i++){
		if(operators.includes(expression[i])) {
			let currentPrecedent = precedence[operators.indexOf(expression[i])];
			let lastPrecedent = precedence[operators.indexOf(stack[stack.length-1])];
			if(currentPrecedent > lastPrecedent){
				stack.push(expression[i]);
			}
			else{
				let stackIndex = stack.length-1;
				// console.log(stack);
				while(currentPrecedent <= lastPrecedent && stack.length > 0){
					output.push(stack[stackIndex]);
					stack.pop();
					stackIndex = stack.length-1;
					lastPrecedent = precedence[operators.indexOf(stack[stackIndex])];
				}
				stack.push(expression[i]);
			}
		}
		else output.push(expression[i]);
	}
	for(var i = stack.length-1; i > -1 ; i--){
		output.push(stack[i]);
	}
	return output;
}

function RPNResult(array){
	let stack = [];
	for (var i = 0; i < array.length; i++) {
		if(operators.includes(array[i])){
			let result = operate(stack[stack.length-2],stack[stack.length-1],array[i]);
			if(isNaN(result)) return result;
			stack.pop();
			stack.pop();
			stack.push(result);
		}
		else stack.push(parseFloat(array[i]));
	}
	return stack[0];
}

let inputString = document.querySelector("#inputString");
let resultString = document.querySelector("#resultString");
let expression = [];
let currentNumber = "";
let expressionResult = 0;
let resultEnabled = true;

function clear(){
	inputString.innerText = "";
	resultString.innerText = 0;
	expression = [];
	currentNumber = "";
	expressionResult = 0;
	resultEnabled = true;
}

function evaluate(){
	expression = toRPN(expression);
	let result = RPNResult(expression);

	inputString.innerText = "";
	resultString.innerText = result;
	expression = [];
	currentNumber = "";
	expressionResult = result;
}
function backspace(){
	inputString.innerText = inputString.innerText.slice(0,-1);

	if(operators.includes(expression[expression.length-1])) { // last input is operator
		expression.pop();
		currentNumber = expression[expression.length-1];
		expression.pop();
		expression.push(currentNumber);
		console.log("expression " + expression);
	}
	else{ // last input is number
		currentNumber = currentNumber.slice(0,-1);
		if(currentNumber === "") {
			expression.pop();
			console.log("expression " + expression);
		}
		else{
			expression.pop();
			expression.push(currentNumber);
		}
		console.log("currentNumber " + currentNumber);
	}
}
function enterResult(){
	if(resultEnabled) {
		inputString.innerText = resultString.innerText;
		expression = [];
		expression.push(resultString.innerText);
		currentNumber = resultString.innerText;
		console.log(expression);
	}
}
resultString.addEventListener("click", () => {
	enterResult();
	inputString.scrollLeft = inputString.scrollWidth;
});

let clearButton = document.querySelector(".clear-button");
clearButton.addEventListener("click", () => clear());
let backspaceButton = document.querySelector(".backspace-button");
backspaceButton.addEventListener("click", () => backspace());
let evaluateButton = document.querySelector(".evaluate-button");
evaluateButton.addEventListener("click", ()=>{
	if (operators.includes(expression[expression.length-1]) === false){
		console.log(expression);
		evaluate();
	}
})

function enterChar(char){
	inputString.innerText += char;
}

function enterNumber(num){
	if(currentNumber !== ""){
		expression.pop();
		// console.log("expression " + expression);
	}
	currentNumber += num;
	// console.log("currentNumber " + currentNumber);
	console.log(currentNumber);
	expression.push(currentNumber);
	// console.log("expression " + expression);
	console.log(expression);
}
function enterOperator(operator){
	if(expression.length === 0){ //if input is empty
		if(resultEnabled){ //if not error message
			expression.push(resultString.innerText);
			inputString.innerText = resultString.innerText;
		}
		else { //if error message
			expression.push("0");
			inputString.innerText = "0";
		}
		expression.push(operator);
	}

	else {
		if (operators.includes(expression[expression.length-1])) { //if last input is also operator
			expression.pop();
			inputString.innerText = inputString.innerText.slice(0,-1);
		}
		expression.push(operator);
	}

	currentNumber = "";
	// console.log("currentNumber " + currentNumber);
	// console.log("expression " + expression);
	console.log(currentNumber);
	console.log(expression);
}
function enterComma(){
	if(currentNumber.indexOf(".") === -1){
		if(currentNumber !== ""){
			expression.pop();
			console.log("expression " + expression);
		}
		else{
			currentNumber += "0";
			inputString.innerText += "0";
		}
		currentNumber += ".";
		enterChar(".");
		expression.push(currentNumber);
		console.log("currentNumber " + currentNumber);
		console.log("expression " + expression);
	}
}

let numberButton = document.querySelectorAll(".number-button");
for(i = 0; i < numberButton.length; i++){
	numberButton[i].addEventListener("click", function(){
		enterNumber(this.innerText);
		enterChar(this.innerText);
		inputString.scrollLeft = inputString.scrollWidth;
	})	
}
let operatorButton = document.querySelectorAll(".operator-button");
for(i = 0; i < operatorButton.length; i++){
	operatorButton[i].addEventListener("click", function(){
		enterOperator(this.innerText);
		enterChar(this.innerText);
		inputString.scrollLeft = inputString.scrollWidth;
	})
}
let commaButton = document.querySelector(".comma-button");
commaButton.addEventListener("click", function(){
	enterComma();
	inputString.scrollLeft = inputString.scrollWidth;
})

/*==Keyboard support==*/
let numKeys = ["0","1","2","3","4","5","6","7","8","9"];
window.addEventListener("keydown", (event)=>{
	if(numKeys.includes(String(event.key))) {
		enterNumber(String(event.key));
		enterChar(String(event.key));
		inputString.scrollLeft = inputString.scrollWidth;
	}
	if(operators.includes(String(event.key))) {
		enterOperator(String(event.key));
		enterChar(String(event.key));
		inputString.scrollLeft = inputString.scrollWidth;
	}
	else if(event.key === ".") {
		enterComma();
		inputString.scrollLeft = inputString.scrollWidth;
	}
	else if(event.key === "Backspace") backspace();
	else if(event.key === "Enter") {
		if(operators.includes(expression[expression.length-1]) === false) {
			// console.log("Keyboard Evaluate");
			// console.log(currentNumber);
			// console.log(expression);
			evaluate();
			expression = [];
			currentNumber = "";
		}
	}
})

fitty("#resultString");