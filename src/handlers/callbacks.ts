import { Context } from "grammy";
import { PlayerType } from "../models/types";
import AdminHandlers from "./admin";
import { toggleNotification } from "./notification";

const callbackHandler = (ctx: Context) => {
    const [key, value] = ctx.callbackQuery.data.split("_");
    switch (key) {
        case "notify": toggleNotification(ctx, value === "yes"); break;
        case "release": AdminHandlers.release(ctx, value == "yes"); break;
        case "targetPlayers": AdminHandlers.setTargetPlayers(ctx, value as PlayerType); break;
        case "testerRequest": AdminHandlers.testerRequest(ctx, value); break;
        default: break;
    }

}

export default callbackHandler;