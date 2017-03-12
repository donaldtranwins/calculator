$(document).ready(function () {
    applyHandlers();
});

var currentInput = [];
var savedInputs = [];
var lastButton = null;
var numbersToCalculate = null;
var positive = true;

function applyHandlers(){
    $('#calculator').on('click','.button div',buttonClicked);
    $(document).on('keypress',validateKeypress);
    $(document).on('keydown',validateKeydown);
}
function validateKeydown() {
    if (event.which === 8)
        buttonClicked("←");
    if (event.which === 27)
        buttonClicked("AC");
}
// var keys = {
//     '=': '=', '+': ' + ', '-': " − ", 'x': ' x ', '/': ' / ', '.': '.', 'c': 'C', 'C': 'C',
//     0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9'
// };
// keycode refs:       =   *   +   -   .   /   0   1   2   3   4   5   6   7   8   9   C   c    x   \
// var keysToAllow = [13, 42, 43, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 67, 99, 120, 92];
// console.log(keys.indexOf(event.which));
// if(keys.indexOf(event.which) !== -1)
//     parseKeypress(event.which);
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
    //change this to multiple handlers
    switch(currentButton){
        case "AC":
            clearAll();
            display("#output","0");
        case "C":
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
        case "−":
        case "x":
        case "/":
            inputOperator(" " + currentButton + " ");
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
    if (currentInput.length === 0) {
        console.log("nothing in our current input! special cases");
        // if (savedInputs.length === 1 && typeof currentInput[0] === "number"){
        if (!isNaOperator(lastButton)) {
            log(savedInputs, "last button was operator.  rollover boy!");
            savedInputs[2] = savedInputs[0];
            numbersToCalculate = savedInputs.splice(0,3);
            savedInputs[0] = do_math(numbersToCalculate);
            log(savedInputs, "Rollover ed our savedinputs");
            return;
        }
        console.log("no current input. but savedinput[0] is NaNumber");
        if (typeof savedInputs[0] === "number"){
            console.log("length is 1, typeof is number.  we want to repeat last operation.");
            numbersToCalculate[0] = savedInputs[0];
            savedInputs = [];
            savedInputs[0] = do_math(numbersToCalculate);
            log(savedInputs, "Repeated our savedinputs");
            return savedInputs;
        }
        return; //prevents input if nothing is present
    }
    if (currentInput.length === 1) {
        if (savedInputs.length === 0) { //matters for repeat
            console.log("length is 1, not a number.  first input?");
            savedInputs[0] = currentInput[0];
            currentInput = [];
            lastButton = equalSign;
            log(currentInput, "current");
            log(savedInputs, "saved");
            console.log("added to array as string to prevent repeat");
            return;
        }
        // if (savedInputs.length === 2) { //matters for partial operand
        //     console.log("operation rollover? partial operand? one of the two.");
        //     savedInputs[2] = savedInputs[0];
        // }
    }
    currentInput.push("");
    addToInputArray(equalSign);
    concatInputTil(equalSign);
    log(currentInput);
    log(savedInputs, "savedInputs");

    while(savedInputsHaveMD() != undefined){ //does */ first
        var operatorMD = savedInputsHaveMD();
        var indexOfMD = savedInputs.indexOf(operatorMD);
        if (operatorMD = " / "){
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
    log(savedInputs, "MD complete, now AS");
    while(savedInputs.length > 3){ //does +- next
        var operatorAS = savedInputs.find(firstASindex);
        numbersToCalculate = savedInputs.splice(operatorAS-1,3);
        var answer = do_math(numbersToCalculate);
        savedInputs.splice(operatorAS-1,0,answer);
        log(savedInputs,"savedInputs")
    }
    log(savedInputs, "all math complete");
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
        case " + ":
        case " − ":
        case " x ":
        case " / ":
            return false;
        default:
            return true;
    }
}
function inputNumber(number){
    if (lastButton === "=") {
        console.log("last button was = so preventing concatenation by wiping saved array.");
        savedInputs = [];
    }
    if (typeof savedInputs[0] === "number" && savedInputs.length !== 2)
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
        if (lastButton === "=") { //last button pressed was =
            console.log("...equal sign present. partial operand or rollover?");
            lastButton = operator;
            savedInputs[savedInputs.length] = operator;
            log(savedInputs, "saved inputs");
            return;
        }
        if (savedInputs.length === 1){
            console.log("..but we have a saved input? lets use that. as a string.");
            currentInput[0] = savedInputs.pop();
            inputOperator(operator);
            return;
        }
        if (!isNaOperator(lastButton)) { //prevents successive op inputs
            console.log("...but second operator pressed. overriding " + lastButton);
            savedInputs[savedInputs.length - 1] = operator;
            log(savedInputs, "saved inputs");
        }
        console.log("we good");
        return;
    }
    // var checkLast = savedInputs[savedInputs.length - 1];
    if (isNaOperator(lastButton)) { //if last button is NaOP, could be =, add op, concat til op
        console.log("first operator pressed");
        if (currentInput[currentInput.length-1] === ".") {
            currentInput.pop();
        }
            // ASKJDH do no leading zeros and ending zeros
        currentInput.push("");
        addToInputArray(operator);
        concatInputTil(operator);
        lastButton = operator;
        log(currentInput);
        log(savedInputs, "savedInputs");
    }
}
function addToInputArray(keyPressed){
    currentInput[currentInput.length-1] += keyPressed;
    return currentInput[currentInput.length-1];
}
function concatInputTil(operator){
    log(currentInput, "running new concat until");
    var tempNumbersAsString = currentInput.slice(0,-1).join("");
    currentInput = [];
    savedInputs.push(tempNumbersAsString,operator);
}
function do_math(num1, op, num2){
    if(Array.isArray(num1)){
        console.log('array passed in');
        var number1 = parseFloat(num1[0]);
        var number2 = parseFloat(num1[2]);
        var operator = num1[1];
        } else {
        console.log('num1,op,num2 passed in');
        operator = op;
        number1 = parseFloat(num1);
        number2 = parseFloat(num2);
    }
    switch(operator){
        case ' + ':
            return number1 + number2;
        case ' − ':
            return number1 - number2;
        case ' / ':
            return number1 / number2;
        case ' x ':
            return number1 * number2;
        case ' = ':
            console.log("wtf you messed up");
            return "= in pos2?";
        default:
            console.log("error: num1 = " + num1);
            return "defaulted. bug";
    }
}
// objectLookup table
// var operatorLookup = {
//     "+": function(num1, num2){
//         return num1 + num2;
//     },
//     "−": function(num1, num2){
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
    return [" / "," x "].indexOf(inArray) > -1;
}
function firstASindex(inArray){
    return [" + "," − "].indexOf(inArray) > -1;
}
function lastOperatorIn(array){ //.find(lastOperatorIn(array), returns +-*/
    return [" + "," − "," x "," / "].indexOf(array) > -1;
}
function changeBoolean(pos){
    return pos = !pos;
}
function lastInput (){
    return currentInput[currentInput.length-1] === undefined ?
        savedInputs[savedInputs.length-1] :
        currentInput[currentInput.length-1];
}