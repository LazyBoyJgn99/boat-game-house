export const footH = 120
export const seaBgObj = {
  w: 750,
  h: 1334,
}
export const shipLightObj = {
  w: 330,
  h: 380,
}
export const shipObj = {
  w: 114,
  h: 222,
  oW: (seaBgObj.w / 2).toFixed(0),
  oH: seaBgObj.h - (222 / 2).toFixed(0) - footH,
}
