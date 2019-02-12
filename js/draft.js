let lastName = document.getElementById('lastName');
let last = '';
let getData = new XMLHttpRequest;
let jsonData = [];
let jsonHittingStats = [];
let jsonPitchingStats = [];
let playerParent = document.getElementById('playerList');
//variable for the nodes where the html will be spliced in using innerHTML
let gs = document.getElementById('gs');
let runs = document.getElementById('runs');
let hr = document.getElementById('hr');
let rbi = document.getElementById('rbi');
let sb = document.getElementById('sb');
let obp = document.getElementById('obp');
let slg = document.getElementById('slg');
let innings = document.getElementById('innings');
let qs = document.getElementById('qs');
let sv = document.getElementById('sv');
let era = document.getElementById('era');
let whip = document.getElementById('whip');
let kbb = document.getElementById('kbb');
let displayName = document.getElementById('displayName');
let displayTeam = document.getElementById('displayTeam');

let button = document.getElementById('playerSearch');
button.addEventListener('click', getPlayer)

function getPlayer () {
    removePlayerList();
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
    let team;
    let position;
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
        createEl.setAttribute('class', position);
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
            createEl.setAttribute('class', position);
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
//this function is listening to the click on the li's that are created from the first player search
playerParent.addEventListener('click', function(event) {
    let playerId = event.target.id;
    let playerPosition = event.target.className;
    let playerInformation = event.target.innerHTML;
    displayPlayerInfo(playerInformation);
    getPlayerStats(playerId, playerPosition);
});

function getPlayerStats (id, position) {
    if (position === 'P') {
        getPitchingStats(id);
    } else {
        getHittingStats(id);
    };
};
//These two function pull the hitting and pitching data from MLB's website
function getHittingStats(id) {
    jsonHittingStats = [];
    let idNumber = id;
    getData.open('GET', `http://lookup-service-prod.mlb.com/json/named.sport_hitting_tm.bam?league_list_id='mlb'&game_type='R'&season='2018'&player_id='${idNumber}'`, true)
    getData.onload = function() {
        if (this.status === 200) {
            jsonHittingStats.push(JSON.parse(this.responseText));
            displayHittingStats();
        }
    }
    getData.send();
}
function getPitchingStats(id) {
    jsonPitchingStats = [];
    let idNumber = id;
    getData.open('GET', `http://lookup-service-prod.mlb.com/json/named.sport_pitching_tm.bam?league_list_id='mlb'&game_type='R'&season='2018'&player_id='${idNumber}'`, true)
    getData.onload = function() {
        if (this.status === 200) {
            jsonPitchingStats.push(JSON.parse(this.responseText));
            displayPitcherStats();
        }
    }
    getData.send();
}
function displayPlayerInfo (playerTeamPosition) {
    let draftPlayerName = document.getElementById('displayName');
    draftPlayerName.innerHTML = playerTeamPosition;
}
function displayHittingStats() {
    innings.innerHTML = '-';
    qs.innerHTML = '-';
    sv.innerHTML = '-';
    era.innerHTML = '-';
    whip.innerHTML = '-';
    kbb.innerHTML = '-';
    gs.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.g;
    runs.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.r;
    hr.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.hr;
    rbi.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.rbi;
    sb.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.sb;
    obp.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.obp;
    slg.innerHTML = jsonHittingStats[0].sport_hitting_tm.queryResults.row.slg;
}
function displayPitcherStats() {
    runs.innerHTML = '-';
    hr.innerHTML = '-';
    rbi.innerHTML = '-';
    sb.innerHTML = '-';
    obp.innerHTML = '-';
    slg.innerHTML = '-';
    gs.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.g;
    innings.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.ip;
    qs.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.qs;
    sv.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.sv;
    era.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.era;
    whip.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.whip;
    kbb.innerHTML = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.kbb;
}