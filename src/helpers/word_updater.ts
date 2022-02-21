import { dayInMs } from "./date";
import * as fs from "fs";
import TodaysWordle from "../models/today";
import words from "../config/words";
import WordleDB from "../services/db";
import { sleep } from "./utils";
import bot, { launchDate } from "../config/config";

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
    game.id = days;

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
    for (const player of subs) {
        await sleep(2000);
        await bot.api.sendMessage(player.id, `Hey, time to play! New Wordle is here! 👀`)
            .catch(err => {
                // ignore any errors while sending notification messages
                console.error(err);
            });
    }
}
