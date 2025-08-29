const express = require('express');
const router = express.Router();
const { getPlayerGameLog, getAllPlayers } = require('../controllers/playersController');

// Route: /player/:id/games/:season/:gameType
// /gamecenter/2023020204/boxscore
router.get('/:id/games/:season/:gameType', getPlayerGameLog);
router.get('/all', getAllPlayers)

module.exports = router;
