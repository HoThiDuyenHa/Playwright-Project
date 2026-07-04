export function printLog(message: string): void {
  console.log(`[LOG] [${new Date().toISOString()}] ${message}`);
}
