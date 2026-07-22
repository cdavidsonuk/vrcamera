import { createStore } from "./core/store.js";
import { EventBus } from "./core/events.js";
import { initialCameraState } from "./camera/cameraState.js";
import { CameraController } from "./camera/cameraController.js";
import { createRenderer } from "./ui/render.js";
import { bindControls } from "./ui/bindControls.js";

const $ = id => document.getElementById(id);

const elements = {
  cameraBody: $("cameraBody"),
  lcd: $("lcd"),
  bootScreen: $("bootScreen"),
  shootingScreen: $("shootingScreen"),
  menuScreen: $("menuScreen"),
  playbackScreen: $("playbackScreen"),
  modeLabel: $("modeLabel"),
  lcdMode: $("lcdMode"),
  lcdFocusMode: $("lcdFocusMode"),
  lcdFrames: $("lcdFrames"),
  lcdShutter: $("lcdShutter"),
  lcdAperture: $("lcdAperture"),
  lcdIso: $("lcdIso"),
  focusPoint: $("focusPoint"),
  statusList: $("statusList"),
  power: $("SW_POWER"),
  mode: $("DIAL_MODE"),
  rear: $("DIAL_REAR"),
  shutter: $("BTN_SHUTTER"),
  menu: $("BTN_MENU"),
  info: $("BTN_INFO"),
  play: $("BTN_PLAY"),
  deleteButton: $("BTN_DELETE"),
  afon: $("BTN_AFON"),
  joystick: $("JOY_FOCUS"),
  live: $("BTN_LIVE"),
  reset: document.querySelector('[data-action="reset"]')
};

const store = createStore(initialCameraState);
const events = new EventBus();
const controller = new CameraController(store, events);
const render = createRenderer(elements, events);

store.subscribe(render);
bindControls(controller, elements);
