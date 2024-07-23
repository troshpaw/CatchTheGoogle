import { SettingsComponent } from "./Settings/Settings.component.js";
import { ResultPanelComponent } from "./ResultPanel/ResultPanel.component.js";
import { GridComponent } from "./Grid/Grid.component.js";

export function AppComponent() {
    const element = document.createElement('div');
    
    render(element);
    
    return {element}; // {element} === {element: element}
}

async function render(element) {
    const settingsComponent = SettingsComponent();
    const resultPanelComponent = ResultPanelComponent(1);
    const gridComponent = GridComponent(2);

    element.append(settingsComponent.element, resultPanelComponent.element, gridComponent.element);
}