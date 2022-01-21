export const footH = 60
export const seaBgOgj = {
  w: 390,
  h: 844,
}
export const shipLightObj = {
  w: 165,
  h: 190,
}
export const shipOgj = {
  w: 57,
  h: 111,
  oW: (shipLightObj.w / 2).toFixed(0),
  oH: seaBgOgj.h - (shipLightObj.h / 2).toFixed(0) - footH,
}
