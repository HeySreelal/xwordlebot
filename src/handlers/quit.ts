import { Context } from "grammy";
import { errors, inGameMessages } from "../config/strings";
import { getFormatedDuration } from "../helpers/date";
import WordleDB from "../services/db";

export default async function quitHandler(ctx:Context) {
    const game = WordleDB.getToday();
    const user = await  WordleDB.getUser(ctx.from.id, ctx.from.first_name);

    if (!game || !user) {
        return ctx.reply(errors.something_went_wrong);
    }

    if (!user.onGame) {
        return ctx.reply(inGameMessages.notOnGame);
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
    await ctx.reply(`See ya with the next word on ${getFormatedDuration(game.next)}!`);
}