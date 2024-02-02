export function trimLiteral(value: string): string {
  return value
    .replace(/  |\n +/g, ' ')
    .trimStart()
    .trimEnd();
}
