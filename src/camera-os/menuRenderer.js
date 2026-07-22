import { CAMERA_CONFIG } from "../config/camera.config.js";

export function renderMenu(container, activeIndex = 0) {
  container.innerHTML = `
    <div class="menu-tabs">
      ${CAMERA_CONFIG.menus.map((menu, index) =>
        `<button class="${index === activeIndex ? "active" : ""}" data-menu-index="${index}">${menu.title}</button>`
      ).join("")}
    </div>
    <div class="menu-list">
      ${CAMERA_CONFIG.menus[activeIndex].items.map(item => `<button>${item}<span>›</span></button>`).join("")}
    </div>
  `;
}
