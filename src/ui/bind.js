export function bindControls(controller, elements) {
  const click = (id, fn) => document.getElementById(id).addEventListener("click", fn);

  click("SW_POWER", () => controller.togglePower());
  click("DIAL_MODE", event => controller.rotateMode(event.shiftKey ? -1 : 1));
  click("DIAL_REAR", event => controller.rotateRear(event.shiftKey ? -1 : 1));
  click("BTN_SHUTTER", () => controller.capture());
  click("BTN_AFON", () => controller.autofocus());
  click("BTN_MENU", () => controller.openMenu());
  click("BTN_Q", () => controller.openQuick());
  click("BTN_PLAY", () => controller.openPlayback());
  click("BTN_DELETE", () => controller.deleteAction());
  click("BTN_INFO", () => controller.toggleInfo());
  click("BTN_LIVE", () => controller.back());
  click("BTN_SET", () => controller.setAction());

  elements.joystick.addEventListener("pointerdown", event => {
    const rect = elements.joystick.getBoundingClientRect();
    const dx = Math.sign(event.clientX - rect.left - rect.width / 2) * 8;
    const dy = Math.sign(event.clientY - rect.top - rect.height / 2) * 8;
    controller.moveFocus(dx, dy);
    elements.joystick.animate(
      [{ transform: "translate(0)" }, { transform: `translate(${dx / 4}px,${dy / 4}px)` }, { transform: "translate(0)" }],
      { duration: 150 }
    );
  });

  elements.menuTabs.addEventListener("click", event => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    const current = Number(button.dataset.tab);
    const state = elements.store.getState();
    controller.nextMenuTab(current - state.menuTab);
  });

  document.querySelectorAll("[data-confirm]").forEach(button => {
    button.addEventListener("click", () => controller.confirmDelete(button.dataset.confirm === "delete"));
  });

  elements.reset.addEventListener("click", () => elements.store.reset());

  window.addEventListener("keydown", event => {
    if (event.target.matches("input,textarea,select")) return;
    if (event.code === "KeyP") controller.togglePower();
    if (event.code === "KeyM") controller.rotateMode();
    if (event.code === "ArrowLeft") controller.rotateRear(-1);
    if (event.code === "ArrowRight") controller.rotateRear(1);
    if (event.code === "ArrowUp") controller.moveFocus(0, -8);
    if (event.code === "ArrowDown") controller.moveFocus(0, 8);
    if (event.code === "Space") {
      event.preventDefault();
      controller.capture();
    }
    if (event.code === "Escape") controller.back();
  });
}
