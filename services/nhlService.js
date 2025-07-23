const axios = require('axios');

async function fetchPlayerGameLog(playerId, season, gameType) {
    const url = `https://api-web.nhle.com/v1/player/${playerId}/game-log/${season}/${gameType}`;
    const response = await axios.get(url);
    return response.data;
}

async function fetchCurrentSchedule() {
    const url = `https://api-web.nhle.com/v1/schedule/now`;
    const response = await axios.get(url);
    return response.data;
}

const fetchScheduleByDate = async (date) => {
    const url = `https://api-web.nhle.com/v1/schedule/${date}`;
    const response = await axios.get(url);
    const sched = response.data || [];
    const games = sched.gameWeek[0].games || [];
    
    const simplified_games = games.map(game => ({
        gameId: game.id,
        gameType: game.gameType,
        gameState: game.gameState, //would be live
        venue: game.venue.default,
        startTime: game.startTimeUTC,

        awayTeam: {
            placeName: game.awayTeam.placeName.default,
            commonName: game.awayTeam.commonName.default,
            abbrev: game.awayTeam.abbrev,
            darklogo: game.awayTeam.darkLogo,
            score: game.awayTeam.score

        },
        homeTeam: {
            placeName: game.homeTeam.placeName.default,
            commonName: game.homeTeam.commonName.default,
            abbrev: game.homeTeam.abbrev,
            darkLogo: game.homeTeam.darkLogo,
            score: game.homeTeam.score

        },
        periodDescriptor: {
            periodNum: game.periodDescriptor.number,
            periodType: game.periodDescriptor.periodType,
        }
    }));


    return simplified_games
}

const fetchBoxScore = async (game_id) => { //2024030234
    const url = `https://api-web.nhle.com/v1/gamecenter/${game_id}/boxscore`;
    const response = await axios.get(url);
    const resp = response.data

    boxscore = {
        gameId: resp.id,
        gameType: resp.gameType,
        gameDate: resp.gameDate,
        venue: resp.venue.default,
        venueLocation: resp.venueLocation.default,
        startTime: resp.startTime,
        gameState: resp.gameState,
        periodDescriptor: resp.periodDescriptor,
        homeTeam: resp.homeTeam,
        awayTeam: resp.awayTeam,
        clock: resp.clock,
        playerByGameStats: resp.playerByGameStats || []
    }
    
    return boxscore
}

const fetchPreviousMatch = async (team) => { //team is in the format of TOR or PEN

    const url = `https://api-web.nhle.com/v1/club-schedule-season/${team}/now`;
    const response = await axios.get(url);
    const resp = response.data
    const sched = resp.games || [];

    const simplified_prev_sched = sched.map(match => ({
        id: match.id,
        gameDate: match.gameDate,
        venue: match.venue.default,
        gameState: match.gameState,

        awayTeam: {
            id: match.awayTeam.id,
            commonName: match.awayTeam.commonName.default,
            placeName: match.awayTeam.placeName.default,
            abbrev: match.awayTeam.abbrev,
            darkLogo: match.awayTeam.darkLogo,
            awayScore: match.awayTeam.score
        },

        homeTeam: {
            id: match.homeTeam.id,
            commonName: match.homeTeam.commonName.default,
            placeName: match.homeTeam.placeName.default,
            abbrev: match.homeTeam.abbrev,
            darkLogo: match.homeTeam.darkLogo,
            awayScore: match.homeTeam.score
        },
        
        periodDescription: {
            periodType: match.periodDescriptor.periodType,
            maxRegulationPeriods: match.periodDescriptor.maxRegulationPeriods,
        },
        // gameOutcome: match.gameOutcome.lastPeriodType
    }))
    return simplified_prev_sched
}

const fetchTeamPlayers = async (team) => {
    const url = `https://api-web.nhle.com/v1/roster/${team}/current`;
    const response = await axios.get(url);
    const resp = response.data

    const formattedPlayers = [
        ...resp.forwards.map(player => ({
            playerId: player.id,
            firstName: player.firstName.default,
            lastName: player.lastName.default,
            headshot: player.headshot,
            jerseyNum: player.sweaterNumber,
            position: player.positionCode
        })),

        ...resp.defensemen.map(player => ({
            playerId: player.id,
            firstName: player.firstName.default,
            lastName: player.lastName.default,
            headshot: player.headshot,
            jerseyNum: player.sweaterNumber,
            position: player.positionCode
        })),

        ...resp.goalies.map(player => ({
            playerId: player.id,
            firstName: player.firstName.default,
            lastName: player.lastName.default,
            headshot: player.headshot,
            jerseyNum: player.sweaterNumber,
            position: player.positionCode
        }))
    ];
    return formattedPlayers
}

async function fetchPlayerMatchupHist (playerId, teamAbbrev) {
    const url = `https://api-web.nhle.com/v1/player/${playerId}/game-log/20242025/2`;
    const response = await axios.get(url);
    const resp = response.data

    const specific_games = resp.gameLog.filter(game => {
        const team = game.opponentAbbrev;
        return team == teamAbbrev;
    });
    return specific_games
}



/*
for this function we'd need to extract the away/home team names, this way we can map `playerByGameStats` key properly to the specific player

*/
function getTopPerformers(boxScore) {
    const homeTeamName = boxScore.homeTeam.commonName.default;
    const awayTeamName = boxScore.awayTeam.commonName.default

    const away_forwards = boxScore.playerByGameStats.awayTeam.forwards;
    const away_defenders = boxScore.playerByGameStats.awayTeam.defense;

    const home_forwards = boxScore.playerByGameStats.homeTeam.forwards;
    const home_defenders = boxScore.playerByGameStats.homeTeam.defense;

    const awayfwd_sort = sorter(away_forwards);
    const awaydfd_sort = sorter(away_defenders);

    const homefwd_sort = sorter(home_forwards);
    const homedfd_sort = sorter(home_defenders);

    merged_away = [...awayfwd_sort, ...awaydfd_sort];
    merged_home = [...homefwd_sort, ...homedfd_sort];
    const merge_sort_away = sorter(merged_away).slice(0,2);
    const merge_sort_home = sorter(merged_home).slice(0,2);

    return {homeTeamName: homeTeamName, homeTeam: merge_sort_home, hwayTeamName: awayTeamName, awayTeam: merge_sort_away};
}

function sorter(position) {
    return position.sort((a,b) => {
        if (b.points != a.points) {
            return b.points - a.points
        }
        return b.goals - a.goals
    });
}





module.exports = {
    fetchPlayerGameLog,
    fetchCurrentSchedule,
    fetchScheduleByDate,
    fetchBoxScore,
    getTopPerformers,
    fetchPreviousMatch,
    fetchTeamPlayers,
    fetchPlayerMatchupHist
};
