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

export function chromosomeFormatter() {
  return function (value) {
    if (value && !value.toString().startsWith('chr')) {
      return 'chr' + value;
    }
    return value;
  };
}

export function platformFormatter(platformMap) {
  return function (value) {
    return platformMap[value] || value;
  };
}

export function ageRangeMidpointFormatter() {
  return function (value) {
    if (typeof value === "number") {
      return value;
    }

    const ageRange = value?.toString().trim();
    const closedRange = ageRange?.match(/^(\d+)\s*-\s*(\d+)$/);
    if (closedRange) {
      return Math.round((Number(closedRange[1]) + Number(closedRange[2])) / 2);
    }

    const lowerBound = ageRange?.match(/^(\d+)\+$/);
    if (lowerBound) {
      return Number(lowerBound[1]);
    }

    const upperBound = ageRange?.match(/^<(\d+)$/);
    if (upperBound) {
      return Number(upperBound[1]) - 1;
    }

    return null;
  };
}

export function ageRangeMinFormatter() {
  return function (value) {
    const ageRange = value?.toString().trim();
    const closedRange = ageRange?.match(/^(\d+)\s*-\s*(\d+)$/);
    if (closedRange) return Number(closedRange[1]);

    const lowerBound = ageRange?.match(/^(\d+)\+$/);
    if (lowerBound) return Number(lowerBound[1]);

    const upperBound = ageRange?.match(/^<(\d+)$/);
    if (upperBound) return 0;

    return null;
  };
}

export function ageRangeMaxFormatter() {
  return function (value) {
    const ageRange = value?.toString().trim();
    const closedRange = ageRange?.match(/^(\d+)\s*-\s*(\d+)$/);
    if (closedRange) return Number(closedRange[2]);

    const lowerBound = ageRange?.match(/^(\d+)\+$/);
    if (lowerBound) return 120;

    const upperBound = ageRange?.match(/^<(\d+)$/);
    if (upperBound) return Number(upperBound[1]) - 1;

    return null;
  };
}
