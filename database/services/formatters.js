export function booleanFormatter(trueValues, falseValues) {
  return function (value) {
    if (asArray(trueValues).includes(value)) {
      return true;
    } else if (asArray(falseValues).includes(value)) {
      return false;
    } else {
      return null;
    }
  };
}

export function asArray(value) {
  if (!Array.isArray(value)) {
    return [value];
  } else {
    return value;
  }
}
