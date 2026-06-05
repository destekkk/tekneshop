export function isValidTcKimlikNo(tc: string): boolean {
  const normalized = tc.replace(/\s/g, "");
  if (!/^\d{11}$/.test(normalized)) return false;
  if (normalized[0] === "0") return false;

  const d = normalized.split("").map(Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  const digit10 = (((odd * 7) - even) % 10 + 10) % 10;
  if (digit10 !== d[9]) return false;

  const digit11 = d.slice(0, 10).reduce((sum, n) => sum + n, 0) % 10;
  return digit11 === d[10];
}

export function maskTcKimlikNo(tc: string) {
  if (tc.length !== 11) return tc;
  return `${tc.slice(0, 3)}*****${tc.slice(-2)}`;
}
