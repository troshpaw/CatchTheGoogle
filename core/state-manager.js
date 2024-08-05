import { EVENTS, GAME_STATUSES, MOVING_DIRECTIONS } from "./constants.js";

const _state = {
    gameStatus: GAME_STATUSES.SETTINGS,
    settings: {
        /* in milliseconds */
        googleJumpInterval: 2000,
        gridSize: {
            rowsCount: 5,
            columnsCount: 5
        },
        pointsToLose: 10,
        pointsToWin: 5
    },
    
    positions: {
        google: {x: 1, y: 1},
        players: [
            {x: 2, y: 2}, 
            {x: 3, y: 3}
        ]
    },
    
    points: {
        google: 0,
        players: [0, 0]
    }
}

// OBSERVER
let _observers = [];

export function subscribe(observer) {
    _observers.push(observer);
}

export function unsubscribe(observer) {
    _observers = _observers.filter(o => o !== observer)
}

function _notifyObservers(name, payload = {}) {
    const event = {
        name,
        payload
    };
    _observers.forEach(o => {
        try {
            o(event);
        } catch (error) {
            console.error(error);
        }
    })
}

function _generateNewIntegerNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _jumpGoogleToNewPosition() {
    const newPosition = {..._state.positions.google}

    do {
        newPosition.x = _generateNewIntegerNumber(0, _state.settings.gridSize.columnsCount - 1);
        newPosition.y = _generateNewIntegerNumber(0, _state.settings.gridSize.rowsCount - 1);

        // var isNewPositionMatchWithCurrentGooglePosition = newPosition.x === _state.positions.google.x && newPosition.y === _state.positions.google.y;
        // var isNewPositionMatchWithCurrentPlayer1Position = newPosition.x === _state.positions.players[0].x && newPosition.y === _state.positions.players[0].y;
        // var isNewPositionMatchWithCurrentPlayer2Position = newPosition.x === _state.positions.players[1].x && newPosition.y === _state.positions.players[1].y;
    } while (_doesPositionMathWithPlayer1Position(newPosition) || _doesPositionMathWithPlayer2Position(newPosition) || _doesPositionMathWithGooglePosition(newPosition));

    _state.positions.google = newPosition;
}

function _getPlayerIndexByNumber(playerNumber) {
    const playerIndex = playerNumber - 1;

    if (playerIndex < 0 || playerIndex > _state.positions.players.length - 1) {
        throw new Error('Incorrect player number');
    }

    return playerIndex;
}

function _doesPositionMathWithPlayer1Position(newPosition) {
    return newPosition.x === _state.positions.players[0].x && newPosition.y === _state.positions.players[0].y;
}

function _doesPositionMathWithPlayer2Position(newPosition) {
    return newPosition.x === _state.positions.players[1].x && newPosition.y === _state.positions.players[1].y;
}

function _doesPositionMathWithGooglePosition(newPosition) {
    return newPosition.x === _state.positions.google.x && newPosition.y === _state.positions.google.y;
}

function _isPositionInValidRange(position) {
    if (position.x < 0 || position.x >= _state.settings.gridSize.columnsCount) return false;
    if (position.y < 0 || position.y >= _state.settings.gridSize.rowsCount) return false;

    return true;
}

function _catchGoogle(playerNumber) {
    const playerIndex = _getPlayerIndexByNumber(playerNumber);

    _state.points.players[playerIndex]++;
    _notifyObservers(EVENTS.SCORES_CHANGED);

    if (_state.points.players[playerIndex] === _state.settings.pointsToWin) {
        _state.gameStatus = GAME_STATUSES.WIN;
        _notifyObservers(EVENTS.STATUS_CHANGED);
        clearInterval(googleJumpInterval);
    } else {
        const oldPosition = {..._state.positions.google};
        // console.log(oldPosition);
        _jumpGoogleToNewPosition();
        const newPosition = {..._state.positions.google};
        // console.log(newPosition);
        _notifyObservers(EVENTS.GOOGLE_JUMPED, {
            oldPosition,
            newPosition 
        });
    }
}

// INTERFACE/ADAPTER

