import { MOVING_DIRECTIONS } from "../../../core/constants.js";
import { getGridSize, movePlayer, subscribe, unsubscribe } from "../../../core/state-manager-proxy.js";
import { CellComponent } from "./Cell/Cell.component.js";

export function GridComponent() {
    // console.log('GRID CREATING');
    
    const localState = { cleanupFunctions: [] };

    const keyupObserver = (e) => {
        console.log(e.code);
        switch (e.code) {
            case 'ArrowUp': movePlayer(1, MOVING_DIRECTIONS.UP); break;
            case 'ArrowDown': movePlayer(1, MOVING_DIRECTIONS.DOWN); break;
            case 'ArrowLeft': movePlayer(1, MOVING_DIRECTIONS.LEFT); break;
            case 'ArrowRight': movePlayer(1, MOVING_DIRECTIONS.RIGHT); break;

            case 'KeyW': movePlayer(2, MOVING_DIRECTIONS.UP); break;
            case 'KeyS': movePlayer(2, MOVING_DIRECTIONS.DOWN); break;
            case 'KeyA': movePlayer(2, MOVING_DIRECTIONS.LEFT); break;
            case 'KeyD': movePlayer(2, MOVING_DIRECTIONS.RIGHT); break;
        }
    }

    document.addEventListener('keyup', keyupObserver);

    const element = document.createElement('table');
    element.classList.add('grid');


    // const observer = () => {
    //     render(element);
    // };

    // subscribe(observer);

    render(element, localState);

    return {element, cleanup: () => {
        localState.cleanupFunctions.forEach(cf => cf());
        document.removeEventListener('keyup', keyupObserver) 
    }};
}

async function render(element, localState) {
    // console.log('GRID RENDERING');

    localState.cleanupFunctions.forEach(cf => cf());
    localState.cleanupFunctions = [];

    element.innerHTML = "";

    const gridSizePromise = getGridSize();
    const gridSize = await gridSizePromise;

    for (let y = 0; y < gridSize.rowsCount; y++) {
        const rowElement = document.createElement('tr');

        for (let x = 0; x < gridSize.columnsCount; x++) {
            
            const cellComponent = CellComponent(x, y);
            localState.cleanupFunctions.push(cellComponent.cleanup);

            rowElement.append(cellComponent.element);
        }

        element.append(rowElement);
    }

    console.log("+++++++++++++++++++++++++++");
}