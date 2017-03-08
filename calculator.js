$(document).ready(function () {
    applyClickHandlers();
});

var inputArray = [];
var lastButton = null;
var currentButton = null;
var answerArray = [];

function applyClickHandlers(){
    $('#calculator').on('click','.button',buttonPressed)
}

function buttonPressed(){
    currentButton = $(this).text();
    switch(currentButton){
        case "AC":
        case "CE":
            clear(currentButton);
            break;
        case "←":
            backspace(currentButton);
            break;
        case "=":
            calculate(currentButton);
            break;
        case "±":
            changeSign(currentButton);
            break;
        case ".":
            inputDecimal(currentButton);
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            inputOperator(currentButton);
            break;
        default:
            inputNumber(currentButton);
            break;
    }
}

function clear(){
}
function backspace(){
}
function changeSign(){
}
function calculate(equals){
    inputArray.push("");
    addToInputArray(equals);
    concatInputTil(equals);
    inputArray.pop();
    console.log(inputArray, inputArray.length - 1);
    var tempString = inputArray.join("");
    var tempArray = tempString.split("");
    var operator = tempArray.find(theOperator);
    var answerString = tempArray.join("");
    var twoNums = answerString.split(operator);
    var answer = do_math(twoNums[0],twoNums[1],operator);
    console.log(answer);
    return answer;
}
function inputDecimal(decimal){
}
function compareOperatorTo(lastButton){
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
    if (isNaN(inputArray[inputArray.length]))
        inputArray.push("");
    addToInputArray(number);
    lastButton = number;
    console.log(inputArray, inputArray.length-1);
}
function inputOperator(operator){
    if (inputArray.length === 0)
        return;
    if (compareOperatorTo(lastButton)) { //add op, concat til op
        console.log("first operator pressed");
        inputArray.push("");
        addToInputArray(operator);
        concatInputTil(operator);
    } else { //was an operator.  should replace last value
        console.log("operator already present.  replacing operators");
        inputArray[inputArray.length-1] = operator;
    }
    lastButton = operator;
    console.log(inputArray, inputArray.length - 1);
}
function concatInput(){
    var tempString = inputArray.join("");

}
function concatInputTil(index){
    var opIndex = inputArray.lastIndexOf(index);
    var tempNumbersAsArray = inputArray.splice(0,opIndex);
    var tempNumbersAsString = tempNumbersAsArray.join("");
    inputArray.unshift(tempNumbersAsString);
}
function addToInputArray(keyPressed){
    inputArray[inputArray.length-1] += keyPressed;
    return inputArray[inputArray.length-1];
}
function addToAnswerArray(removedValues){
    answerArray[answerArray.length-1] += removedValues;
    return answerArray[answerArray.length-1];
}
function do_math(num1, num2, operator){
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
        default:
            console.log("Please specify: (a number, a number, an operator).");
            return "Thank you.";
    }
}
function firstOperator(){
    inputArray.find(theOperator());
}
function theOperator(inputArrayIndex){
    return ["+","-","*","/"].indexOf(inputArrayIndex) > -1;
}