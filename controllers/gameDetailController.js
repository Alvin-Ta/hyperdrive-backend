const { getGameDetails } = require('../services/nhlService');

const getGameDetail = async (req, res) => {
    const { game_id } = req.params;
    try {
        const gameDetails = await getGameDetails(game_id);
        res.json({ gameDetails });
    } catch (err) {
        console.error('someting', err);
        res.status(500).json({ error: 'Failed to fetch landing page' });
    }
};

module.exports = { getGameDetail };

