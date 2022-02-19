import { Context } from "grammy";
import { getFormatedDuration } from "../helpers/date";
import { gameNo } from "../helpers/word_updater";
import WordleDB from "../services/db";

export async function nextWord(ctx: Context) {
    const game = WordleDB.getToday();
    ctx.replyWithChatAction("typing");
    await ctx.reply(`New word showing up in ${getFormatedDuration(game.next)}!`);
}

export async function profileHandler(ctx: Context) {
    const user = await WordleDB.getUser(ctx.from.id, ctx.from.first_name);

    if (!user) {
        return ctx.reply("Something went wrong. Please try again later.");
    }

    ctx.replyWithChatAction("typing");
    await ctx.reply(`Hello <b>${ctx.from.first_name}</b>\n\n` +
        `🎰 Total Games Played: <b>${user.totalGamesPlayed}</b>\n\n` +
        `🔥 Current Streak: <b>${user.streak}</b>\n\n` + 
        `🎆 Highest Streak: <b>${user.maxStreak}</b>\n\n` +
        `💎 Win Percentage: <b>${user.totalWins * 100 / gameNo()}</b>\n\n` +
        `#MyWordle`, {
        parse_mode: "HTML"
    });

} 