import { CAMERA } from "../camera/config.js";

export function createRenderer(elements, events) {
  events.on("rotate:mode", value => elements.modeDial.style.transform = `rotate(${value}deg)`);
  events.on("rotate:rear", value => elements.rearWheel.style.transform = `rotate(${value}deg)`);
  events.on("help", text => elements.controlHelp.textContent = text);

  events.on("focus:confirm", () => {
    elements.focusPoint.classList.remove("confirmed");
    void elements.focusPoint.offsetWidth;
    elements.focusPoint.classList.add("confirmed");
    elements.focusMessage.classList.add("visible");
    setTimeout(() => elements.focusMessage.classList.remove("visible"), 650);
  });

  events.on("shutter:half", () => {
    elements.shutterButton.classList.add("pressed");
    elements.focusPoint.classList.add("confirmed");
  });

  events.on("shutter:full", () => {
    elements.shutterButton.classList.remove("pressed");
    elements.camera.classList.remove("capture");
    void elements.camera.offsetWidth;
    elements.camera.classList.add("capture");
  });

  return state => {
    const aperture = CAMERA.apertures[state.apertureIndex];
    const shutter = CAMERA.shutters[state.shutterIndex];
    const iso = CAMERA.isoValues[state.isoIndex];

    elements.lcd.classList.toggle("lcd-off", state.screen === "off");
    for (const [name, node] of Object.entries(elements.screens)) {
      node.classList.toggle("hidden", state.screen !== name);
    }

    elements.lcdMode.textContent = state.mode;
    elements.lcdAperture.textContent = `F${Number(aperture).toFixed(aperture % 1 ? 1 : 0)}`;
    elements.lcdShutter.textContent = shutter;
    elements.lcdIso.textContent = `ISO ${iso}`;
    elements.lcdFrames.textContent = state.framesRemaining;
    elements.focusPoint.style.left = `${state.focusX}%`;
    elements.focusPoint.style.top = `${state.focusY}%`;
    elements.lcd.classList.toggle("minimal", state.infoMinimal);
    elements.captureCount.textContent = state.captures.length;

    elements.status.innerHTML = `
      <div><dt>Power</dt><dd>${state.power ? "On" : "Off"}</dd></div>
      <div><dt>Screen</dt><dd>${state.screen}</dd></div>
      <div><dt>Mode</dt><dd>${state.mode}</dd></div>
      <div><dt>Aperture</dt><dd>f/${aperture}</dd></div>
      <div><dt>Shutter</dt><dd>${shutter}</dd></div>
      <div><dt>ISO</dt><dd>${iso}</dd></div>
      <div><dt>Captured</dt><dd>${state.captures.length}</dd></div>`;

    renderMenu(state, elements);
    renderQuick(state, elements, aperture, shutter, iso);
    renderPlayback(state, elements);
  };
}

function renderMenu(state, e) {
  if (state.screen !== "menu") return;
  e.menuTabs.innerHTML = CAMERA.menus.map((menu, index) =>
    `<button data-tab="${index}" class="${index === state.menuTab ? "active" : ""}">${menu.title}</button>`
  ).join("");
  e.menuTitle.textContent = CAMERA.menus[state.menuTab].title;
  e.menuItems.innerHTML = CAMERA.menus[state.menuTab].items.map((item, index) =>
    `<button class="${index === state.menuItem ? "selected" : ""}">${item}<span>›</span></button>`
  ).join("");
}

function renderQuick(state, e, aperture, shutter, iso) {
  if (state.screen !== "quick") return;
  e.screens.quick.innerHTML = `
    <h3>Quick settings</h3>
    <div class="quick-grid">
      <button><span>Aperture</span><b>f/${aperture}</b></button>
      <button><span>Shutter</span><b>${shutter}</b></button>
      <button class="active"><span>ISO</span><b>${iso}</b></button>
      <button><span>Focus</span><b>${state.focusMode}</b></button>
      <button><span>Drive</span><b>${state.driveMode}</b></button>
      <button><span>White balance</span><b>Auto</b></button>
    </div>`;
}

function renderPlayback(state, e) {
  const empty = !state.captures.length;
  e.playbackEmpty.classList.toggle("hidden", !empty);
  e.playbackPhoto.classList.toggle("hidden", empty);
  if (!empty) {
    const photo = state.captures[state.playbackIndex] ?? state.captures.at(-1);
    e.playbackDetails.textContent = `${photo.mode} · ${photo.shutter} · f/${photo.aperture} · ISO ${photo.iso}`;
  }
}
