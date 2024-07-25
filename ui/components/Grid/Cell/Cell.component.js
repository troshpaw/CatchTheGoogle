import { getGooglePosition, getPlayerPosition } from "../../../../core/state-manager.js";
import { GoogleComponent } from "../../common/Google/Google.component.js";
import { PlayerComponent } from "../../common/Player/Player.component.js";

export function CellComponent(x, y) {
    const element = document.createElement('td');
    
    render(element, x, y);

    return {element};
}

async function render(element, x, y) {

    const googlePosition = await getGooglePosition();

    if (googlePosition.x === x && googlePosition.y === y) {
        element.append(GoogleComponent().element);
    }

    const playerPosition = await getPlayerPosition(1);
    
    if (playerPosition.x === x && playerPosition.y === y) {
        element.append(PlayerComponent().element);
    }
}