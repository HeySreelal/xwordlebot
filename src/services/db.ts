import { readFileSync } from "fs";
import { Firestore, firestore } from "../config/config";
import greet from "../helpers/greet";
import { doLog } from "../helpers/utils";
import { gameNo } from "../helpers/word_updater";
import TodaysWordle from "../models/today";
import WordleConfig from "../models/types";
import User from "../models/user";

export default class WordleDB {
    static configPath: string = "game/config";

    static getUser = async (userId: number, userName: string): Promise<User> => {
        const userDoc = await firestore.doc(`players/${userId}`).get();
        if (!userDoc.exists) {
            // send the greeting message
            await greet(userName, userId);
            return this.onBoardUser(userId, userName);
        }
        return User.fromCloud(userDoc.data());
    }

    static onBoardUser = async (userId: number, name: string): Promise<User> => {
        const user = User.newUser(name, userId);
        try {
            await firestore.doc(`players/${userId}`).set(user.toCloud());
            await firestore.runTransaction(async tr => {
                const doc = await tr.get(firestore.doc(this.configPath));
                const players = doc.data().players;
                players[userId] = {
                    id: userId,
                    notify: true,
                    lastGame: gameNo(),
                };
                tr.update(firestore.doc(this.configPath), {
                    players,
                    totalPlayers: Firestore.FieldValue.increment(1),
                });
            })
            return user;
        } catch (err) {
            doLog(`Error [DB/onBoardUser]: ${err.message}`);
            return;
        }
    }

    static getToday = (): TodaysWordle => {
        const todayJson = JSON.parse(readFileSync(`${__dirname}/../../game.json`, 'utf8'));
        return TodaysWordle.fromJson(todayJson);
    }

    static updateUser = async (user: User): Promise<void> => {
        try {
            await firestore.doc(`players/${user.id}`).update(user.toCloud());
        } catch (err) {
            doLog(`Error [DB/updateUser]: ${err.message}`);
        }
    }

    static getConfigs = async (): Promise<WordleConfig> => {
        const configs = await firestore.doc(this.configPath).get();
        return configs.data() as WordleConfig;
    }

    static toggleNotification = async (user: number, shouldNotify: boolean): Promise<void> => {
        try {
            await firestore.runTransaction(async tr => {
                const doc = await tr.get(firestore.doc(this.configPath));
                const players = doc.data().players;
                players[user].notify = shouldNotify;
                tr.update(firestore.doc(this.configPath), { players });
            });
            await firestore.doc(`players/${user}`).update({
                notify: true,
            });
        } catch (err) {
            doLog(`Error [DB/toggleNotification]: ${err.message}`);
        }
    }

    static updateConfigs = async (configs: WordleConfig): Promise<void> => {
        try {
            await firestore.doc(this.configPath).update(configs);
        } catch (err) {
            doLog(`Error while updating configs: ${err}`);
        }
    }

    static updateBlocked = async (users: number[]): Promise<void> => {
        try {
            const batch = firestore.batch();
            const configDoc = firestore.doc(this.configPath);
            // increment blocked players count
            batch.update(configDoc, {
                blockedPlayers: Firestore.FieldValue.increment(users.length),
            });

            // loop through blocked peeps, and update their notify to false
            for (const user of users) {
                const doc = firestore.doc(`players/${user}`);
                batch.update(doc, {
                    notify: false,
                });
            }
            await batch.commit();

            // log it
            await doLog(`Updated new ${users.length} blocked users!`);
        } catch (err) {
            doLog(`Error while updating blocked: ${err}`);
        }
    }

    static updateLastGameInConfig = async (user: number, no: number): Promise<void> => {
        try {
            await firestore.runTransaction(async tr => {
                const doc = firestore.doc("game/config");
                const data = await tr.get(doc);
                const config = data.data() as WordleConfig;
                config.players[user].lastGame = no;
                tr.update(doc, config);
            });
        } catch (err) {
            doLog(`Error for User <code>${user}</code> while updating last game in config: ${err}`);
        }
    }

    static async succeedPeople(): Promise<number> {
        const snapshot = await firestore.collection("players")
            .where("lastGame", "==", gameNo() - 1)
            .get();
        return snapshot.docs.length;
    }
}