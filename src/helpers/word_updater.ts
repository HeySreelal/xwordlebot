import { dayInMs } from "./date";
import * as fs from "fs";
import TodaysWordle from "../models/today";
import words from "../config/words";
import WordleDB from "../services/db";
import { doLog, random, sleep } from "./utils";
import bot, { launchDate } from "../config/config";
import { errors, notificationMsgs } from "../config/strings";

export const gameNo = (): number => {
    const now = new Date();
    const diff = launchDate.valueOf() - now.valueOf();
    return Math.abs(Math.floor(diff / dayInMs));
}

export default function updateWord() {
    const days = gameNo();
    // update today.json with the new word
    const today = new Date();
    const todayJson = JSON.parse(fs.readFileSync(`${__dirname}/../../game.json`, 'utf8'));
    const game = TodaysWordle.fromJson(todayJson);

    game.id = days;
    game.word = words[days];
    game.date = today;
    game.next = new Date(launchDate.getTime() + days * dayInMs);

    const msUptoNext = game.next.getTime() - today.getTime();

    fs.writeFileSync(`${__dirname}/../../game.json`, JSON.stringify(game, null, 2));

    setTimeout(() => {
        updateWord();
        notifyPlayers();
    }, msUptoNext);
}

const notifyPlayers = async () => {
    const confs = await WordleDB.getConfigs();
    const peeps = Object.values(confs.players);
    const subs = peeps.filter(p => p.notify);
    const config = await WordleDB.getConfigs();

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
