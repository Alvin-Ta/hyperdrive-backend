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
            darkLogo: game.awayTeam.darkLogo,
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

const getGameDetails = async (game_id) => {
    const url = `https://api-web.nhle.com/v1/gamecenter/${game_id}/landing`;
    const response = await axios.get(url);
    const resp = response.data

    const gameDetails = {
        gameId: resp.id,
        season: resp.season,
        gameType: resp.gameType,
        gameDate: resp.gameDate,
        startTime: resp.startTimeUTC,
        venue: resp.venue.default,
        venueLocation: resp.venueLocation.default,
        periodDescriptor: resp.periodDescriptor ?? null,
        gameState: resp.gameState,
        // gameScheduleState: resp.gameScheduleState,
        // shootoutInUse: resp.shootoutInUse,
        regPeriods: resp.regPeriods ?? null,
        // otInUse: resp.otInUse,
        // tiesInUse: resp.tiesInUse,
      
        awayTeam: {
          id: resp.awayTeam.id,
          commonName: resp.awayTeam.commonName.default,
          abbrev: resp.awayTeam.abbrev,
          placeName: resp.awayTeam.placeName.default,
          cityName: resp.awayTeam.placeNameWithPreposition.default,
          darkLogo: resp.awayTeam.darkLogo,
          logo: resp.awayTeam.logo ?? null,
          score: resp.awayTeam.score ?? null,
          sog: resp.awayTeam.sog ?? null,
          record: resp.awayTeam.record ?? null
        },
      
        homeTeam: {
          id: resp.homeTeam.id,
          commonName: resp.homeTeam.commonName.default,
          abbrev: resp.homeTeam.abbrev,
          placeName: resp.homeTeam.placeName.default,
          cityName: resp.homeTeam.placeNameWithPreposition.default,
          darkLogo: resp.homeTeam.darkLogo,
          logo: resp.homeTeam.logo ?? null,
          score: resp.homeTeam.score ?? null,
          sog: resp.homeTeam.sog ?? null,
          record: resp.homeTeam.record ?? null
        },
      
        summary: {
          scoring: (resp.summary?.scoring ?? []).map(period => ({
            periodDescriptor: period.periodDescriptor ?? {},
            goals: (period.goals ?? []).map(goal => ({
              playerId: goal.playerId,
              name: {
                firstName: goal.firstName?.default ?? "",
                lastName: goal.lastName?.default ?? ""
              },
              teamAbbrev: goal.teamAbbrev?.default ?? "N/A",
              headshot: goal.headshot ?? null,
              highlightClipSharingUrl: goal.highlightClipSharingUrl ?? null,
              highlightClipSharingUrlFr: goal.highlightClipSharingUrlFr ?? null,
              goalsToDate: goal.goalsToDate ?? null,
              awayScore: goal.awayScore ?? null,
              homeScore: goal.homeScore ?? null,
              leadingTeamAbbrev: goal.leadingTeamAbbrev?.default ?? null,
              timeInPeriod: goal.timeInPeriod ?? null,
              shotType: goal.shotType ?? null,
              goalModifier: goal.goalModifier ?? null,
              assists: (goal.assists ?? []).map(assist => ({
                playerId: assist.playerId,
                name: {
                  firstName: assist.firstName?.default ?? "",
                  lastName: assist.lastName?.default ?? ""
                },
                assistsToDate: assist.assistsToDate ?? null,
                sweaterNumber: assist.sweaterNumber ?? null
              })),
              pptReplayUrl: goal.pptReplayUrl ?? null
            }))
          })),
      
          penalties: (resp.summary?.penalties ?? []).flatMap(period =>
            (period.penalties ?? []).map(penalty => ({
              timeInPeriod: penalty.timeInPeriod,
              type: penalty.type,
              duration: penalty.duration,
              descKey: penalty.descKey,
              committedByPlayer: penalty.committedByPlayer?.default ?? "N/A",
              teamAbbrev: penalty.teamAbbrev?.default ?? "N/A",
              drawnBy: penalty.drawnBy?.default ?? null
            }))
          ),
      
          threeStars: resp.summary?.threeStars ?? []
        },
      
        matchup: {
            skaterSeasonStats: {
              contextLabel: resp.matchup?.skaterSeasonStats?.contextLabel ?? "N/A",
              contextSeason: resp.matchup?.skaterSeasonStats?.contextSeason ?? null,
              skaters: (resp.matchup?.skaterSeasonStats?.skaters ?? []).map(skater => ({
                playerId: skater.playerId,
                teamId: skater.teamId,
                sweaterNumber: skater.sweaterNumber,
                name: skater.name?.default ?? "",
                position: skater.position,
                gamesPlayed: skater.gamesPlayed,
                goals: skater.goals,
                assists: skater.assists,
                points: skater.points,
                plusMinus: skater.plusMinus,
                pim: skater.pim,
                avgPoints: skater.avgPoints,
                avgTimeOnIce: skater.avgTimeOnIce,
                gameWinningGoals: skater.gameWinningGoals,
                shots: skater.shots,
                shootingPctg: skater.shootingPctg,
                faceoffWinningPctg: skater.faceoffWinningPctg,
                powerPlayGoals: skater.powerPlayGoals,
                blockedShots: skater.blockedShots,
                hits: skater.hits
              }))
            },
        
            goalieSeasonStats: {
              contextLabel: resp.matchup?.goalieSeasonStats?.contextLabel ?? "N/A",
              contextSeason: resp.matchup?.goalieSeasonStats?.contextSeason ?? null,
              goalies: (resp.matchup?.goalieSeasonStats?.goalies ?? []).map(goalie => ({
                playerId: goalie.playerId,
                teamId: goalie.teamId,
                sweaterNumber: goalie.sweaterNumber,
                name: goalie.name?.default ?? "",
                gamesPlayed: goalie.gamesPlayed,
                wins: goalie.wins,
                losses: goalie.losses,
                otLosses: goalie.otLosses,
                shotsAgainst: goalie.shotsAgainst,
                goalsAgainst: goalie.goalsAgainst,
                goalsAgainstAvg: goalie.goalsAgainstAvg,
                savePctg: goalie.savePctg,
                shutouts: goalie.shutouts,
                saves: goalie.saves,
                toi: goalie.toi
              }))
            }
          },
      
        clock: resp.clock ?? null
      };

      return gameDetails
}

const fetchPreviousMatch = async (team, season = "now") => { //team is in the format of TOR or PEN

    const url = `https://api-web.nhle.com/v1/club-schedule-season/${team}/${season}`;
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
    fetchPlayerMatchupHist,
    getGameDetails
};
