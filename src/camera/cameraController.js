import { CAMERA_CONFIG } from "../config/camera.config.js";

export class CameraController {
  constructor(store, events) {
    this.store = store;
    this.events = events;
  }

  togglePower() {
    const state = this.store.getState();
    if (state.power) {
      this.store.setState({ power: false, booting: false, screen: "off" });
      return;
    }

    this.store.setState({ power: true, booting: true, screen: "boot" });
    window.setTimeout(() => {
      if (this.store.getState().power) {
        this.store.setState({ booting: false, screen: "shooting" });
      }
    }, 1100);
  }

  cycleMode() {
    if (!this.store.getState().power) return;
    const current = this.store.getState().mode;
    const index = CAMERA_CONFIG.modes.indexOf(current);
    this.store.setState({ mode: CAMERA_CONFIG.modes[(index + 1) % CAMERA_CONFIG.modes.length] });
  }

  turnRearDial(direction) {
    if (!this.store.getState().power) return;
    const state = this.store.getState();
    const values = CAMERA_CONFIG.apertures;
    const current = values.indexOf(state.aperture);
    const next = Math.min(values.length - 1, Math.max(0, current + direction));
    this.store.setState({ aperture: values[next] });
    this.events.emit("dial:rear", direction);
  }

  openMenu() {
    if (!this.store.getState().power) return;
    this.store.setState({ screen: "menu" });
  }

  toggleInfo() {
    if (!this.store.getState().power) return;
    this.events.emit("info:toggle");
  }

  openPlayback() {
    if (!this.store.getState().power) return;
    this.store.setState({ screen: "playback" });
  }

  closeOverlay() {
    const state = this.store.getState();
    if (state.power) this.store.setState({ screen: "shooting" });
  }

  autofocus() {
    if (!this.store.getState().power) return;
    this.events.emit("focus:confirm");
  }

  moveFocus(dx, dy) {
    const state = this.store.getState();
    if (!state.power) return;
    this.store.setState({
      focusX: Math.min(88, Math.max(12, state.focusX + dx)),
      focusY: Math.min(82, Math.max(18, state.focusY + dy))
    });
  }

  capture() {
    const state = this.store.getState();
    if (!state.power || state.screen !== "shooting") return;
    this.events.emit("shutter:half");
    window.setTimeout(() => {
      this.events.emit("shutter:full");
      this.store.setState({
        framesRemaining: Math.max(0, state.framesRemaining - 1),
        capturedFrames: state.capturedFrames + 1
      });
    }, 180);
  }

  reset() {
    this.store.reset();
  }
}
