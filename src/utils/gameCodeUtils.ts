export function generateGameCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `TMB-${digits}`;
}

export function sanitizeName(name: string): string {
  return name.trim().replace(/[<>]/g, '').slice(0, 24) || 'Player';
}
