export default interface WordleConfig {
    totalPlayers: number;
    blockedPlayers: number;
    totalLoses: number;
    totalPlayed: number;
    totalWins: number;
    releaseNote: string;
    targetPlayers: PlayerType;
}

export type PlayerType = "lastWinners" | "weekBackers" | "awesomeStreakers" | "coolGamers" | "testers" | "allPlayers";