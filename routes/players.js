const express = require('express');
const router = express.Router();
const { getPlayerGameLog } = require('../controllers/playersController');

// Route: /player/:id/games/:season/:gameType
// /gamecenter/2023020204/boxscore
router.get('/:id/games/:season/:gameType', getPlayerGameLog);

module.exports = router;
