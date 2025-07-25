const express = require('express');
const app = express();

const playerRoutes = require('./routes/players');
const scheduleRoutes = require('./routes/schedule');
const boxscoreRoutes = require('./routes/boxscore');
const queriesRoutes = require('./routes/queries');
const gameDetailRoutes = require('./routes/gameDetail')



app.use('/player', playerRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/game', boxscoreRoutes);
app.use('/query', queriesRoutes);
app.use('/detail', gameDetailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
