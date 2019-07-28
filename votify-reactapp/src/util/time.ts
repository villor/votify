/**
 * Converts milliseconds to a string containing minutes and seconds mm:ss
 * Rounds to nearest second
 * @param ms 
 */
export function msToMMSS(ms: number): string {
  const totalSeconds = Math.round(ms / 1000)
  const seconds = totalSeconds % 60;
  const minutes = (totalSeconds - seconds) / 60;
  return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
