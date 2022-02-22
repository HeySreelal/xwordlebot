import { doLog } from "../helpers/utils";
import { gameNo } from "../helpers/word_updater";
import WordleConfig from "../models/types";
import WordleDB from "./db";

export default class WordleAnalytics {
    static async sendDaily(config: WordleConfig) {
        const peeps = Object.values(config.players);
        const playedCount = peeps.filter(e => e.lastGame == gameNo() - 1).length;
        const succeedCount = await WordleDB.succeedPeople();
        const failedCount = playedCount - succeedCount;
        const blockedCount = config.blockedPlayers;
        const totalCount = peeps.length;

        const msg = `<b>Wordle Analytics</b> 📊` +
            `\n\n<b>Game No:</b> ${gameNo() - 1}` +
            `\n\n<b>Total Players:</b> ${totalCount}` +
            `\n<b>Played:</b> ${playedCount}` +
            `\n<b>Succeed:</b> ${succeedCount}` +
            `\n<b>Half Way:</b> ${failedCount}` +
            `\n<b>Blocked:</b> ${blockedCount}` +
            `\n\n#Analytics 📊`;

        await doLog(msg);
    }
}