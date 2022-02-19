import { Context } from "grammy";
import WordleDB from "../services/db";

const notificationHandler = async (ctx: Context) => {
    ctx.replyWithChatAction("typing");
    await ctx.reply("Do you want to receive notifications when new word is available?", {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Yes 🚀", callback_data: "notify_yes" },
                    { text: "No 🔕", callback_data: "notify_no" }
                ],
            ],
        }
    });
}

export const toggleNotification = async (ctx: Context, shouldNotify: boolean) => {
    await WordleDB.toggleNotification(ctx.from.id, shouldNotify);
    ctx.replyWithChatAction("typing");
    await ctx.reply(`You will ${shouldNotify ? "receive" : "not receive"} notifications when new word is available.`);
    await ctx.answerCallbackQuery("Notification settings updated.");
    await ctx.editMessageReplyMarkup({
        reply_markup: {
            inline_keyboard: [
                shouldNotify ? [
                    { text: "Enabled ✅", callback_data: "notify_no" },
                ] : [
                    { text: "Disabled ⚠️", callback_data: "notify_yes" },
                ]
            ]   
        }
    })
}

export default notificationHandler;