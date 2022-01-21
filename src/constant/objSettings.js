export const footH = 60
export const seaBgObj = {
  w: 390,
  h: 844,
}
export const shipLightObj = {
  w: 165,
  h: 190,
}
export const shipObj = {
  w: 57,
  h: 111,
  // oW: (390 / 2).toFixed(0),
  // oH: 844 - (111 / 2).toFixed(0) - 60,
  oW: (seaBgObj.w / 2).toFixed(0),
  oH: seaBgObj.h - (111 / 2).toFixed(0) - footH,
}
