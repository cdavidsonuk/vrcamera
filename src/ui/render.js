import { renderMenu } from "../camera-os/menuRenderer.js";

export function createRenderer(elements, events) {
  let infoVisible = true;

  events.on("info:toggle", () => {
    infoVisible = !infoVisible;
    elements.lcd.classList.toggle("minimal-info", !infoVisible);
  });

  events.on("focus:confirm", () => {
    elements.focusPoint.classList.remove("focus-confirm");
    void elements.focusPoint.offsetWidth;
    elements.focusPoint.classList.add("focus-confirm");
  });

  events.on("shutter:half", () => {
    elements.focusPoint.classList.add("focus-confirm");
  });

  events.on("shutter:full", () => {
    elements.cameraBody.classList.remove("camera-shake");
    void elements.cameraBody.offsetWidth;
    elements.cameraBody.classList.add("camera-shake");
    elements.lcd.classList.remove("flash");
    void elements.lcd.offsetWidth;
    elements.lcd.classList.add("flash");
  });

  return function render(state) {
    document.body.classList.toggle("camera-on", state.power);
    elements.power.setAttribute("aria-pressed", String(state.power));
    elements.modeLabel.textContent = state.mode;

    elements.lcdMode.textContent = state.mode;
    elements.lcdFocusMode.textContent = state.focusMode;
    elements.lcdFrames.textContent = state.framesRemaining;
    elements.lcdAperture.textContent = `F${Number(state.aperture).toFixed(state.aperture % 1 ? 1 : 0)}`;
    elements.lcdShutter.textContent = state.shutter;
    elements.lcdIso.textContent = `ISO ${state.iso}`;
    elements.focusPoint.style.left = `${state.focusX}%`;
    elements.focusPoint.style.top = `${state.focusY}%`;

    elements.bootScreen.classList.toggle("hidden", state.screen !== "boot");
    elements.shootingScreen.classList.toggle("hidden", state.screen !== "shooting");
    elements.menuScreen.classList.toggle("hidden", state.screen !== "menu");
    elements.playbackScreen.classList.toggle("hidden", state.screen !== "playback");
    elements.lcd.classList.toggle("off", state.screen === "off");

    if (state.screen === "menu") renderMenu(elements.menuScreen, state.menuIndex);

    elements.statusList.innerHTML = `
      <div><dt>Power</dt><dd>${state.power ? "On" : "Off"}</dd></div>
      <div><dt>Mode</dt><dd>${state.mode}</dd></div>
      <div><dt>Aperture</dt><dd>f/${state.aperture}</dd></div>
      <div><dt>Shutter</dt><dd>${state.shutter}</dd></div>
      <div><dt>ISO</dt><dd>${state.iso}</dd></div>
      <div><dt>Captured</dt><dd>${state.capturedFrames}</dd></div>
    `;
  };
}
