const admin = require('firebase-admin');
const serviceAccount = require("../src/config/service-account.json");

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

module.exports = {
    includeLastGameIDinConfig,
}