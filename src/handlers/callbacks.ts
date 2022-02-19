import { Context } from "grammy";
import { toggleNotification } from "./notification";

const callbackHandler = (ctx: Context) => {
    const [key, value] = ctx.callbackQuery.data.split("_");
    switch (key) {
        case "notify": toggleNotification(ctx, value === "yes"); break;
        default: break;
    }

}

export default callbackHandler;