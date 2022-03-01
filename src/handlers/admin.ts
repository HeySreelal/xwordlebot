import { Context } from "grammy";
import { admins } from "../config/config";
import handleErrorWithEase from "../helpers/error_logger";
import { doLog } from "../helpers/utils";
import WordleAnalytics from "../services/analytics";
import WordleDB from "../services/db";

export default class AdminHandlers {
    static async getAnalytics(ctx: Context): Promise<void> {
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }
            ctx.replyWithChatAction("typing");
            const config = await WordleDB.getConfigs();
            const reply = await WordleAnalytics.getDaily(config);
            await ctx.reply(reply, {
                parse_mode: "HTML"
            });
        } catch (err) {
            handleErrorWithEase(err, ctx, "getAnalytics/admin");
        }
    }
}