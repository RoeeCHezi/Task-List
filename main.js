let currentNoteID = "note1";
let currentNoteIDNumber = 1;

let notesMap = new Map();
loadNotesMapFromLocalStorage();
loadCurrentNoteIDNumberFromLocalStorage();
updateNoteID();
displayNotesToScreen();

//Checks for Errors in entry fields//
function validateFields(textElement, dateElement, timeElement) {

    let errorParagraphElement = document.getElementById("errors-paragraph");
    if (errorParagraphElement != null) {
        errorParagraphElement.remove();
    }

    textElement.style.borderColor = "";
    dateElement.style.borderColor = "";
    timeElement.style.borderColor = "";

    let errorMessage = '';
    if (textElement.value.trim() == '') {
        textElement.style.borderColor = "red";
        errorMessage = errorMessage + "Text input is empty!<br><br>";
    }

    if (dateElement.value == '') {
        dateElement.style.borderColor = "red";
        errorMessage = errorMessage + "Date input is empty!<br><br>";
    }

    if (timeElement.value == '') {
        timeElement.style.borderColor = "red";
        errorMessage = errorMessage + "Time input is empty!";
    }

    if (errorMessage != '')
        throw new Error(errorMessage);
}

//Saves entered notes to map//
function saveNoteToMap(note) {
    notesMap.set(currentNoteID, note);
}

//Saves map to Local Storage//
function saveMapToLocalStorage() {
    let strNotesMap = JSON.stringify(Array.from(notesMap.entries()));
    localStorage.setItem("notesMap", strNotesMap);
}

//Saves entered info to note once saved//
function onSaveClick() {
    let textElement = document.getElementById("task-log");
    let dateElement = document.getElementById("date-log");
    let timeElement = document.getElementById("time-log");

    try {
        validateFields(textElement, dateElement, timeElement);

        let note = {
            text: textElement.value,
            date: dateElement.value,
            time: timeElement.value,
        }
        saveNoteToMap(note);
        saveMapToLocalStorage();
        addNoteToScreen(currentNoteID, note);
        currentNoteIDNumber++;
        updateNoteID();
        saveCurrentNoteIDNumberToLocalStorage()
    }

    catch (e) {
        console.log(e);
        printErrorsOnScreen(e.message);
    }
}

//Updates noteID on each new note//
function updateNoteID() {
    currentNoteID = "note" + currentNoteIDNumber;
}

//Clears all input boxes//
function onResetClick() {
    let dateElement = document.getElementById("date-log");
    let textElement = document.getElementById("task-log");
    let timeElement = document.getElementById("time-log");
    let errorBoxElement = document.getElementById("errors-paragraph");

    textElement.style.borderColor = "black";
    dateElement.style.borderColor = "black";
    timeElement.style.borderColor = "black";
    errorBoxElement.remove();
}

//Prints current input boxes errors to screen//
function printErrorsOnScreen(errorMessage) {
    let errorParagraphElement = document.createElement("p");
    errorParagraphElement.setAttribute("id", "errors-paragraph");
    errorParagraphElement.innerHTML = errorMessage;

    let errorDivElement = document.getElementById("errors");
    errorDivElement.append(errorParagraphElement)
}

//Takes entered info and prints note to screen once saved//
function addNoteToScreen(noteDivId, note) {
    let noteDivElement = document.createElement("div");
    noteDivElement.setAttribute("class", "note");
    noteDivElement.setAttribute("id", noteDivId);

    let noteImgElement = document.createElement("img");
    noteImgElement.setAttribute("class", "redcard")
    noteImgElement.setAttribute("src", "redcard.png");

    let noteTextElement = document.createElement("p")
    noteTextElement.setAttribute("class", "note-task");
    noteTextElement.innerHTML = note.text;

    let noteDateElement = document.createElement("p");
    noteDateElement.setAttribute("class", "note-date");
    noteDateElement.innerHTML = note.date;

    let noteTimeElement = document.createElement("p");
    noteTimeElement.setAttribute("class", "note-time");
    noteTimeElement.innerHTML = note.time;

    let noteButtonElement = document.createElement("button");
    noteButtonElement.setAttribute("class", "erase-button");
    noteButtonElement.setAttribute("onclick", "onDeleteNoteClicked(this)");

    let noteIconElement = document.createElement("span");
    noteIconElement.setAttribute("class", "erase-icon");
    noteIconElement.innerHTML = "X";
    noteButtonElement.append(noteIconElement);

    noteDivElement.append(noteImgElement);
    noteDivElement.append(noteTextElement);
    noteDivElement.append(noteDateElement);
    noteDivElement.append(noteTimeElement);
    noteDivElement.append(noteButtonElement);
    

    let notesElement = document.getElementById("notes");
    notesElement.append(noteDivElement);
}

//Loads saved info from Local Storage//
function loadNotesMapFromLocalStorage() {
    let strNotesMap = localStorage.getItem("notesMap");
    if(strNotesMap != null){
        notesMap = new Map(JSON.parse(strNotesMap));
    }
}

//Displays saved info from Local Storage to screen//
function displayNotesToScreen(){
    for(let [noteID, note] of notesMap.entries()) {
        addNoteToScreen(noteID, note);
    }
}

//Saves last used noteID number to Local Storage//
function saveCurrentNoteIDNumberToLocalStorage(){
    let strCurrentNoteIDNumber = JSON.stringify(currentNoteIDNumber);
    localStorage.setItem("currentNoteIDNumber", strCurrentNoteIDNumber);
}

//Loads last noteID used from Local Storage to refreshed screen//
function loadCurrentNoteIDNumberFromLocalStorage() {
    let strCurrentNoteIDNumber = localStorage.getItem("currentNoteIDNumber");
    if(strCurrentNoteIDNumber != null){
        currentNoteIDNumber = JSON.parse(strCurrentNoteIDNumber);
    }
}

//Deletes saved note from screen//
function onDeleteNoteClicked(noteButtonElement){
    let noteElement = noteButtonElement.parentElement;
    let noteID = noteElement.id;
    notesMap.delete(noteID);
    saveMapToLocalStorage();
    noteElement.remove();
}