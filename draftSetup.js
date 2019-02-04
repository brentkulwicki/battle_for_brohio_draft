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