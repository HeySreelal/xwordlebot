const admin = require('firebase-admin');
const serviceAccount = require("../src/config/service-account.json");
const fs = require("fs");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
/**
 * Include the last game ID in the config.
 *
 * Trying to setup notifications only for those people who played the preious game.
 * @returns {Promise<boolean>}
 */
async function includeLastGameIDinConfig() {
    try {
        const players = await db.collection('players').get();
        const config = (await db.doc("game/config").get()).data();
        for (const player of players.docs) {
            const pd = player.data();
            config.players[pd.id].lastGame = pd.currentGame > pd.lastGame ? pd.currentGame : pd.lastGame;
        }
        await db.doc("game/config").update(config);
        return true;
    } catch (err) {
        return false;
    }
}
async function succeedPeople() {
    try {
        const snapshot = await db.collection("players")
            .where("lastGame", "==", 3)
            .get();
        console.log("Cound of people who won: ", snapshot.docs.length);
        return true;
    } catch (err) {
        console.log("error", err)
        return false;
    }
}

function shuffleWordsAndSaveFile() {
    // Just shuffling upcoming words, manually :)
    const words = [
        // words to be shuffled goes here :)
    ];

    try {
        let uniqueWords = [... new Set(words)];
        shuffle(uniqueWords);
        fs.writeFileSync('words.json', JSON.stringify(uniqueWords));
        console.log("done");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}


/**
 * Array Shuffler
 * @param {Array} array Array of elements to be shuffled
 * Thanks to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array for the shuffle algorithm
 * @return {Array}
 */
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex],
        ];
    }

    return array;
}

/**
 * Date: 28 February 2021
 *
 * Found few logs that goes: ```Error while updating last game in config: TypeError: Cannot set property 'lastGame' of undefined```
 * This is because the last game ID is not updated in the config properly for some players.
 * Needed a quick fix to update the last game ID for those players.
 *
 * Day 1: Let's find out which player is having the problem. Added a extra log in
 * [src/services/db.ts](https://github.com/HeySreelal/xwordlebot/blob/main/src/services/db.ts) to find this out.
 */
async function fixLastGameInConfig() {
    throw new Error("Not implemented yet.");
}

module.exports = {
    includeLastGameIDinConfig,
    succeedPeople,
    shuffleWordsAndSaveFile,
    fixLastGameInConfig,
}