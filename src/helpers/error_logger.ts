import { Context } from "grammy";
import { doLog } from "./utils";

export default async function handleErrorWithEase(err:any, ctx: Context, where: string) {
    doLog(`Error in ${where}: ${err}`);
    if(ctx && ctx.from) await doLog(`Error on ${where} for ${ctx.from.id}:\n\n${err}`);
}