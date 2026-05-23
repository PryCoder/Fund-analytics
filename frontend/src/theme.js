import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    body: "Inter, system-ui, -apple-system, sans-serif",
    heading: "Montserrat, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
});
