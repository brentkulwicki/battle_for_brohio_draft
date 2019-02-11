let lastName = document.getElementById('lastName');
let firstName = document.getElementById('firstName');
let first = '';
let last = '';
let getData = new XMLHttpRequest;
let jsonData = [];
let jsonStats = [];
let playerParent = document.getElementById('playerList');

let button = document.getElementById('playerSearch');
button.addEventListener('click', getPlayer)

function getPlayer () {
    removePlayerList();
    first = firstName.value;
    last = lastName.value;
    getData.open('GET', `http://lookup-service-prod.mlb.com/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='${last}%25'`, true)
    getData.onload = function() {
        if (this.status === 200) {
            jsonData.push(JSON.parse(this.responseText));
            displayPlayers();
        }
    }
    getData.send();
}

function displayPlayers() {
    let name;
    let position;
    let team;
    let playerId;
    let arrayLength;
    let createEl;
    let createText
    if (jsonData[0].search_player_all.queryResults.totalSize === '1') {
        name = jsonData[0].search_player_all.queryResults.row.name_display_first_last;
        position = jsonData[0].search_player_all.queryResults.row.position;
        team = jsonData[0].search_player_all.queryResults.row.team_abbrev;
        playerId = jsonData[0].search_player_all.queryResults.row.player_id;
        createEl = document.createElement('li');
        createEl.setAttribute('id', playerId);
        createText = document.createTextNode(`${name} - ${position} - ${team}`);
        createEl.appendChild(createText);
        playerParent.appendChild(createEl);
        jsonData = [];
    } else {
        arrayLength = jsonData[0].search_player_all.queryResults.totalSize;
        arrayLength = parseInt(arrayLength);
        for (let i = 0; i < arrayLength; i++) {
            name = jsonData[0].search_player_all.queryResults.row[i].name_display_first_last;
            position = jsonData[0].search_player_all.queryResults.row[i].position;
            team = jsonData[0].search_player_all.queryResults.row[i].team_abbrev;
            playerId = jsonData[0].search_player_all.queryResults.row[i].player_id;
            createEl = document.createElement('li');
            createEl.setAttribute('id', playerId);
            createText = document.createTextNode(`${name} - ${position} - ${team}`);
            createEl.appendChild(createText);
            playerParent.appendChild(createEl);
        };  jsonData = [];
    };
};
// This function removes the child elements from the ul on the page. To be used when the "search" button is clicked to remove the players from the last search
function removePlayerList () {
    while (playerParent.firstChild) {
        playerParent.removeChild(playerParent.firstChild);
    };
};

playerParent.addEventListener('click', function(event) {
    let playerId = event.target.id;
    getPlayerStats(playerId);
})

function getPlayerStats (id) {
    let idNumber = id;
    getData.open('GET', `http://lookup-service-prod.mlb.com/json/named.sport_hitting_tm.bam?league_list_id='mlb'&game_type='R'&season='2018'&player_id='${idNumber}'`, true)
    getData.onload = function() {
        if (this.status === 200) {
            jsonStats.push(JSON.parse(this.responseText));
            console.log(jsonStats);
        }
    }
    getData.send();
};
// gonna use the event.target once the players name/team/position is displayed on the lefthand side. The click event to display stats will use a click event and event.target