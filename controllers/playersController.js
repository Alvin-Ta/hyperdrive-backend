const { fetchPlayerGameLog, fetchAllPlayers, fetchPlayerInfo } = require('../services/nhlService');

const getPlayerGameLog = async (req, res) => {
    const { id, season, gameType } = req.params;

    try {
        const gameLog = await fetchPlayerGameLog(id, season, gameType);
        res.json(gameLog);
    } catch (err) {
        console.error('Error fetching player game log:', err);
        res.status(500).json({ error: 'Failed to fetch player game log' });
    }
};

const getAllPlayers = async (req, res) => {
    try {
        const allPlayers = await fetchAllPlayers();
        res.json(allPlayers)
    } catch (err) {
        console.error('Error fetching all players:', err);
        res.status(500).json({ error: 'Failed to fetch players' });
      }
};

const getPlayerInfo = async (req, res) => {
    const { id } = req.params;
    try {
        const playerInfo = await fetchPlayerInfo(id);
        res.json(playerInfo);
    } catch (err) {
        console.error('Error fetching player info:', err);
        res.status(500).json({ error: 'Failed to fetch player info' });
    }
}

module.exports = { getPlayerGameLog, getAllPlayers, getPlayerInfo };
