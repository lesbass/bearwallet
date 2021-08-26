export default function log(level: string, message: string, context?: string): void {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ context, level, message }))
}
