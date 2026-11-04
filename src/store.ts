import { create } from "zustand";

type ConfigState = {
    color: string;
    shiny: boolean;
    tray: boolean;
    digital: boolean;
    glass: boolean;
    setColor: (color: string) => void;
    setShiny: (shiny: boolean) => void;
    setTray: (tray: boolean) => void;
    setDigital: (digital: boolean) => void;
    setGlass: (glass: boolean) => void;
};

export const useConfig = create<ConfigState>((set) => ({
    color: "#c8372d",
    shiny: true,
    tray: false,
    digital: false,
    glass: false,
    setColor: (color) => set({ color }),
    setShiny: (shiny) => set({ shiny }),
    setTray: (tray) => set({ tray }),
    setDigital: (digital) =>set({ digital }),
    setGlass: (glass) =>set({ glass }),
}));