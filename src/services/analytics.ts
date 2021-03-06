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

        return `<b>Wordle Analytics</b> š` +
            `\n\n<b>Game No:</b> ${gameNo() - 1}` +
            `\n\nš„ <b>Total Players:</b> ${peeps}` +
            `\nš³ <b>Played:</b> ${playedCount}` +
            `\nš <b>Succeed:</b> ${succeedCount}` +
            `\nš <b>Loses: </b> ${losesCount}` +
            `\nš <b>Half Way:</b> ${halfWay}` +
            `\nš§ <b>Blocked:</b> ${blockedCount}` +
            `\n\n#Analytics š`;
    }
}