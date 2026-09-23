export function convertToSliderValue(value: number): number {
  const newValue = value / 50;
  return Number(newValue.toFixed(1));
}

export function convertToSliderLabel(value: number): string {
  if (value < 17) {
    return 'am neutralsten';
  } else if (value < 35) {
    return 'etwas kreativ';
  } else if (value < 55) {
    return 'kreativer';
  } else if (value < 69) {
    return 'sehr kreativ';
  } else {
    return 'gewagt kreativ';
  }
}
