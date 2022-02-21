import { Context } from "grammy";
import { aboutMessage, helpMessage } from "../config/strings";

const helpHandler = async (ctx: Context) => {
    ctx.replyWithChatAction("typing");
    await ctx.reply(helpMessage, {
        parse_mode: "HTML"
    });
}

const aboutHandler = async (ctx: Context) => {
    ctx.replyWithChatAction("typing");
    await ctx.reply(aboutMessage, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
    });
}

export default helpHandler;
export { aboutHandler };
