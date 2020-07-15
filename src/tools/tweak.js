export function tweak(param) {
  var t = param.trim();
  if (t === "false") {
    return false;
  } else if (t === "") {
    return undefined;
  } else {
    return t;
  }
}
