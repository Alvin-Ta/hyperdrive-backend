const { fetchCurrentSchedule, fetchScheduleByDate } = require('../services/nhlService');

const getCurrentSchedule = async (req, res) => {
    try {
        const schedule = await fetchCurrentSchedule();
        res.json(schedule);
    } catch (err) {
        console.error('Error fetching current schedule:', err);
        res.status(500).json({ error: 'Failed to fetch current schedule' });
    }
};

const getScheduleByDate = async (req, res) => {
    const { date } = req.params;

    try {
        const schedule = await fetchScheduleByDate(date);
        res.json(schedule);
    } catch (err) {
        console.error('Error fetching schedule by date:', err);
        res.status(500).json({ error: 'Failed to fetch schedule for date' });
    }
};

module.exports = { getCurrentSchedule, getScheduleByDate };
