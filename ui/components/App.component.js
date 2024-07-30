import { SettingsComponent } from "./Settings/Settings.component.js";
import { ResultPanelComponent } from "./ResultPanel/ResultPanel.component.js";
import { GridComponent } from "./Grid/Grid.component.js";
import { LoseComponent } from "./Lose/Lose.component.js";
import { getGameStatus, subscribe } from "../../core/state-manager.js";
import { GAME_STATUSES } from "../../core/constants.js";
import { StartComponent } from "./Start/Start.component.js";

export function AppComponent() {
    const localState = { prevGameStatus: null, cleanupFunctions: [] };
    
    console.log('APP CREATING');
   
    const element = document.createElement('div');
    
    subscribe(() => {
        render(element, localState);
    });

    render(element, localState);
    
    return {element}; // {element} === {element: element}
}

async function render(element, localState) {
    console.log('APP RENDERING');

    const gameStatus = await getGameStatus();

    if (localState.prevGameStatus === gameStatus) return;
    localState.prevGameStatus = gameStatus;

    localState.cleanupFunctions.forEach(cf => cf()); // cf - Cleanup Function
    localState.cleanupFunctions = [];

    element.innerHTML = "";

    switch (gameStatus) {
        case GAME_STATUSES.SETTINGS: {
            const settingsComponent = SettingsComponent();
            const startComponent = StartComponent();
            
            element.append(settingsComponent.element, startComponent.element);
            break;
        }
        case GAME_STATUSES.IN_PROGRESS:
            const settingsComponent = SettingsComponent();
            
            const resultPanelComponent = ResultPanelComponent();
            localState.cleanupFunctions.push(resultPanelComponent.cleanup);
            
            const gridComponent = GridComponent();
            localState.cleanupFunctions.push(gridComponent.cleanup);

            element.append(settingsComponent.element, resultPanelComponent.element, gridComponent.element);
            break;
        case GAME_STATUSES.LOSE:
            const loseComponent = LoseComponent();
            
            element.append(loseComponent.element);
            break;    
        default:
            throw new Error('not implemented');
    }
}