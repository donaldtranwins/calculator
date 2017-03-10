$(document).ready(function () {
    applyClickHandlers();
});

var currentInput = [];
var savedInputs = [];
var lastButton = null;
var numbersToCalculate = null;
var positive = true;


function applyClickHandlers(){
    $('#calculator').on('click','.button',buttonPressed)
}

function buttonPressed(){
    var currentButton = $(this).text();
    switch(currentButton){
        case "AC":
            clearAll();
            display("#output","0");
        case "CE":
            clearEntry();
            display("#input","0");
            break;
        case "←":
            backspace();
            display("#input","input");
            break;
        case "=":
            calculate(currentButton);
            display("#output","output");
            display("#input","input");
            break;
        case "±":
            plusMinus();
            break;
        case ".":
            inputDecimal(currentButton);
            display("#input","input");
            break;
        case "+":
        case "-":
        case "/":
            inputOperator(currentButton);
            display("#output","output");
            break;
        case "x":
            inputOperator("*");
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
    log(savedInputs, "memory cleared");
}
function clearEntry(){
    currentInput = [];
    log(currentInput, "inputs cleared");
}
function log(array, string){
    if(!string) string = "current";
    if(!Array.isArray(array))
        console.log(array);
    console.log(array, lastInput(), string);
}
function plusMinus(){
    changeBoolean(positive);
}
function backspace(){
    console.log("backspace pressed",currentInput);
    if(currentInput.length > 0)
        currentInput.pop();
    log(currentInput);
}
function calculate(equalSign){
    // if (savedInputs[1] === "="){
    //     var operatorToRepeat = currentInput.find(lastOperator);
    //     var
    // }
    if (currentInput.length === 0) {
        if (savedInputs.length === 1 && typeof currentInput[0] === "number"){
            console.log("length is 1, typeof is number.  we want to repeat.");
            numbersToCalculate[0] = currentInput[0];
            answer = do_math(numbersToCalculate);
            return answer;
        }
        console.log("not a number");
        return; //prevents input if nothing is present
    }
    if (currentInput.length === 1) {
        if (savedInputs.length === 0) { //matters for repeat
            console.log("length is 1, not a number.  first input?");
            savedInputs[0] = currentInput[0];
            currentInput = [];
            log(currentInput, "current");
            log(savedInputs, "saved");
            console.log("added to array as string to prevent repeat");
            return;
        }
    }
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
        numbersToCalculate = savedInputs.splice(indexOfMD-1,3);
        var tempMD = do_math(numbersToCalculate);
        savedInputs.splice(indexOfMD-1,0,tempMD);
        log(savedInputs,"savedInputs")
    }
    console.log("MD complete, now AS, ", savedInputs);
    while(savedInputs.length > 3){ //does +- next
        var operatorAS = savedInputs.find(firstASindex);
        numbersToCalculate = savedInputs.splice(operatorAS-1,3);
        var answer = do_math(numbersToCalculate);
        savedInputs.splice(operatorAS-1,0,answer);
        log(savedInputs,"savedInputs")
    }
    console.log("all math complete, ", savedInputs);
    if (savedInputs.length === 3){
        log(savedInputs, "we should rollover now, length is 2(+1)")
    }

    if (savedInputs.length === 2){
        log(savedInputs, "length is 2. we done?");
        savedInputs[0] = parseFloat(savedInputs[0]);
    }
    lastButton = savedInputs.pop();
    log(currentInput);
    log(savedInputs, "saved inputs");

    //remember not to divide by zero
}
function inputDecimal(decimal){
    if (currentInput.indexOf(".") > -1)
        return;
    currentInput.push("");
    addToInputArray(decimal);
    log(currentInput);
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
    // if (lastButton === "=")
    //     savedInputs = [];
    if (typeof savedInputs[0] === "number")
        savedInputs = [];
    if (isNaN(currentInput[currentInput.length]))
        currentInput.push("");
    addToInputArray(number);
    lastButton = number;
    log(currentInput);
}
function inputOperator(operator) {
    console.log(operator + " clicked");
    if (currentInput.length === 0){
        log(currentInput, "no current inputs");
        if (!isNaOperator(lastButton)) { //prevents successive op inputs
            console.log("...but second operator pressed, overriding " + lastButton);
            savedInputs[savedInputs.length - 1] = operator;
            log(savedInputs, "saved inputs");
        }
        if (lastButton === "=") { //last button pressed was =
            console.log("equal sign present, need to roll over but need to write the function..");
            lastButton = operator;
            savedInputs[savedInputs.length] = operator;
            log(savedInputs, "saved inputs");
        }
        console.log("we good");
        return;
    }
    // var checkLast = savedInputs[savedInputs.length - 1];
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
// var operatorLookup = {
//     "+": function(num1, num2){
//         return num1 + num2;
//     },
//     "-": function(num1, num2){
//         return num1 - num2;
//     },
//     "/": function(num1, num2){
//         return num1 / num2;
//     },
//     "x": function(num1, num2){
//         return num1 * num2;
//     },
//     "X": this.x,
//     "*": this['x']
// };
//return operatorLookup[operator](num1, num2);

function savedInputsHaveMD(){
    return savedInputs.find(firstMD);
}
function firstMD(inArray){
    return ["*","/"].indexOf(inArray) > -1;
}
function firstASindex(inArray){
    return ["+","-"].indexOf(inArray) > -1;
}
function lastOperatorIn(array){ //.find(lastOperatorIn(array), returns +-*/
    return ["+","-","*","/"].indexOf(array) > -1;
}
function changeBoolean(pos){
    return pos = !pos;
}
function lastInput (){
    return currentInput[currentInput.length-1] === undefined ?
        savedInputs[savedInputs.length-1] :
        currentInput[currentInput.length-1];
}