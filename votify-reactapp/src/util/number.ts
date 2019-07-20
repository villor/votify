/**
 * Generates a random integer
 * @param min minimum value (inclusive)
 * @param max maximum value (inclusive)
 */
export function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
