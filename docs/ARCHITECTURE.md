# Architecture

`core/store.js` owns immutable application state.
`core/events.js` handles short-lived UI events and animations.
`camera/cameraController.js` contains camera behaviour.
`camera-os/` renders LCD operating-system screens.
`ui/` binds the DOM and renders state.
`config/` contains stable modes, exposure values and menu definitions.

The permanent control IDs follow the approved camera blueprint:
BTN_MENU, BTN_INFO, BTN_PLAY, BTN_DELETE, BTN_AFON, JOY_FOCUS,
BTN_Q, DIAL_REAR, BTN_SET, BTN_LIVE, DIAL_MODE, SW_POWER,
DIAL_FRONT and BTN_SHUTTER.
