



function allowEnterKey() {
    if (event.keyCode === 13) doInputField();
}
$(document).ready(function () {
    $('#inputField').keypress(allowEnterKey);
});