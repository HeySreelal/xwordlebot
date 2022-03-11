import { doLog } from "../helpers/utils";
import { gameNo } from "../helpers/word_updater";
import WordleConfig from "../models/types";
import WordleDB from "./db";

export default class WordleAnalytics {
    static async sendDaily(config: WordleConfig) {
        const msg = await this.getDaily(config);
        await doLog(msg);
        await WordleDB.resetAnalytics();
    }

    static async getDaily(config: WordleConfig) {
        const peeps = config.totalPlayers;
        const playedCount = config.totalPlayed;
        const succeedCount = config.totalWins;
        const losesCount = config.totalLoses;
        const halfWay = playedCount - succeedCount - losesCount;
        const blockedCount = config.blockedPlayers;

        return `<b>Wordle Analytics</b> 📊` +
            `\n\n<b>Game No:</b> ${gameNo() - 1}` +
            `\n\n<b>Total Players:</b> ${peeps}` +
            `\n<b>Played:</b> ${playedCount}` +
            `\n<b>Succeed:</b> ${succeedCount}` +
            `\n<b>Loses: </b> ${losesCount}` +
            `\n<b>Half Way:</b> ${halfWay}` +
            `\n<b>Blocked:</b> ${blockedCount}` +
            `\n\n#Analytics 📊`;
    }
}