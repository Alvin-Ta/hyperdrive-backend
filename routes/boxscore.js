const express = require('express');
const router = express.Router();

const { getBoxScore } = require('../controllers/boxscoreController');

 router.get('/:game_id/boxscore', getBoxScore);

 module.exports = router;