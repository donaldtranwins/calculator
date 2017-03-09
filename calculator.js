$(document).ready(function () {
    applyClickHandlers();
});

var currentInput = [];
var savedInputs = [];
var lastButton = null;
var currentButton = null;
var positive = true;


function applyClickHandlers(){
    $('#calculator').on('click','.button',buttonPressed)
}

function buttonPressed(){
    currentButton = $(this).text();
    switch(currentButton){
        case "AC":
            clearAll(currentButton);
            display("#output","0");
        case "CE":
            clear(currentButton);
            display("#input","0");
            break;
        case "←":
            backspace(currentButton);
            break;
        case "=":
            calculate(currentButton);
            display("#output","output");
            display("#input","input");
            break;
        case "±":
            positive = changeBoolean(positive);
            break;
        case ".":
            inputDecimal(currentButton);
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            inputOperator(currentButton);
            display("#output","output");
            break;
        default:
            inputNumber(currentButton);
            display("#input","input");
            break;
    }
}
function display(target, text){
    var show = $(target);
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
    if(!string) string = 0;
    show.text(string);
}
function clearAll(){
    savedInputs = [];
    log(savedInputs, "saved input");
}
function clear(){
    currentInput = [];
    log(currentInput);
}
function log(array, string){
    if(!string) string = "current";
    if(!Array.isArray(array))
        console.log(array);
    console.log(array, lastInput(), string);
}
function backspace(backspc){
    console.log(currentInput[currentInput.length-1]);
    if(isNaOperator(currentInput[currentInput.length-1]))
        currentInput.pop();
    log(currentInput);
}
function calculate(equalSign){
    // if (savedInputs[1] === "="){
    //     var operatorToRepeat = currentInput.find(lastOperator);
    //     var
    // }

    currentInput.push("");
    addToInputArray(equalSign);
    concatInputTil(equalSign);
    log(currentInput);
    log(savedInputs, "savedInputs");

    while(savedInputsHaveMD() != undefined){ //does */ first
        var operatorMD = savedInputsHaveMD();
        var indexOfMD = savedInputs.indexOf(operatorMD);
        if (operatorMD = "/"){
            if (savedInputs[indexOfMD+1] == 0) {
                savedInputs = ["Cannot divide by Zero"];
                // display("#output", "Cannot Divide by Zero");
                return;
            }
        }
        var numbersToCalculate = savedInputs.splice(indexOfMD-1,3);
        var tempMD = do_math(numbersToCalculate);
        savedInputs.splice(indexOfMD-1,0,tempMD);
        log(savedInputs,"savedInputs")
    }

    while(savedInputs.length > 2){ //does +- next
        var operatorAS = savedInputs.find(firstASindex);
        var answer = do_math(savedInputs.splice(operatorAS-1,3));
        savedInputs.splice(operatorAS-1,0,answer);
        log(savedInputs,"savedInputs")
    }
    lastButton = savedInputs.pop();
    log(currentInput);
    log(savedInputs, "saved");

    //remember not to divide by zero
}
function inputDecimal(decimal){
    if (!currentInput.indexOf(".")){
        currentInput.push("");
    }
}
function isNaOperator(lastButton){
    switch(lastButton){
        case "+":
        case "-":
        case "*":
        case "/":
            return false;
        default:
            return true;
    }
}
function inputNumber(number){
    if (lastButton === "=")
        savedInputs = [];
    if (isNaN(currentInput[currentInput.length]))
        currentInput.push("");
    addToInputArray(number);
    lastButton = number;
    log(currentInput);
}
function inputOperator(operator) {
    if (lastButton === "=") { //last button pressed was =
        console.log("equal sign present, are we rolling over?");
        lastButton = operator;
        savedInputs[savedInputs.length] = operator;
    }
    // var checkLast = savedInputs[savedInputs.length - 1];
    if (!isNaOperator(lastButton) && currentInput.length == 0) { //prevents successive op inputs
        console.log("second operator pressed, overriding " + lastButton);
        savedInputs[savedInputs.length - 1] = operator;
    }
    if (currentInput.length === 0) //prevents operator when nothing to compute
        return; //this check needs to happen AFTER equal check
    if (isNaOperator(lastButton)) { //if last button is NaOP, could be =, add op, concat til op
        console.log("first operator pressed");
        currentInput.push("");
        addToInputArray(operator);
        concatInputTil(operator);
        lastButton = operator;
        log(currentInput);
        log(savedInputs, "savedInputs");
    }
}
function addToInputArray(keyPressed){
    //currentInput[currentInput.length-1] = currentInput[currentInput.length-1] || 20
    currentInput[currentInput.length-1] += keyPressed;
    return currentInput[currentInput.length-1];
}
function concatInputTil(operator){
    var opIndex = currentInput.lastIndexOf(operator);
    var tempNumbersAsString = currentInput.splice(0,opIndex).join("");
    currentInput = [];
    savedInputs.push(tempNumbersAsString,operator);
}
function do_math(num1, operator, num2){
    if(Array.isArray(num1)){
        var number1 = parseFloat(num1[0]);
        var number2 = parseFloat(num1[2]);
        switch(num1[1]){
            case '+':
                return number1 + number2;
            case '-':
                return number1 - number2;
            case '/':
                return number1 / number2;
            case '*':
            case 'x':
            case 'X':
                return number1 * number2;
            case '=':
                console.log("woah an equals. figure logic later");
                break;
            default:
                console.log(num1, "error: num1 is in this format");
                return "Thank you.";
        }
    }
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    switch(operator){
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '/':
            return num1 / num2;
        case '*':
        case 'x':
        case 'X':
            return num1 * num2;
        case '=':
            console.log("woah an equals. figure logic later");
            return "woah equals";
            break;
        default:
            console.log("Please specify: (a number, a number, an operator).");
            return "woah default";
            break;
    }
}
var operatorLookup = ["+","-","*","/"];

function savedInputsHaveMD(){
    return savedInputs.find(firstMD);
}
function firstMD(inArray){
    return ["*","/"].indexOf(inArray) > -1;
}
function firstASindex(inArray){
    return ["+","-"].indexOf(inArray) > -1;
}
function lastOperator(inArray){ //.find(lastOperator(inArray), returns +-*/
    return ["+","-","*","/"].indexOf(inArray) > -1;
}
function changeBoolean(pos){
    return pos = !pos;
}
function lastInput (){
    return currentInput[currentInput.length-1] === undefined ?
        savedInputs[savedInputs.length-1] :
        currentInput[currentInput.length-1];
}