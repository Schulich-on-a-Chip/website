import { createLiquidGlass } from "./vendor/liquid-glass.js";

// Refraction follows each control's real dimensions and rounded edge.
// The vendor engine supplies the blur fallback outside Chromium.
const optics = {
  scale: 18,
  band: 0.65,
  blur: 2.5,
  sat: 1.15,
  aberration: 0.025,
  lens: 1,
};
let docks;
let controls;
let pageControls;

export function refreshGlass() {
  docks ??= createLiquidGlass(".primary-nav, .contact-dock", optics);
  controls ??= createLiquidGlass(".home-button", {
    ...optics,
    scale: 10,
    blur: 1.5,
  });
  pageControls?.destroy();
  pageControls = createLiquidGlass("main .button, main .dock-support", {
    ...optics,
    scale: 12,
    blur: 2,
  });
}

// Font metrics affect lens geometry, especially the sponsor button.
document.fonts.ready.then(() => {
  docks?.rebuild();
  controls?.rebuild();
  pageControls?.rebuild();
});
