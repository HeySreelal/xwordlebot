import bot from "../config/config";
import { errors, notificationMsgs } from "../config/strings";
import WordleAnalytics from "../services/analytics";
import WordleDB from "../services/db";
import { doLog, random, sleep } from "./utils";

export default async function notifyPlayers() {
    const config = await WordleDB.getConfigs();
    const peeps = await WordleDB.getNotifyUsers();

    // Send daily analytics
    WordleAnalytics.sendDaily(config);

    let blockedPeeps = [];
    let failedCount = 0;

    for (const player of peeps) {
        await sleep(2000);
        // Try sending the notification message, if it fails on blocked error -> unsubscribe the user
        await bot.api.sendMessage(player.id, random(notificationMsgs))
            .catch(err => {
                if (err.description === errors.blocked || err.description === errors.cannot_initiate) {
                    blockedPeeps.push(player.id);
                    config.blockedPlayers++;
                }
                failedCount++;
            });
    }

    if (blockedPeeps.length > 0) {
        await WordleDB.updateConfigs(config);
        await WordleDB.updateBlocked(blockedPeeps);
    }

    doLog(`Sent ${peeps.length} notifications to ${peeps.length - failedCount} users. And failed to send to ${failedCount} users.`);
}
