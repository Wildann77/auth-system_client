import culori from "culori";

const hexes = {
  primary: "#2B5D3A",
  secondary: "#4A90E2",
  accent: "#F5A623"
};

for (const [name, hex] of Object.entries(hexes)) {
  const oklch = culori.converter("oklch")(hex);
  console.log(`${name}: oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(4)})`);
}
