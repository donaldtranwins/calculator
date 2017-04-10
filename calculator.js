
/** *********
 ** ** Global Variables
 ** ********* **/
var currentInput = [];
var savedInputs = [];
var lastButton = null;
var numbersToCalculate = null;
var computations = [null];

/** *********
 ** ** Handlers
 ** ********* **/
$(document).ready(function () {
    applyHandlers();
});
function applyHandlers(){
    $(document).on('keydown',validateKeydown);
    $(document).on('keypress',validateKeypress);
    $('#calculator').on('click','.button div',buttonClicked);
}
function validateKeydown() {
    if (event.which === 8) // Allows backspace key to delete one input
        buttonClicked("←");
    if (event.which === 27) // Allows escape key to clear all
        buttonClicked("AC");
}
function validateKeypress(){
    var keysAllowed = {
        'Enter': '=', '*': 'x', '-': "−", 'c': 'C', 'C': 'C','x': 'x', '+': '+', '/': '/', '.': '.',
        '=': '=', 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9'
    };
    parseKeypress(keysAllowed[event.key]);
}
function parseKeypress(validation){
    if (validation)
        buttonClicked(validation);
}
function buttonClicked(button){
    if (typeof button === "object")
        button = false;
    var currentButton = button || $(this).text();
    switch(currentButton){
        case "AC":
            clearAll();
            updateDisplay("#output","0");
        case "C":
            clear();
            updateDisplay("#input","0");
            break;
        case "←":
            backspace();
            updateDisplay("#input","input");
            break;
        case "=":
            calculate(currentButton);
            updateDisplay("#output","output");
            updateDisplay("#input","input");
            break;
        case "±":
            togglePlusMinus();
            updateDisplay("#input","input");
            break;
        case ".":
            inputDecimal(currentButton);
            updateDisplay("#input","input");
            break;
        case "+":
        case "−":
        case "x":
        case "/":
            inputOperator(" " + currentButton + " ");
            updateDisplay("#output","output");
            break;
        default:
            inputNumber(currentButton);
            updateDisplay("#input","input");
            break;
    }
}
function updateDisplay(target, text){
    var display = $(target);
    switch(text){
        case "input":
            var string = currentInput.join("");
            break;
        case "output":
            string = savedInputs.join("");
            break;
        default:
            string = text;
            break;
    }
    if(!string){
        string = 0;
    }
    display.text(string);
}

/** *********
 ** ** Computations Logic
 ** ********* **/
