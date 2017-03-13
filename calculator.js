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
    if (event.which === 8) //backspace
        buttonClicked("←");
    if (event.which === 27) //escape
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
    if(!string){
        string = 0;
    }
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
function backspace(){
    console.log("backspace pressed",currentInput);
    if(currentInput.length > 0) {
        currentInput.pop();
    }
    if(currentInput.length === 1 && currentInput[0] === "0") {
        currentInput.pop();
    }
    log(currentInput);
}
function calculate(equalSign, potentialPartialOperand){
    console.log("= pressed =======================");
    if (currentInput.length === 0) {
        console.log("current input empty! special cases!");
//        if (!isNaOperator(lastButton)) { //1+=
            if (savedInputs.length % 2 === 0){
                console.log("last button was operator.  partial operand");
                var partialOperand = savedInputs.pop();
                currentInput[currentInput.length] = savedInputs.pop();
                log(savedInputs, "took out last operator...");
                log(currentInput, "...added to current input");
                console.log("lets rewind time a bit.");
                calculate(equalSign, partialOperand);
                console.log("operation rollover complete");
                return;
            }
//            savedInputs[2] = savedInputs[0];
//            numbersToCalculate = savedInputs.slice(0);
//            savedInputs = [];
//            savedInputs[0] = do_math(numbersToCalculate);
//            lastButton = equalSign;
//            log(savedInputs, "partial operand");
//            return;
//        }
        if (typeof savedInputs[0] === "number"){ //1+1==
            console.log("repeating; previous calculation was found.");
            console.log("last operation was " + numbersToCalculate.join(""));
            numbersToCalculate[0] = savedInputs[0];
            console.log("but we doing " + numbersToCalculate.join(""));
            savedInputs = [];
            savedInputs[0] = do_math(numbersToCalculate);
            log(savedInputs, "Repeated our savedinputs");
            return;
        }
        console.log("no previous calculation. ending function.");
        return; //prevents input if nothing is present
    }
    if (savedInputs.length === 0 && !potentialPartialOperand) { // 1=
        console.log("length is 1, not a number.  first input?");
        savedInputs[0] = currentInput[0];
        currentInput = [];
        lastButton = equalSign;
        log(currentInput, "current");
        log(savedInputs, "saved");
        console.log("added to array as string to prevent future repeat");
        return;
    }
    addToInputArray(equalSign);
    concatInputTil(equalSign);
    log(currentInput);
    log(savedInputs, "savedInputs");

    while(savedInputsHaveMD() != undefined){ //does */ first
        var operatorIsMD = savedInputsHaveMD();
        var indexOfMD = savedInputs.indexOf(operatorIsMD);
        if (operatorIsMD = " / "){
            if (savedInputs[indexOfMD+1] == 0) {
                savedInputs = ["Cannot divide by Zero"];
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
        var operatorIsAS = savedInputs.find(firstASindex);
        numbersToCalculate = savedInputs.splice(operatorIsAS-1,3);
        var answer = do_math(numbersToCalculate);
        savedInputs.splice(operatorIsAS-1,0,answer);
        log(savedInputs,"savedInputs")
    }
    log(savedInputs, "all math complete");
    if (savedInputs[1] === "="){
        log(savedInputs, "equals sign is second item.  we're done?");
        lastButton = savedInputs.pop();
        if (potentialPartialOperand){
            console.log("not done, operation rollover");
            savedInputs.push(potentialPartialOperand);
            //added below
            savedInputs[2] = savedInputs[0];
            numbersToCalculate = savedInputs.slice(0);
            savedInputs = [];
            savedInputs[0] = do_math(numbersToCalculate);
            // return;
            //added above
//            calculate(equalSign);
        }
        savedInputs[0] = parseFloat(savedInputs[0]);
        log(currentInput);
        log(savedInputs, "saved inputs");
    }
}
function inputDecimal(decimal) {
    if (currentInput.indexOf(".") > -1) // prevents decimals being added if it already exists
        return;
    if (currentInput[0] === undefined) {
        addToInputArray("0");
    }
    addToInputArray(decimal);
    log(currentInput);
}
function inputNumber(number){
    if (lastButton === "=") {
        console.log("last button was =, so preventing concatenation by wiping saved array");
        savedInputs = [];
    }
    if (currentInput[0] === "0" && currentInput.length === 1 && number === "0") //prevents leading zeroes
        return;
    addToInputArray(number);
    lastButton = number;
    log(currentInput);
}
function inputOperator(operator) {
    if (savedInputs[0] === "Cannot divide by Zero"){
        savedInputs = [];
    }
    console.log(operator + " clicked           " + operator + "       " + operator);
    if (currentInput.length === 0){
        log(currentInput, "no current inputs");
        if (!isNaOperator(lastButton)) { //1+-
            console.log("...but second operator pressed. overriding " + lastButton);
            savedInputs[savedInputs.length - 1] = operator;
            log(savedInputs, "saved inputs");
        }
        if (lastButton === "=") { // 1+1=+
            console.log("...equal sign present. partial operand or rollover?");
            lastButton = operator;
            savedInputs[savedInputs.length] = operator;
            log(savedInputs, "saved inputs");
            // return;
        }
        // if (savedInputs.length === 1){ //deprecated?
        //     if (typeof savedInputs[0] === "string") {
        //         console.log("..but we have a saved input? lets use that. as a string.");
        //         currentInput[0] = savedInputs.pop();
        //         inputOperator(operator);
        //         return;
        //     } else {
        //         log(currentInput, "potential partial operand. readding back operator");
        //         savedInputs.push(operator);
        //         lastButton = operator;
        //         log(savedInputs, "operator added");
        //         return;
        //     }
        // }
        console.log("we good");
        return;
    }
    if (isNaOperator(lastButton)) { //if last button is NaOP, could be =, add op, concat til op
        console.log("first operator pressed");
        var decimal = currentInput.indexOf(".");
        if (decimal > -1) {
            while (currentInput[currentInput.length - 1] === "0") {
                currentInput.pop();
            }
            if (currentInput[currentInput.length-1] === ".") {
                currentInput.pop();
            }
        }
        addToInputArray(operator);
        concatInputTil(operator);
        lastButton = operator;
        log(currentInput);
        log(savedInputs, "savedInputs");
    }
}
function addToInputArray(keyPressed){
    currentInput.push("");
    currentInput[currentInput.length-1] += keyPressed;
    return currentInput[currentInput.length-1];
}
function concatInputTil(operator){
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
function changeSign(pos){
    return pos = !pos;
}
function plusMinus(){
    positive = changeSign(positive);
    toggleNegative();
}
function toggleNegative(){
    currentInput.unshift("-")
}
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
function lastInput (){
    return currentInput[currentInput.length-1] === undefined ?
        savedInputs[savedInputs.length-1] :
        currentInput[currentInput.length-1];
}