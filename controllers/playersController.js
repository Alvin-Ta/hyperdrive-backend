const { fetchPlayerGameLog } = require('../services/nhlService');

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

module.exports = { getPlayerGameLog };