function inputNumber(number){
    if (lastButton === "=") {
        savedInputs = [];
    }
    if (currentInput[0] === "0" && currentInput.length === 1 && number === "0") // Prevents leading zeroes
        return;
    if (currentInput[0] === "0" && currentInput.length === 1 ||
        currentInput[0] === "-" && currentInput.length === 2 )
        backspace();
    addToInputArray(number);
    lastButton = number;
}
function inputOperator(operator) {
    if (savedInputs[0] === "Cannot divide by Zero"){
        savedInputs = [];
    }
    if (currentInput.length === 0){
        if ([" / "," x "," + "," − "].indexOf(lastButton)) { // Changing Operation Keys aka 1+-*2
            savedInputs[savedInputs.length - 1] = operator;
        }
        if (lastButton === "=") { // Allows for Operation Rollover/Partial Operand
            lastButton = operator;
            savedInputs[savedInputs.length] = operator;
        }
        return;
    }
    checkDecimals();
    addToInputArray(operator);
    concatInputTil(operator);
    lastButton = operator;
}
function calculate(equalSign, potentialPartialOperand){
    checkDecimals();
    if (currentInput.length === 0) {
        if (savedInputs.length % 2 === 0){ // Partial Operand aka 3*=
            var partialOperand = savedInputs.pop();
            currentInput[currentInput.length] = savedInputs.pop();
            calculate(equalSign, partialOperand);
            return;
        }
        if (typeof savedInputs[0] === "number"){ //Operation Repeat aka 1+1==
            numbersToCalculate[0] = savedInputs[0];
            savedInputs = [];
            savedInputs[0] = do_math(numbersToCalculate);
            return;
        }
        return; // Missing Operands aka ====
    }
    if (savedInputs.length === 0 && !potentialPartialOperand) { // Missing Operation aka 1=
        savedInputs[0] = currentInput.slice(0).join("");
        currentInput = [];
        lastButton = equalSign;
        return;
    }
    addToInputArray(equalSign);
    concatInputTil(equalSign);
    /** *********
     ** ** ORDER OF OPERATIONS (aka PEMDAS) BEGINS HERE
     ** ********* **/
    compute_OOP_with(a_MD_operator); //Computes MD of PEMDAS
    compute_OOP_with(an_AS_operator); //Computes AS of PEMDAS
    function a_MD_operator(inArray){
        return [" / "," x "].indexOf(inArray) > -1;
    }
    function an_AS_operator(inArray){
        return [" + "," − "].indexOf(inArray) > -1;
    }
    function compute_OOP_with(given_operator){
        var operator;
        while(operator = savedInputs.find(given_operator)){
            var indexOfOperator = savedInputs.indexOf(operator);
            if (operator = " / "){ // Prevents Division by Zero
                if (savedInputs[indexOfOperator+1] == 0) {
                    savedInputs = ["Cannot divide by Zero"];
                    return;
                }
            }
            numbersToCalculate = savedInputs.splice(indexOfOperator-1,3);
            var answer = do_math(numbersToCalculate);
            savedInputs.splice(indexOfOperator-1,0,answer);
        }
    }
    // while(operatorIsMD = savedInputs.find(an_MD_operator)){ // Computes Multiplication and Division
    //     var indexOfMD = savedInputs.indexOf(operatorIsMD);
    //     if (operatorIsMD = " / "){ // Prevents Division by Zero
    //         if (savedInputs[indexOfMD+1] == 0) {
    //             savedInputs = ["Cannot divide by Zero"];
    //             return;
    //         }
    //     }
    //     numbersToCalculate = savedInputs.splice(indexOfMD-1,3);
    //     var answer = do_math(numbersToCalculate);
    //     savedInputs.splice(indexOfMD-1,0,answer);
    // }
    // while(savedInputs.length > 3){ //Computes Addition and Subtraction
    //     var operatorIsAS = savedInputs.find(firstASindex);
    //     var indexOfAS = savedInputs.indexOf(operatorIsAS);
    //     numbersToCalculate = savedInputs.splice(indexOfAS-1,3);
    //     answer = do_math(numbersToCalculate);
    //     savedInputs.splice(indexOfAS-1,0,answer);
    // }
    /** *********
     ** ** ORDER OF OPERATIONS ENDS HERE
     ** ********* **/
    lastButton = savedInputs.pop();
    if (potentialPartialOperand){ //Operation Rollover or Partial Operand aka 3+3+=+=
        savedInputs.push(potentialPartialOperand);
        savedInputs[2] = savedInputs[0];
        numbersToCalculate = savedInputs.slice(0);
        savedInputs = [];
        savedInputs[0] = do_math(numbersToCalculate);
    }
    savedInputs[0] = parseFloat(savedInputs[0]);
}
function do_math(array){
    var number1 = parseFloat(array[0]);
    var number2 = parseFloat(array[2]);
    var operator = array[1];
    switch(operator){
        case ' + ':
            return number1 + number2;
        case ' − ':
            return number1 - number2;
        case ' / ':
            return number1 / number2;
        case ' x ':
            return number1 * number2;
        default:
            return "Calculator Error";
    }
}

/** *********
 ** ** Button Inputs
 ** ********* **/
function inputDecimal(decimal) {
    if (currentInput.indexOf(".") > -1) // Multiple Decimals aka 1...1
        return;
    if (currentInput[0] === undefined) {
        addToInputArray("0");
    }
    addToInputArray(decimal);
}
function backspace(){
    if(currentInput.length > 0) {
        currentInput.pop();
    }
    if(currentInput.length === 1 && currentInput[0] === "0" || // Prevents Leading Zero if deleting decimal
        currentInput.length === 1 && currentInput[0] === "-"){ // Prevents [+-] > [.] -> [Bckspc]x2 issues
        currentInput.pop();
    }
}
function clearAll(){
    savedInputs = [];
}
function clear(){
    currentInput = [];
}
function togglePlusMinus(){
    if (currentInput[0] !== "-"){
        if (currentInput[0] === undefined) {
            addToInputArray("0");
        }
        currentInput.unshift("-");
    } else {
        currentInput.shift();
    }
}

/** *********
 ** ** Repeated Functions
 ** ********* **/
function checkDecimals(){
    var decimal = currentInput.indexOf(".");
    if (decimal > -1) {
        while (currentInput[currentInput.length - 1] === "0") { // Prevents trailing zeroes
            currentInput.pop();
        }
        if (currentInput[currentInput.length-1] === ".") { // Prevents unnecessary decimals
            currentInput.pop();
        }
    }
}
function addToInputArray(keyPressed){
    currentInput.push("");
    currentInput[currentInput.length-1] += keyPressed;
    return currentInput[currentInput.length-1];
}
function concatInputTil(operator){
    var numbersAsOneString = currentInput.slice(0,-1).join("");
    currentInput = [];
    savedInputs.push(numbersAsOneString,operator);
}