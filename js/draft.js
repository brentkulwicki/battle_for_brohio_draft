/* This function prompts the user to input the number of teams in their league and the
number of rounds their draft will be and then lays out the draft board into a table
that takes into account how many rounds and teams there are
It also assigns the number of teams and rounds as global variables for other functions
to call */
let numOfTeams = prompt('How many teams are in your league?');
numOfTeams = parseInt(numOfTeams);
let numOfRounds = prompt('How many rounds is your draft?');
numOfRounds = parseInt(numOfRounds);
function setDraftBoard () {
    let draftBoard = document.getElementById('draftBoard');
    draftBoard.insertRow(0).insertCell(0).innerHTML = 'Round/Pick';
    let i = 1;
    let j = 1;
    while (i < (numOfTeams + 1)) {
        draftBoard.rows[0].insertCell(i).innerHTML = `Pick ${i}`;
        i++;
    }
    while (j < (numOfRounds +1)) {
        draftBoard.insertRow(j).insertCell(0).innerHTML = `Pick ${j}`;
        j++;
    }
}
setDraftBoard();
/* this section check to see if the round is even or odd and then inserts the 
draft selection into the proper table element of the draft board */
let player = '';
let pickCounter = 1;
let roundCounter = 1;
function draftPlayer () {
    if ((roundCounter + 1) > numOfRounds) { // stops the program from running if the
        console.log('program is finished'); // number of rounds is exceeded
    } else {
        player = document.getElementById('player').value;
        draftTable = document.getElementsByTagName('tr');
        if (roundCounter % 2 === 0) {
            console.log('need to add players to the end of the round')
            pickCounter--;
        } else {
            draftTable[roundCounter].insertCell().innerHTML = `${player}`;
            pickCounter++;
            console.log(pickCounter);
        }
        if ((numOfTeams + 1) === pickCounter) { // when the last pick of a round happens, this
            roundCounter++; // part of the code will move onto the next round
        }
    }
}
document.getElementById("submitForm")[1].addEventListener("click", draftPlayer);