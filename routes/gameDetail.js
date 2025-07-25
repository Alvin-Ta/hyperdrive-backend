const express = require('express');
const router = express.Router();

const { getGameDetail } = require('../controllers/gameDetailController');

 router.get('/:game_id', getGameDetail);

 module.exports = router;