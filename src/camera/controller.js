import { CAMERA } from "./config.js";

export class CameraController {
  constructor(store, events) {
    this.store = store;
    this.events = events;
    this.modeRotation = 0;
    this.rearRotation = 0;
  }

  togglePower() {
    const s = this.store.getState();
    if (s.power) {
      this.store.setState({ power: false, screen: "off" });
      this.events.emit("help", "Camera switched off.");
      return;
    }
    this.store.setState({ power: true, screen: "boot" });
    this.events.emit("help", "Camera starting…");
    setTimeout(() => {
      if (this.store.getState().power) {
        this.store.setState({ screen: "shooting" });
        this.events.emit("help", "Camera ready.");
      }
    }, 1100);
  }

  rotateMode(direction = 1) {
    const s = this.store.getState();
    if (!s.power) return;
    const i = CAMERA.modes.indexOf(s.mode);
    const next = (i + direction + CAMERA.modes.length) % CAMERA.modes.length;
    this.modeRotation += direction * 35;
    this.events.emit("rotate:mode", this.modeRotation);
    this.store.setState({ mode: CAMERA.modes[next] });
    this.events.emit("help", `Mode changed to ${CAMERA.modes[next]}.`);
  }

  rotateRear(direction = 1) {
    const s = this.store.getState();
    if (!s.power) return;

    if (s.screen === "menu") {
      const items = CAMERA.menus[s.menuTab].items;
      this.store.setState({ menuItem: (s.menuItem + direction + items.length) % items.length });
      this.events.emit("help", items[(s.menuItem + direction + items.length) % items.length]);
    } else if (s.screen === "quick") {
      this.store.setState({ isoIndex: clamp(s.isoIndex + direction, 0, CAMERA.isoValues.length - 1) });
      this.events.emit("help", `ISO ${CAMERA.isoValues[clamp(s.isoIndex + direction, 0, CAMERA.isoValues.length - 1)]}`);
    } else {
      this.store.setState({ apertureIndex: clamp(s.apertureIndex + direction, 0, CAMERA.apertures.length - 1) });
      this.events.emit("help", `Aperture f/${CAMERA.apertures[clamp(s.apertureIndex + direction, 0, CAMERA.apertures.length - 1)]}`);
    }

    this.rearRotation += direction * 24;
    this.events.emit("rotate:rear", this.rearRotation);
  }

  moveFocus(dx, dy) {
    const s = this.store.getState();
    if (!s.power || s.screen !== "shooting") return;
    this.store.setState({
      focusX: clamp(s.focusX + dx, 10, 90),
      focusY: clamp(s.focusY + dy, 14, 86)
    });
    this.events.emit("help", "Focus point moved.");
  }

  autofocus() {
    const s = this.store.getState();
    if (!s.power || s.screen !== "shooting") return;
    this.events.emit("focus:confirm");
    this.events.emit("help", "Autofocus locked.");
  }

  capture() {
    const s = this.store.getState();
    if (!s.power || s.screen !== "shooting") return;
    this.events.emit("shutter:half");
    setTimeout(() => {
      const capture = {
        mode: s.mode,
        aperture: CAMERA.apertures[s.apertureIndex],
        shutter: CAMERA.shutters[s.shutterIndex],
        iso: CAMERA.isoValues[s.isoIndex],
        createdAt: new Date().toISOString()
      };
      const captures = [...s.captures, capture];
      this.store.setState({
        captures,
        framesRemaining: Math.max(0, s.framesRemaining - 1),
        playbackIndex: captures.length - 1
      });
      this.events.emit("shutter:full");
      this.events.emit("help", "Photograph captured.");
    }, 220);
  }

  openMenu() {
    if (!this.store.getState().power) return;
    this.store.setState({ screen: "menu", menuTab: 0, menuItem: 0 });
    this.events.emit("help", "Main menu.");
  }

  openQuick() {
    if (!this.store.getState().power) return;
    this.store.setState({ screen: "quick" });
    this.events.emit("help", "Quick settings. Rear wheel changes ISO.");
  }

  openPlayback() {
    const s = this.store.getState();
    if (!s.power) return;
    this.store.setState({ screen: "playback", playbackIndex: s.captures.length - 1 });
    this.events.emit("help", s.captures.length ? "Playback mode." : "No photographs captured.");
  }

  deleteAction() {
    const s = this.store.getState();
    if (!s.power) return;
    if (s.screen === "playback" && s.captures.length) {
      this.store.setState({ screen: "confirm" });
      this.events.emit("help", "Confirm deletion.");
    } else {
      this.back();
    }
  }

  confirmDelete(confirmed) {
    const s = this.store.getState();
    if (!confirmed) {
      this.store.setState({ screen: "playback" });
      return;
    }
    const captures = s.captures.filter((_, i) => i !== s.playbackIndex);
    this.store.setState({
      captures,
      screen: "playback",
      playbackIndex: captures.length - 1,
      framesRemaining: Math.min(999, s.framesRemaining + 1)
    });
    this.events.emit("help", "Photograph deleted.");
  }

  setAction() {
    const s = this.store.getState();
    if (!s.power) return;
    if (s.screen === "menu") {
      this.events.emit("help", `${CAMERA.menus[s.menuTab].items[s.menuItem]} selected.`);
    } else {
      this.back();
    }
  }

  nextMenuTab(direction = 1) {
    const s = this.store.getState();
    if (s.screen !== "menu") return;
    const tab = (s.menuTab + direction + CAMERA.menus.length) % CAMERA.menus.length;
    this.store.setState({ menuTab: tab, menuItem: 0 });
  }

  toggleInfo() {
    const s = this.store.getState();
    if (!s.power) return;
    this.store.setState({ infoMinimal: !s.infoMinimal });
  }

  back() {
    if (!this.store.getState().power) return;
    this.store.setState({ screen: "shooting" });
    this.events.emit("help", "Live shooting screen.");
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
