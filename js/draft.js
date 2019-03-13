let lastName = document.getElementById('lastName');
let last = '';
let getData = new XMLHttpRequest;
let jsonData = [];
let jsonHittingStats = [];
let jsonPitchingStats = [];
let playerParent = document.getElementById('playerList');
let draftedPlayerCells = document.getElementsByTagName('td');
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
button.addEventListener('click', getPlayer);

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
    let createText;
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
            console.log(jsonHittingStats);
            displayHittingStats();
        };
    };
    getData.send();
};
function getPitchingStats(id) {
    jsonPitchingStats = [];
    let idNumber = id;
    getData.open('GET', `http://lookup-service-prod.mlb.com/json/named.sport_pitching_tm.bam?league_list_id='mlb'&game_type='R'&season='2018'&player_id='${idNumber}'`, true)
    getData.onload = function() {
        if (this.status === 200) {
            jsonPitchingStats.push(JSON.parse(this.responseText));
            console.log(jsonPitchingStats);
            displayPitcherStats();
        };
    };
    getData.send();
};
// this function grabs the player data being displayed in the playersearch section and puts it at the tope of the page
function displayPlayerInfo (playerTeamPosition) {
    let draftPlayerName = document.getElementById('displayName');
    draftPlayerName.innerHTML = playerTeamPosition;
};
// these two functions display the hitting and pitching stats from MLB's site
function displayHittingStats() {
    checkDraftedPlayers();
    let obpCalc;
    let slgCalc;
    if (jsonHittingStats[0].sport_hitting_tm.queryResults.row.length > 1) {
        let length = jsonHittingStats[0].sport_hitting_tm.queryResults.row.length;
        let games = 0;
        let runsScored = 0;
        let homeruns = 0;
        let runsBattedIn = 0;
        let stolenBases = 0;
        let onBasePerc = 0;
        let sluggingPerc = 0;
        for (let i = 0; i < length; i++) {
            let gamesPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].g;
            let runsPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].r;
            let homerunsPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].hr;
            let rbiPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].rbi;
            let sbPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].sb;
            let obpPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].obp;
            let slgPlaceholder = jsonHittingStats[0].sport_hitting_tm.queryResults.row[i].slg;
            gamesPlaceholder = parseInt(gamesPlaceholder);
            runsPlaceholder = parseInt(runsPlaceholder);
            homerunsPlaceholder = parseInt(homerunsPlaceholder);
            rbiPlaceholder = parseInt(rbiPlaceholder);
            sbPlaceholder = parseInt(sbPlaceholder);
            obpPlaceholder = parseFloat(obpPlaceholder);
            obpPlaceholder = obpPlaceholder * gamesPlaceholder;
            slgPlaceholder = parseFloat(slgPlaceholder);
            slgPlaceholder = slgPlaceholder * gamesPlaceholder;
            games = games + gamesPlaceholder;
            runsScored = runsScored + rbiPlaceholder;
            homeruns = homeruns + homerunsPlaceholder;
            runsBattedIn = runsBattedIn + rbiPlaceholder;
            stolenBases = stolenBases + sbPlaceholder;
            onBasePerc = onBasePerc + obpPlaceholder;
            sluggingPerc = sluggingPerc + slgPlaceholder;
        }
        innings.innerHTML = '-';
        qs.innerHTML = '-';
        sv.innerHTML = '-';
        era.innerHTML = '-';
        whip.innerHTML = '-';
        kbb.innerHTML = '-';
        gs.innerHTML = games;
        runs.innerHTML = runsScored;
        hr.innerHTML = homeruns;
        rbi.innerHTML = runsBattedIn;
        sb.innerHTML = stolenBases;
        obpCalc = (onBasePerc/games)
        obp.innerHTML = obpCalc.toFixed(3);
        slgCalc = (sluggingPerc/games);
        slg.innerHTML = slgCalc.toFixed(3);
    } else {
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
    };
};
function displayPitcherStats() {
    checkDraftedPlayers();
    if (jsonPitchingStats[0].sport_pitching_tm.queryResults.row.length > 1) {
        let length = jsonPitchingStats[0].sport_pitching_tm.queryResults.row.length;
        let games = 0;
        let inningsPitched = 0;
        let qualityStart = 0;
        let saves = 0;
        let earnedRunAvg = 0;
        let walksHitsIP = 0;
        let kbbTotal = 0;
        let eraCalc = 0;
        let whipCalc = 0;
        for (let i = 0; i < length; i++) {
            let gamesPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].g;
            let ipPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].ip;
            let qsPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].qs;
            let savesPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].sv;
            let eraPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].era;
            let whipPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].whip;
            let kbbPlaceholder = jsonPitchingStats[0].sport_pitching_tm.queryResults.row[i].kbb;
            gamesPlaceholder = parseInt(gamesPlaceholder);
            ipPlaceholder = parseFloat(ipPlaceholder);
            qsPlaceholder = parseInt(qsPlaceholder);
            savesPlaceholder = parseInt(savesPlaceholder);
            eraPlaceholder = parseFloat(eraPlaceholder);
            eraPlaceholder = eraPlaceholder * ipPlaceholder;
            whipPlaceholder = parseFloat(whipPlaceholder);
            whipPlaceholder = whipPlaceholder * ipPlaceholder;
            kbbPlaceholder = parseFloat(kbbPlaceholder);
            kbbPlaceholder = kbbPlaceholder * ipPlaceholder;
            games = games + gamesPlaceholder;
            inningsPitched = inningsPitched + ipPlaceholder;
            qualityStart = qualityStart + qsPlaceholder;
            saves = saves + savesPlaceholder;
            earnedRunAvg = earnedRunAvg + eraPlaceholder;
            walksHitsIP = walksHitsIP + whipPlaceholder;
            kbbTotal = kbbTotal + kbbPlaceholder;
        }
        runs.innerHTML = '-';
        hr.innerHTML = '-';
        rbi.innerHTML = '-';
        sb.innerHTML = '-';
        obp.innerHTML = '-';
        slg.innerHTML = '-';
        gs.innerHTML = games;
        let inningsRemainder = calcInnings(inningsPitched);
        innings.innerHTML = Math.floor(inningsPitched) + inningsRemainder;
        qs.innerHTML = qualityStart;
        sv.innerHTML = saves;
        eraCalc = (earnedRunAvg/(Math.floor(inningsPitched) + inningsRemainder));
        eraCalc = eraCalc.toFixed(2);
        era.innerHTML = eraCalc;
        whipCalc = (walksHitsIP/(Math.floor(inningsPitched) + inningsRemainder));
        whipCalc = whipCalc.toFixed(2);
        whip.innerHTML = whipCalc;
        kbbTotal = (kbbTotal/(Math.floor(inningsPitched) + inningsRemainder));
        kbbTotal = kbbTotal.toFixed(2);
        kbb.innerHTML = kbbTotal;
    } else {
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
    };
};
function calcInnings(innings) {
    let ipRemainder = innings % 1;
    //for .9 innings
    if (ipRemainder > 0.81) {
        return 3.0;
    // for .8 innings
    } else if (ipRemainder > 0.7) {
        return 2.2;
    // for .7 innings
    } else if (ipRemainder > 0.61) {
        return 2.1;
    // for .6 innings
    } else if (ipRemainder > 0.5) {
        return 2.0;
    // for .5 innings
    } else if (ipRemainder > 0.4) {
        return 1.2;
    // for .4 innings
    } else if (ipRemainder > 0.31) {
        return 1.1;
    // for .3 innings
    } else if (ipRemainder > 0.2) {
        return 1.0; 
    // for .2 innings
    } else if (ipRemainder > 0.11) {
        return 0.2;
    // for .1 innings
    } else if (ipRemainder > 0) {
        return 0.1;
    } else {
        return 0.0;
    };
};

draftButton.addEventListener('click', draftPlayer);

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
                cells[i].setAttribute('title', selectedPlayer);
                draftedPlayers.push(playerId);
                draftButton.setAttribute('class', 'disabled');
                break;
            };
        };
    let buttonArray = document.getElementsByTagName('button');
    buttonArray[2].setAttribute('disabled', true);
    } else {
    };
};
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
                    cells[i].setAttribute('title', selectedPlayer);
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
