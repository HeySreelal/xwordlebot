import { Context } from "grammy";
import { getFormatedDuration } from "../helpers/date";
import WordleDB from "../services/db";

export default async function startHandler(ctx: Context) {
    const user = await WordleDB.getUser(ctx.from.id, ctx.from.first_name);
    const game = await WordleDB.getToday();

    if (!game || !user) {
        ctx.replyWithChatAction("typing");
        return ctx.reply("Something went wrong. Please try again later.");
    }

    if (game.id === user.lastGame) {
        ctx.replyWithChatAction("typing");
        return ctx.reply(`Excited? But, you've already played today! Come back after ${getFormatedDuration(game.next)} for the next word! 👀`);
    }

    if (user.tries.length > 5) {
        ctx.replyWithChatAction("typing");
        return ctx.reply(`You have exceeded the maximum number of tries!`);
    }

    ctx.replyWithChatAction("typing");
    await ctx.reply(`Let's start the game, shoot your first guess!\n\nMeanwhile, send <code>/help</code> anytime if you want to check instructions.`, {
        parse_mode: "HTML"
    });
    await WordleDB.startGame(user.id);
}