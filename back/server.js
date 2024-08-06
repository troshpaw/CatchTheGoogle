import express from 'express';
import {start, playAgain, movePlayer, getGooglePoints, getPlayerPoints, getGameStatus} from '../core/state-manager.js';
import {getGridSize, getGooglePosition, getPlayerPosition} from '../core/state-manager.js';

const app = express();
const port = 3000;

app.get('/start', async (req, res) => {
    await start();
    res.send(200);
});

app.get('/playAgain', async (req, res) => {
    await playAgain();
    res.send(200);
});

app.get('/movePlayer', async (req, res) => {
    await movePlayer(playerNumber, direction);
    res.send(200);
});

app.get('/getGooglePoints', async (req, res) => {
    const googlePoints = await getGooglePoints();
    res.send({data: googlePoints});
});

app.get('/getPlayerPoints', async (req, res) => {
    const playerPoints = await getPlayerPoints();
    res.send({data: playerPoints});
});

app.get('/getGameStatus', async (req, res) => {
    const gameStatus = await getGameStatus();
    res.send({data: gameStatus});
});

app.get('/getGridSize', async (req, res) => {
    const gridSize = await getGridSize();
    res.send({data: gridSize});
});

app.get('/getGooglePosition', async (req, res) => {
    const googlePosition = await getGooglePosition();
    res.send({data: googlePosition});
});

app.get('/getPlayerPosition', async (req, res) => {
    const playerPosition = await getPlayerPosition();
    res.send({data: playerPosition});
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});