import { Context } from "grammy";
import AdminHandlers from "./admin";

/**
 * ! WARNING
 * 
 * This is actually a dump idea! 
 * I'll change this as soon as I have time.
 */
class WordleFilters {
    static adminFilters(ctx: Context) {
        if (!ctx.message || !ctx.message.reply_to_message || !ctx.message.reply_to_message.text) return false;
        switch (ctx.message.reply_to_message.text) {  
            case AdminHandlers.prompts.setRelease: return true;
            default: return false;
        }
    }

    static adminFilterHandlers(ctx: Context) {
        switch (ctx.message.reply_to_message.text) {
            case AdminHandlers.prompts.setRelease: AdminHandlers.setReleaseNote(ctx); break;
            default: return false;
        }
    }
}

export default WordleFilters;