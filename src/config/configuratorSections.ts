export const CONFIGURATOR_SECTIONS = [
    { id: "color", label: "Color" },
    { id: "finish", label: "Finish" },
    { id: "trays", label: "Trays" },
    { id: "interface", label: "Interface" },
    { id: "glass", label: "Glass" },
] as const;

export type ConfiguratorSection =
    (typeof CONFIGURATOR_SECTIONS)[number]["id"];
