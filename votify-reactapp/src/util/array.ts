export const chunk = <T>(arr: T[], maxChunkSize: number): T[][] => 
  arr.reduce((chunks: T[][], current: any, currentIndex: number, array: T[]) => 
    !(currentIndex % maxChunkSize) ? chunks.concat([array.slice(currentIndex, currentIndex + maxChunkSize)]) : chunks, [])
  
