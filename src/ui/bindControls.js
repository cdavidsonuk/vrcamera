export function bindControls(controller, elements) {
  elements.power.addEventListener("click", () => controller.togglePower());
  elements.mode.addEventListener("click", () => controller.cycleMode());
  elements.rear.addEventListener("click", event => controller.turnRearDial(event.shiftKey ? -1 : 1));
  elements.menu.addEventListener("click", () => controller.openMenu());
  elements.info.addEventListener("click", () => controller.toggleInfo());
  elements.play.addEventListener("click", () => controller.openPlayback());
  elements.deleteButton.addEventListener("click", () => controller.closeOverlay());
  elements.afon.addEventListener("click", () => controller.autofocus());
  elements.live.addEventListener("click", () => controller.closeOverlay());
  elements.shutter.addEventListener("click", () => controller.capture());
  elements.reset.addEventListener("click", () => controller.reset());

  elements.joystick.addEventListener("pointerdown", event => {
    const rect = elements.joystick.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    controller.moveFocus(Math.sign(x) * 8, Math.sign(y) * 8);
  });

  window.addEventListener("keydown", event => {
    if (event.target instanceof HTMLInputElement) return;
    if (event.code === "KeyP") controller.togglePower();
    if (event.code === "KeyM") controller.cycleMode();
    if (event.code === "ArrowLeft") controller.turnRearDial(-1);
    if (event.code === "ArrowRight") controller.turnRearDial(1);
    if (event.code === "ArrowUp") controller.moveFocus(0, -8);
    if (event.code === "ArrowDown") controller.moveFocus(0, 8);
    if (event.code === "Space") {
      event.preventDefault();
      controller.capture();
    }
    if (event.code === "Escape") controller.closeOverlay();
  });
}
