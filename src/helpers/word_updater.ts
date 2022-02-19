import { dayInMs } from "./date";
import * as fs from "fs";
import TodaysWordle from "../models/today";
import words from "../config/words";
import WordleDB from "../services/db";
import { sleep } from "./utils";
import bot from "../config/config";

export default function updateWord () {
    const launchDate = new Date(2022, 1, 19, 0, 0, 0, 0);
    const now = new Date();
    const diff = launchDate.valueOf() - now.valueOf();
    const days = Math.abs(Math.floor(diff / dayInMs));
    
    // update today.json with the new word
    const today = new Date();
    const todayJson = JSON.parse(fs.readFileSync(`${__dirname}/../../game.json`, 'utf8'));
    const game = TodaysWordle.fromJson(todayJson);

    game.id = days;
    game.word = words[days];
    game.date = today;
    game.next = new Date(today.getTime() + dayInMs);
    game.id = days;

    fs.writeFileSync(`${__dirname}/../../game.json`, JSON.stringify(game, null, 2));

    notifyPlayers();

    setTimeout(updateWord, dayInMs);
}

const notifyPlayers = async () => {
    const confs = await WordleDB.getConfigs();
    const players = confs.players.filter(p => p.notify);
    for (const player of players) {
        await sleep(2000);
        await bot.api.sendMessage(player.id, `Hey, time to play! New word is here! 👀`)
    }
}

