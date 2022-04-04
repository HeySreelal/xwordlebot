import { firestore } from "./config/config";
import WordleConfig from "./models/types";
import WordleDB from "./services/db";

async function setupWordleBot(): Promise<void> {
    const meta = firestore.doc("game/config");
    const todayDoc = firestore.doc(`game/today`);

    const today = WordleDB.getToday();
    const config: WordleConfig = {
        releaseNote: "Hello!",
        blockedPlayers: 0,
        targetPlayers: "allPlayers",
        totalLoses: 0,
        totalPlayed: 0,
        totalPlayers: 0,
        totalWins: 0,
    };

    try {
        await meta.set(config);
        await todayDoc.set(today.toJson());
        console.log("Setup complete!");
    } catch (err) {
        console.error("Error occured while setup!");
        console.error(err);
    }
}

setupWordleBot();