// COMMANDS / SETTER
export async function start() {
    if (_state.gameStatus !== GAME_STATUSES.SETTINGS) throw new Error(`incorrect transition from "${_state.gameStatus}" to "${GAME_STATUSES.IN_PROGRESS}"`);

    _state.positions.players[0] = {x: 0, y: 0};
    _state.positions.players[1] = {x: _state.settings.gridSize.columnsCount - 1, y: _state.settings.gridSize.rowsCount - 1};
    _jumpGoogleToNewPosition();
    
    _state.points.google = 0;
    _state.points.players[0] = 0;
    _state.points.players[1] = 0;
    
    let googleJumpInterval = setInterval(() => {
        const oldPosition = {..._state.positions.google};

        _jumpGoogleToNewPosition();
        _notifyObservers(EVENTS.GOOGLE_JUMPED, {
            oldPosition,
            newPosition: {..._state.positions.google}
        });

        _state.points.google++;
        _notifyObservers(EVENTS.SCORES_CHANGED);

        if (_state.points.google === _state.settings.pointsToLose) {
            clearInterval(googleJumpInterval);
            _state.gameStatus = GAME_STATUSES.LOSE;
            _notifyObservers(EVENTS.STATUS_CHANGED);
        }
        
    }, _state.settings.googleJumpInterval);
    _state.gameStatus = GAME_STATUSES.IN_PROGRESS;
    _notifyObservers(EVENTS.STATUS_CHANGED);
}

export async function playAgain() {
    _state.gameStatus = GAME_STATUSES.SETTINGS;
    _notifyObservers(EVENTS.STATUS_CHANGED);
}

export async function movePlayer(playerNumber, direction) {
    if (_state.gameStatus !== GAME_STATUSES.IN_PROGRESS) {
        console.warn('You can move player only when game is in progress');
        return;
    }

    const playerIndex = _getPlayerIndexByNumber(playerNumber);
    const oldPosition = {..._state.positions.players[playerIndex]};
    const newPosition = {..._state.positions.players[playerIndex]};

    switch (direction) {
        case MOVING_DIRECTIONS.UP:
            newPosition.y--;
            break;
        case MOVING_DIRECTIONS.DOWN:
            newPosition.y++;
            break;
        case MOVING_DIRECTIONS.LEFT:
            newPosition.x--;
            break;
        case MOVING_DIRECTIONS.RIGHT:
            newPosition.x++;
            break;
    }

    const isValidRange = _isPositionInValidRange(newPosition);
    if (!isValidRange) return;

    const isPlayer1PositionTheSame = _doesPositionMathWithPlayer1Position(newPosition);
    if (isPlayer1PositionTheSame) return;

    const isPlayer2PositionTheSame = _doesPositionMathWithPlayer2Position(newPosition);
    if (isPlayer2PositionTheSame) return;

    const ifGooglePositionTheSame = _doesPositionMathWithGooglePosition(newPosition);
    if (ifGooglePositionTheSame) {
        _catchGoogle(playerNumber);
    }

    _state.positions.players[playerIndex] = newPosition;
    _notifyObservers(EVENTS[`PLAYER${playerNumber}_MOVED`], {
        oldPosition: oldPosition,
        newPosition: newPosition
    });
}

// GETTERS / SELECTORS / QUERY
export async function getGooglePoints() {
    return _state.points.google;
}

/**
 * 
 * @param {number} playerNumber - one-based index of player  
 * @returns {Promise<number>} number of points
 */
export async function getPlayerPoints(playerNumber) {
    const playerIndex = _getPlayerIndexByNumber(playerNumber);

    // if (playerIndex < 0 || playerIndex > _state.points.players.length - 1) {
    //     throw new Error('Incorrect player number');
    // }

    return _state.points.players[playerIndex];
}

export async function getGameStatus() {
    return _state.gameStatus;
}

export async function getGridSize() {
    return {..._state.settings.gridSize};  // copy object _state.settings.gridSize
}

export async function getGooglePosition() {
    return {..._state.positions.google}
}

export async function getPlayerPosition(playerNumber) {  
    const playerIndex = _getPlayerIndexByNumber(playerNumber);

    // if (playerIndex < 0 || playerIndex > _state.positions.players.length - 1) {
    //     throw new Error('Incorrect player number');
    // }

    return {..._state.positions.players[playerIndex]};
}