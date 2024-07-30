import { getGridSize, subscribe, unsubscribe } from "../../../core/state-manager.js";
import { CellComponent } from "./Cell/Cell.component.js";

export function GridComponent() {
    const element = document.createElement('table');
    element.classList.add('grid');

    console.log('GRID CREATING');

    const observer = () => {
        render(element);
    };

    subscribe(observer);

    render(element);

    return {element, cleanup: () => {
        console.log('GRID cleanup call');
        unsubscribe(observer)
    }};
}

async function render(element) {
    console.log('GRID RENDERING');

    element.innerHTML = "";

    const gridSizePromise = getGridSize();
    const gridSize = await gridSizePromise;

    for (let y = 0; y < gridSize.rowsCount; y++) {
        const rowElement = document.createElement('tr');

        for (let x = 0; x < gridSize.columnsCount; x++) {
            const cellComponent = CellComponent(x, y);
            rowElement.append(cellComponent.element);
        }

        element.append(rowElement);
    }
}