const _state = {
    settings: {
        gridSize: {
            rowsCount: 4,
            columnsCount: 4
        }
    },
    
    positions: {
        google: {x: 1, y: 1},
        players: [
            {x: 2, y: 2}, 
            {x: 3, y: 3}
        ]
    },
    
    points: {
        google: 12,
        players: [10, 11]
    }
}

function _getPlayerIndexByNumber(playerNumber) {
    const playerIndex = playerNumber - 1;

    if (playerIndex < 0 || playerIndex > _state.positions.players.length - 1) {
        throw new Error('Incorrect player number');
    }

    return playerIndex;
}

// INTERFACE/ADAPTER
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
