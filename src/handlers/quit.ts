import { Context } from "grammy";
import { getFormatedDuration } from "../helpers/date";
import WordleDB from "../services/db";

export default async function quitHandler(ctx:Context) {
    const game = WordleDB.getToday();
    const user = await  WordleDB.getUser(ctx.from.id, ctx.from.first_name);

    if (!game || !user) {
        return ctx.reply("Something went wrong. Please try again later.");
    }

    if (!user.onGame) {
        return ctx.reply("You are not currently playing the game. 😇");
    }

    user.onGame = false;
    user.lastGame = game.id;
    user.streak = 0;
    user.tries = [];

    await WordleDB.updateUser(user);

    ctx.replyWithChatAction("typing");
    await ctx.reply(`The word was <b>${game.word.toUpperCase()}</b>!`, {
        parse_mode: "HTML"
    });
    await ctx.reply(`See ya with the next word in ${getFormatedDuration(game.next)}!`);
}