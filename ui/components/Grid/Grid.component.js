import { getGridSize } from "../../../core/state-manager.js";

export function GridComponent() {
    const element = document.createElement('table');
    element.classList.add('grid');

    render(element);

    return {element};
}

async function render(element) {

    /* const gridSize = await getGridSize */
    const gridSizePromise = getGridSize();
    const gridSize = await gridSizePromise;

    for (let y = 0; y < gridSize.rowsCount; y++) {
        const rowElement = document.createElement('tr');

        for (let x = 0; x < gridSize.columnsCount; x++) {
            const cellElement = document.createElement('td');
            
            cellElement.append(`${x}, ${y}`);
            rowElement.append(cellElement);
        }

        element.append(rowElement);
    }
}