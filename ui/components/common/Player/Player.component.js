export function PlayerComponent() {
    const element = document.createElement('img');
    
    render(element);

    return {element};
}

async function render(element) {
    element.src = "assets/images/player1.png";
}