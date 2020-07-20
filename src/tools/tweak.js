export function tweak(param) {
  const t = param.trim();

  if (t === "false") {
    return false;
  }

  if (t === "") {
    return undefined;
  }

  return t;
}
