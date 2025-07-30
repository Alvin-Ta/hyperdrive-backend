const { fetchPreviousMatch, fetchPlayer, fetchTeamPlayers, fetchPlayerMatchupHist} = require('../services/nhlService');

const getPreviousMatches = async (req, res) => {
    const { team } = req.params;
    try {
        const previousMatches = await fetchPreviousMatch(team);
        res.json(previousMatches);
    } catch (err) {
        console.error('Error fetching previous match by team', err);
        res.status(500).json({ error: 'Failed to fetch previous match' });
    }
};

const getTeamVsTeamRecord = async (req, res) => {
    const { team, opponent, season } = req.params;
    const allGames = await fetchPreviousMatch(team);

    const selectGames = allGames.filter(game => {
        const home = game.homeTeam.abbrev;
        const away = game.awayTeam.abbrev;

        return home === opponent || away === opponent;
    });

    res.json({ team, opponent, season, record: selectGames });
};

const getPlayers = async (req, res) => {
    const { team } = req.params;
    try {
        const players = await fetchTeamPlayers(team);

        res.json(players);
    } catch (err) {
        console.error('Error fetching players by team', err);
        res.status(500).json({ error: 'Failed to fetch players' });
    }
};

const getPlayerMatchupHist = async (req, res) => {
    const {player, team} = req.params;
    try {
        const playerMatchup = await fetchPlayerMatchupHist(player, team);
        res.json(playerMatchup);
    }  
    catch (err) {
        console.error('Error fetching players by team', err);
        res.status(500).json({ error: 'Failed to fetch players' });
    }
};

module.exports = { getPreviousMatches, getPlayers, getTeamVsTeamRecord, getPlayerMatchupHist };
