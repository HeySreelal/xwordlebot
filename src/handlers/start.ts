import { Context } from "grammy";
import { getFormatedDuration } from "../helpers/date";
import WordleDB from "../services/db";

export default async function startHandler(ctx: Context) {
    const user = await WordleDB.getUser(ctx.from.id, ctx.from.first_name);
    const game = WordleDB.getToday();

    if (!game || !user) {
        ctx.replyWithChatAction("typing");
        return ctx.reply("Something went wrong. Please try again later.");
    }

    if (game.id === user.lastGame) {
        ctx.replyWithChatAction("typing");
        return ctx.reply(`Excited? But, you've already played today! Come back after ${getFormatedDuration(game.next)} for the next word! 👀`);
    }

    // If the user is already playing the game, and the game is not over.
    if (user.onGame && user.currentGame == game.id) {
        ctx.replyWithChatAction("typing");
        return ctx.reply("You are already playing the game. Shoot the guesses. 😇");
    }

    ctx.replyWithChatAction("typing");
    await ctx.reply(`Let's start the game, shoot your first guess!\n\nMeanwhile, send <code>/help</code> anytime if you want to check instructions.`, {
        parse_mode: "HTML"
    });

    user.onGame = true;
    // if the user is not playing today's game, then clear tries.
    if (user.currentGame != game.id) {
        user.currentGame = game.id;
        user.tries = [];
        user.totalGamesPlayed++;
    }
    await WordleDB.updateUser(user);
}