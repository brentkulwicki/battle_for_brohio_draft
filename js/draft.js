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
let draftButton = document.getElementById('draftButton');
let draftedPlayers = [];
let playerId;

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
    playerId = event.target.id;
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
// this function grabs the player data being displayed in the playersearch section and puts it at the tope of the page
function displayPlayerInfo (playerTeamPosition) {
    let draftPlayerName = document.getElementById('displayName');
    draftPlayerName.innerHTML = playerTeamPosition;
}
// these two functions display the hitting and pitching stats from MLB's site
function displayHittingStats() {
    checkDraftedPlayers();
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
    checkDraftedPlayers();
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

draftButton.addEventListener('click', draftPlayer)

function draftPlayer () {
    let selectedPlayer = document.getElementById('displayName').innerHTML;
    let cells = document.querySelectorAll('td');
    let cellArray = Array.from(cells);
    let isActive = draftButton.className;
    if (isActive === 'active') {
        for (let i = 12; i < cellArray.length; i++) {
            let arrayObject = cellArray[i];
            let textValue = arrayObject.innerHTML;
            textValue = textValue.toString();
            if (textValue.length < 1) {
                cells[i].innerHTML = selectedPlayer;
                draftedPlayers.push(playerId);
                draftButton.setAttribute('class', 'disabled');
                break;
            }
        }
    } else {
        console.log('this should display as default');
    }
}
function checkDraftedPlayers() {
    if (draftedPlayers.length < 1) {
        draftButton.setAttribute('class', 'active');
    } else {
        for (let i = 0; i < draftedPlayers.length; i++) {
            if (playerId === draftedPlayers[i]) {
                draftButton.setAttribute('class', 'disabled');
            } else {
                draftButton.setAttribute('class', 'active');
            };
        };
    };
};
//This section is for using the same player selectors as above, but then inputs them as keepers at the bottom of the draft board instead of into the normal draft flow
function inputKeepers() {
    let selectedPlayer = document.getElementById('displayName').innerHTML;
    let cells = document.querySelectorAll('td');
    let cellArray = Array.from(cells);
    let selectTeam = document.querySelector('select');
    switch (selectTeam.value) {
        case 'Vin':
			for (let i = 441; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
            };
			break;
		case 'BB':
			for (let i = 442; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
			break;
		case 'BRUC':
			for (let i = 443; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
			break;
		case 'BK':
			for (let i = 444; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
            break;
        case 'XTG':
			for (let i = 445; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
            break;
        case 'JW':
			for (let i = 446; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
            break;
        case 'Patt':
			for (let i = 447; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
            break;
        case 'WW':
			for (let i = 448; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
            break;
        case 'JMO':
			for (let i = 449; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
            break;
        case 'seth':
			for (let i = 450; i > 0; i = i - 11) {
				let newObject = cellArray[i];
				let htmlValue = newObject.innerHTML;
				htmlValue = htmlValue.toString();
				if (htmlValue.length < 1 && draftButton.className === 'active') {
                    cells[i].innerHTML = selectedPlayer;
                    draftedPlayers.push(playerId);
                    draftButton.setAttribute('class', 'disabled');
					break;
				};
			};
		    break;
	};
};
let keeperButton = document.getElementById('keepPlayers');
keeperButton.addEventListener('click', inputKeepers);