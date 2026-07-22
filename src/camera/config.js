export const CAMERA = {
  modes: ["M", "Av", "Tv", "P", "B", "SCN", "AUTO"],
  apertures: [1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16, 22],
  shutters: ["30″","15″","8″","4″","2″","1″","1/2","1/4","1/8","1/15","1/30","1/60","1/125","1/250","1/500","1/1000","1/2000","1/4000","1/8000"],
  isoValues: [100, 200, 400, 800, 1600, 3200, 6400],
  menus: [
    { title: "Shooting", items: ["Image quality", "White balance", "Picture style", "Drive mode"] },
    { title: "Autofocus", items: ["AF operation", "AF area", "Subject tracking", "Eye detection"] },
    { title: "Playback", items: ["Image review", "Histogram", "Highlight alert", "Rotate image"] },
    { title: "Setup", items: ["Display brightness", "Date and time", "Format card", "Reset camera"] },
    { title: "Custom", items: ["Button mapping", "Dial direction", "Focus point colour", "My Menu"] }
  ],
  quickItems: ["Aperture", "Shutter", "ISO", "Focus mode", "Drive mode", "White balance"]
};
