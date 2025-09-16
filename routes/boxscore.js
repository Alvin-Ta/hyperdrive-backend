const express = require('express');
const router = express.Router();

const { getBoxScore, getPlayByPlay } = require('../controllers/boxscoreController');

 router.get('/:game_id/boxscore', getBoxScore);
 router.get('/:game_id/play-by-play', getPlayByPlay)

 module.exports = router;