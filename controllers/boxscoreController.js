const { fetchBoxScore, getTopPerformers, fetchPlayByPlay } = require('../services/nhlService');

const getBoxScore = async (req, res) => {
    const { game_id } = req.params;
    try {
        const boxScore = await fetchBoxScore(game_id);
        const topPerformers = getTopPerformers(boxScore);
        res.json({
            boxScore,
            topPerformers
          });
    } catch (err) {
        console.error('Error fetching box score by game id', err);
        res.status(500).json({ error: 'Failed to fetch box score' });
    }
};

const getPlayByPlay = async (req, res) => {
    const { game_id } = req.params;
    try {
        const PlayByPlay = await fetchPlayByPlay(game_id);
        res.json(PlayByPlay);
    } catch (err) {
        console.error('Error fetching play by play', err);
        res.status(500).json({ error: 'Failed to fetch play by play' });
    }
};


module.exports = { getBoxScore, getPlayByPlay };

