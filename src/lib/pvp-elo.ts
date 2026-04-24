const K = 32;

export function calculateElo(
  winnerRating: number,
  loserRating: number
): { newWinner: number; newLoser: number } {
  const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLoser = 1 - expectedWinner;

  return {
    newWinner: Math.round(winnerRating + K * (1 - expectedWinner)),
    newLoser: Math.round(loserRating + K * (0 - expectedLoser)),
  };
}
