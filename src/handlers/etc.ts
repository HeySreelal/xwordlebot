import { Context } from "grammy";
import { errors, excitedMessages } from "../config/strings";
import { getFormatedDuration } from "../helpers/date";
import handleErrorWithEase from "../helpers/error_logger";
import { random } from "../helpers/utils";
import WordleDB from "../services/db";

export async function nextWord(ctx: Context) {
    const game = WordleDB.getToday();
    ctx.replyWithChatAction("typing");
    ctx.replyWithChatAction("typing");
    const msg = random(excitedMessages)
        .replace('{TIME}', getFormatedDuration(game.next));
    await ctx.reply(msg);
}

export async function profileHandler(ctx: Context) {
    try {
        const user = await WordleDB.getUser(ctx.from.id, ctx.from.first_name);

        if (!user) {
            return ctx.reply(errors.something_went_wrong);
        }

        ctx.replyWithChatAction("typing");
        await ctx.reply(`Hello <b>${ctx.from.first_name}</b>\n\n` +
            `🎰 Total Games Played: <b>${user.totalGamesPlayed}</b>\n\n` +
            `🔥 Current Streak: <b>${user.streak}</b>\n\n` +
            `🎆 Highest Streak: <b>${user.maxStreak}</b>\n\n` +
            `💎 Win Percentage: <b>${(user.totalWins * 100 / user.totalGamesPlayed).toFixed(2)}</b>\n\n` +
            `#MyWordle`, {
            parse_mode: "HTML"
        });
    } catch (err) {
        handleErrorWithEase(err, ctx, 'profileHandler');
    }
} 