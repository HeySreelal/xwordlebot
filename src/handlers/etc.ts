import { Context } from "grammy";
import { errors, excitedMessages } from "../config/strings";
import { getFormatedDuration } from "../helpers/date";
import handleErrorWithEase from "../helpers/error_logger";
import profileDetails from "../helpers/profile";
import { doLog, random, sleep } from "../helpers/utils";
import WordleDB from "../services/db";
import AdminHandlers from "./admin";

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
        await ctx.reply(`Hello <b>${user.name}</b>\n\n` + profileDetails(user) + `#MyWordle`, {
            parse_mode: "HTML"
        });
    } catch (err) {
        handleErrorWithEase(err, ctx, 'profileHandler');
    }
}

export async function letmeBeATester(ctx: Context) {
    try {
        const user = await WordleDB.getUser(ctx.from.id, ctx.from.first_name);
        if (user.role == "Tester") {
            return ctx.reply(`You are already a Tester! 🧛`);
        } else if (user.role == "Pending") {
            doLog(`Impatient tester <code>${user.id}</code> 👨🏻‍💻`);
            return ctx.reply(`You have already applied for Tester status! Please wait for the admin to approve you. 👨🏻‍💻`);
        }
        
        await AdminHandlers.postTesterRequest(ctx, user);

        user.role = "Pending";
        await WordleDB.updateUser(user);

        await ctx.replyWithChatAction("typing");
        await sleep(200);
        ctx.reply(`You have sent a request to be a tester!`);
    } catch (err) {
        handleErrorWithEase(err, ctx, 'letmeBeATester');
    }
}