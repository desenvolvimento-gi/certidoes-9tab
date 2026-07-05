function keepOnlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

function applyOnlyNumbersMask(input) {
  input.value = keepOnlyNumbers(input.value);
}
