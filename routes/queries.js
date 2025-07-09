const express = require('express');
const router = express.Router();
const { getPreviousMatches, getTeamVsTeamRecord, getPlayers, getPlayerMatchupHist} = require('../controllers/queriesController');

router.get('/:team/now', getPreviousMatches);
router.get('/:team/vs/:opponent/:season', getTeamVsTeamRecord);
router.get('/:team/players', getPlayers);
router.get('/:player/vs/:team', getPlayerMatchupHist);

module.exports = router;