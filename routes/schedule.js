const express = require('express');
const router = express.Router();
const { 
    getCurrentSchedule,
    getScheduleByDate
 } = require('../controllers/scheduleController');

router.get('/now', getCurrentSchedule); // Route: /schedule/now
router.get('/:date', getScheduleByDate);

module.exports = router;