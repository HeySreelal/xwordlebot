import { dayInMs } from "./date";
import * as fs from "fs";
import TodaysWordle from "../models/today";
import words from "../config/words";
import { launchDate } from "../config/config";
import notifyPlayers from "./notify";
import WordleDB from "../services/db";

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
    WordleDB.updateToday();
    
    setTimeout(() => {
        updateWord();
        notifyPlayers();
    }, msUptoNext);
}
