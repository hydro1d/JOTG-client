/**
 * Format BDT minor units (poisha) to human readable Bangladeshi Taka
 * E.g. 115000 -> "৳1,150"
 */
export function formatBDT(minorUnits: number): string {
  const taka = Math.floor(minorUnits / 100);
  return `৳${taka.toLocaleString('en-IN')}`;
}

export function minorToTaka(minorUnits: number): number {
  return minorUnits / 100;
}

export function takaToMinor(taka: number): number {
  return Math.round(taka * 100);
}
