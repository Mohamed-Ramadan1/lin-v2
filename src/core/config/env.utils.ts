export function getEnvFilePaths(): string[] {
  const environment = process.env.NODE_ENV ?? 'development';

  return [`.env.${environment}`, '.env'];
}

export function toNumber(
  value: number | string | undefined,
  fallback: number,
): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}
