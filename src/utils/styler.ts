import { HisonConfig } from "../types";

export const applyCssVariables = (config: HisonConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--hison-color4', '#ccddcc');
    root.style.setProperty('--hison-color5', '#9dae9d');
    root.style.setProperty('--hison-color7', '#9dae9d');

    const sizeRate = (() => {
        switch (config.size) {
          case 's': return 0.9
          case 'm': return 1
          case 'l': return 1.2
          case 'xl': return 1.3
          default: return 1
        }
    })()
    root.style.setProperty('--hison-size-rate', String(sizeRate));
    root.style.setProperty('--hison-font-family', 'Arial');
}
