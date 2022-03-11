import User from "../models/user";

export default function profileDetails(user: User): string {
    return `🎰 Total Games Played: <b>${user.totalGamesPlayed}</b>\n\n` +
        `🎉 Total Games Won: <b>${user.totalWins}</b>\n\n` +
        `🔥 Current Streak: <b>${user.streak}</b>\n\n` +
        `🎆 Highest Streak: <b>${user.maxStreak}</b>\n\n` +
        `💎 Win Percentage: <b>${(user.totalWins * 100 / user.totalGamesPlayed).toFixed(2)}</b>\n\n`
}