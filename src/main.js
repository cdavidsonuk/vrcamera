import { createStore } from "./core/store.js";
import { EventBus } from "./core/events.js";
import { initialState } from "./camera/state.js";
import { CameraController } from "./camera/controller.js";
import { createRenderer } from "./os/render.js";
import { bindControls } from "./ui/bind.js";

const $ = id => document.getElementById(id);
const store = createStore(initialState);
const events = new EventBus();
const controller = new CameraController(store, events);

const elements = {
  store,
  camera: $("camera"),
  lcd: $("lcd"),
  modeDial: $("DIAL_MODE"),
  rearWheel: $("DIAL_REAR"),
  shutterButton: $("BTN_SHUTTER"),
  joystick: $("JOY_FOCUS"),
  focusPoint: $("focusPoint"),
  focusMessage: $("focusMessage"),
  lcdMode: $("lcdMode"),
  lcdAperture: $("lcdAperture"),
  lcdShutter: $("lcdShutter"),
  lcdIso: $("lcdIso"),
  lcdFrames: $("lcdFrames"),
  status: $("status"),
  captureCount: $("captureCount"),
  controlHelp: $("controlHelp"),
  menuTabs: $("menuTabs"),
  menuTitle: $("menuTitle"),
  menuItems: $("menuItems"),
  playbackEmpty: $("playbackEmpty"),
  playbackPhoto: $("playbackPhoto"),
  playbackDetails: $("playbackDetails"),
  reset: $("resetCamera"),
  screens: {
    off: document.createElement("div"),
    boot: $("screenBoot"),
    shooting: $("screenShooting"),
    menu: $("screenMenu"),
    quick: $("screenQuick"),
    playback: $("screenPlayback"),
    confirm: $("screenConfirm")
  }
};

store.subscribe(createRenderer(elements, events));
bindControls(controller, elements);
