import { playAgain } from "../../../core/state-manager.js";

export function WinComponent() {
    const element = document.createElement('div');

    render(element);

    return {element};
}

async function render(element) {
    const titleElement = document.createElement('h1');
    titleElement.append('You win!');

    const button = document.createElement('button');
    button.append('Play again');
    button.addEventListener('click', () => {
        playAgain();
    })
    element.append(titleElement, button);
}