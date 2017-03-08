$(document).ready(function () {
    applyClickHandlers();
});

var currentInput = [];
var savedInputs = [];
var lastButton = null;
var inputHistory = [];
var currentButton = null;
var answerArray = [];
var positive = true;


function applyClickHandlers(){
    $('#calculator').on('click','.button',buttonPressed)
}

function buttonPressed(){
    currentButton = $(this).text();
    switch(currentButton){
        case "AC":
            clearAll(currentButton);
            break;
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
            break;
        default:
            inputNumber(currentButton);
            break;
    }
}
function clearAll(){
    currentInput = [];
    savedInputs = [];
    log(currentInput);
    log(savedInputs, "saved input");
}
function log(array, string){
    if(!string) string = "current";
    console.log(array, array.length - 1, string);
}
function clear(){
    currentInput = [];
    log(currentInput);
}
function backspace(backspc){
    console.log(currentInput[currentInput.length-1]);
    if(isNaOperator(currentInput[currentInput.length-1]))
        currentInput.pop();
    log(currentInput);
}
function calculate(equalSign){
    currentInput.push("");
    addToInputArray(equalSign);
    concatInputTil(equalSign);
    log(currentInput);
    log(savedInputs, "savedInputs");

    while(savedInputs.find(firstMDindex) != undefined){
        var indexOfMD = savedInputs.find(firstMDindex);
        var intermediateMD = do_math(savedInputs.splice(indexOfMD-1,3));
        savedInputs.splice(indexOfMD-1,0,intermediateMD);
        log(savedInputs,"savedInputs")
    }
    while(!isNaN(savedInputs[2])){
        var index = savedInputs.find(firstASindex);
        var answer = do_math(savedInputs.splice(index-1,3));
        savedInputs.splice(index-1,0,answer);
        log(savedInputs,"savedInputs")
    }
    log(currentInput);
    log(savedInputs, "saved");


    // var basicBitchWay = function() {
    //     currentInput.pop();
    //     var tempString = currentInput.join("");
    //     var tempArray = tempString.split("");
    //     var operatorsIndex = tempArray.find(anyOperatorIndex);
    //     var answerString = tempArray.join("");
    //     var twoNums = answerString.split(operatorsIndex);
    //     var answer = do_math(twoNums[0], operatorsIndex, twoNums[1]);
    //     console.log(answer);
    //     return answer;
    // };
    // basicBitchWay();
}
function inputDecimal(decimal){
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
    if (currentInput[currentInput.length-1] === "=")
        currentInput = [];
    if (isNaN(currentInput[currentInput.length]))
        currentInput.push("");
    addToInputArray(number);
    lastButton = number;
    log(currentInput);
}
function inputOperator(operator){
    if (currentInput.length === 0)
        return;
    if (isNaOperator(lastButton)) { //add op, concat til op
        console.log("first operator pressed");
        currentInput.push("");
        addToInputArray(operator);
        concatInputTil(operator);
    } else { //was an operator.  should replace last value
        console.log("operator already present.  replacing operators");
        currentInput[currentInput.length-1] = operator;
    }
    lastButton = operator;
    log(currentInput);
    log(savedInputs, "savedInputs");
}
function concatInput(){
    var tempString = currentInput.join("");

}
function concatInputTil(operator){
    var opIndex = currentInput.lastIndexOf(operator);
    var tempNumbersAsString = currentInput.splice(0,opIndex).join("");
    currentInput = [];
    savedInputs.push(tempNumbersAsString,operator);
}
function addToInputArray(keyPressed){
    currentInput[currentInput.length-1] += keyPressed;
    return currentInput[currentInput.length-1];
}
function addToAnswerArray(removedValues){
    answerArray[answerArray.length-1] += removedValues;
    return answerArray[answerArray.length-1];
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
            break;
        default:
            console.log("Please specify: (a number, a number, an operator).");
            return "Thank you.";
    }
}
function addToHistory(currentButt) {
    inputHistory.push(currentButt);
    return inputHistory[inputHistory.length - 1]
}
function setLastInputTo(button){
    if (inputHistory.length > 0) {
        lastButton = inputHistory[inputHistory.length - 1];
    } else {
        lastButton = currentButton;
    }
    console.log(lastButton);
    return lastButton;
}
function firstMDindex(inArray){
    return ["*","/"].indexOf(inArray) > -1;
}
function firstASindex(inArray){
    return ["+","-"].indexOf(inArray) > -1;
}
function anyOperatorIndex(inArray){
    return ["+","-","*","/"].indexOf(inArray) > -1;
}
function changeBoolean(pos){
    return pos = !pos;
}