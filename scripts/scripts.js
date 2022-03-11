const admin = require('firebase-admin');
const serviceAccount = require("../src/config/service-account.json");
const fs = require("fs");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// FIRESTORE PATHS
const paths = {
    config: "game/config",
};
class Maintenance {
    /**
     * @Date : 11th March 2022 at 6:00 PM
     *
     * As I am going to delete the players field in the game/config, I'm gonna take a backup of it for now.
     * Not sure why, but don't want to mess up the data.
     */
    static async backupPlayers() {
        const config = await db.doc(`${paths.config}`).get();
        const playersBackup = JSON.stringify(config.data());
        fs.writeFileSync("./players.json", playersBackup);
    }

    /**
     * Date: 11th March 2022
     *
     * Just noticed that notification handler always sets notify: true in user document. That means, even if
     * user disabled notifications, `notify` field will be true in user document. But not the config file.
     * So, we need to compare the `notify` field in user document with the `notify` field in config file.
     * And if they are different, we need to update the user document with the config file's `notify` field.
     */

    static async compareNotifyFields() {
        try {
            const users = await db.doc(paths.config).get();
            const batch = db.batch();

            let updated = [];
            let count = 0;
            for (const user of Object.keys(users.data().players)) {
                console.log(`User #${count} - ${user}`);
                const u = users.data().players[user];
                const userDoc = await db.doc(`players/${user}`).get();
                const userData = userDoc.data();
                if (userData.notify !== u.notify) {
                    batch.update(userDoc.ref, { notify: u.notify });
                    updated.push(user);
                }
                count++;
            }
            await batch.commit();
            console.log("Updated: ", updated.length, " docs!");
            fs.writeFileSync('things.txt', JSON.stringify(updated));
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * Just migrate :)
     *
     * Update: 11th March 2022
     *
     * I think there's no migration needed since all the data in game/config doc is the same as in each player's document.
     * I was using the `players` field in game/config doc to hold all the details all together to save space and decrease the time taken to fetch the data.
     * And more importantly, to decrease the document reads per day. Right now, I'm bit confused about should I continue the
     * `players` field in game/config doc or not.
     *
     * I seriously think that I should remove the `players` field in game/config doc.
     *
     * So, the point is, no migration needed.
     */
    static async migrateData() {
        console.log("Migration not needed.");
    }

    /**
     * Update: 10th March 2022
     * Firestore document can only hold data upto 1MB. I'm wondering if the details about almost 1400+ users is more than 1MB.
     * Probably not, but need to check if the `players` field in game/config doc is holding all the details.
     *
     * I was not prepared for this 1400+ users. Need to migrate data to each player's own document. Otherwise, I'll surely be messed up.
     */
    static async compareTotalPlayersCount() {
        try {
            const configDoc = await db.doc(paths.config).get();
            const config = configDoc.data();
            const players = config.players;
            console.log(`Total players in config: ${Object.keys(players).length}`);
            console.log(`Total players count, actual: ${config.totalPlayers}`);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }


    /**
     * Date: 28 February 2022
     *
     * Found few logs that goes: ```Error while updating last game in config: TypeError: Cannot set property 'lastGame' of undefined```
     * This is because the last game ID is not updated in the config properly for some players.
     * Needed a quick fix to update the last game ID for those players.
     *
     * Day 1: Let's find out which player is having the problem. Added a extra log in
     * [src/services/db.ts](https://github.com/HeySreelal/xwordlebot/blob/main/src/services/db.ts) to find this out.
     */
    static async fixLastGameInConfig() {
        throw new Error("Not implemented yet.");
    }

/**
 * Array Shuffler
 * @param {Array} array Array of elements to be shuffled
 * Thanks to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array for the shuffle algorithm
 * @return {Array}
 */ shuffle(array) {
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
    shuffleWordsAndSaveFile() {
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

    static async succeedPeople() {
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

    /**
     * Include the last game ID in the config.
     *
     * Trying to setup notifications only for those people who played the preious game.
     * @returns {Promise<boolean>}
     */
    static async includeLastGameIDinConfig() {
        try {
            const players = await db.collection('players').get();
            const config = (await db.doc(paths.config).get()).data();
            for (const player of players.docs) {
                const pd = player.data();
                config.players[pd.id].lastGame = pd.currentGame > pd.lastGame ? pd.currentGame : pd.lastGame;
            }
            await db.doc(paths.config).update(config);
            return true;
        } catch (err) {
            return false;
        }
    }
}

module.exports = Maintenance;