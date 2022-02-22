import bot from "../config/config";
import { errors, notificationMsgs } from "../config/strings";
import WordleAnalytics from "../services/analytics";
import WordleDB from "../services/db";
import { doLog, random, sleep } from "./utils";
import { gameNo } from "./word_updater";

export default async function notifyPlayers() {
    const config = await WordleDB.getConfigs();
    const peeps = Object.values(config.players);

    // Send daily analytics
    WordleAnalytics.sendDaily(config);
    
    // Player must have enabled notifications
    // And should be played last game: 
    // what's the point of notifying them if they haven't played the game from the last notification?
    // Isn't that spamming? :)
    const subs = peeps.filter(p => p.notify && p.lastGame == gameNo() - 1);
    

    let blockedPeeps = [];
    let failedCount = 0;

    for (const player of subs) {
        await sleep(2000);
        // Try sending the notification message, if it fails on blocked error -> unsubscribe the user
        await bot.api.sendMessage(player.id, random(notificationMsgs))
            .catch(err => {
                if (err.description === errors.blocked) {
                    config.players[player.id].notify = false;
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

    doLog(`Sent ${subs.length} notifications to ${subs.length - failedCount} users. And failed to send to ${failedCount} users.`);
}
