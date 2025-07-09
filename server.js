const express = require('express');
const app = express();
const playerRoutes = require('./routes/players');
const scheduleRoutes = require('./routes/schedule');
const boxscoreRoutes = require('./routes/boxscore');
const queriesRoutes = require('./routes/queries');



app.use('/player', playerRoutes); // Mount player routes under /player
app.use('/schedule', scheduleRoutes);
app.use('/game', boxscoreRoutes);
app.use('/query', queriesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
