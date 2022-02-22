import { Context } from "grammy";
import { errors, excitedMessages, inGameMessages } from "../config/strings";
import { getFormatedDuration } from "../helpers/date";
import { random } from "../helpers/utils";
import WordleDB from "../services/db";

/**
 * **startHandler**
 * 
 * Handler for the /start command.
 * @param {Context} ctx - Telegram context
 */
export default async function startHandler(ctx: Context) {
    const user = await WordleDB.getUser(ctx.from.id, ctx.from.first_name);
    const game = WordleDB.getToday();

    if (!game || !user) {
        ctx.replyWithChatAction("typing");
        return ctx.reply(errors.something_went_wrong);
    }

    if (game.id === user.lastGame) {
        ctx.replyWithChatAction("typing");
        const msg = random(excitedMessages)
            .replace('{TIME}', getFormatedDuration(game.next));
        return ctx.reply(msg);
    }

    // If the user is already playing the game, and the game is not over.
    if (user.onGame && user.currentGame == game.id) {
        ctx.replyWithChatAction("typing");
        return ctx.reply(inGameMessages.already);
    }

    ctx.replyWithChatAction("typing");
    await ctx.reply(inGameMessages.letsStart, {
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