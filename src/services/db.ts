import { readFileSync } from "fs";
import { Firestore, firestore } from "../config/config";
import greet from "../helpers/greet";
import playerTypesMap from "../helpers/player_types";
import { doLog } from "../helpers/utils";
import { gameNo } from "../helpers/word_updater";
import TodaysWordle from "../models/today";
import WordleConfig, { PlayerType } from "../models/types";
import User from "../models/user";

export default class WordleDB {
    static configPath: string = "game/config";

    static async getUser(userId: number, userName?: string): Promise<User> {
        const userDoc = await firestore.doc(`players/${userId}`).get();
        if (!userDoc.exists) {
            // send the greeting message
            await greet(userName, userId);
            return this.onBoardUser(userId, userName);
        }
        return User.fromCloud(userDoc.data());
    }

    static async onBoardUser(userId: number, name: string): Promise<User> {
        const user = User.newUser(name, userId);
        try {
            await firestore.doc(`players/${userId}`).set(user.toCloud());
            await firestore.doc(this.configPath).update({
                totalPlayers: Firestore.FieldValue.increment(1)
            });
            return user;
        } catch (err) {
            doLog(`Error [DB/onBoardUser]: ${err.message}`);
            return;
        }
    }

    static getToday(): TodaysWordle {
        const todayJson = JSON.parse(readFileSync(`${__dirname}/../../game.json`, 'utf8'));
        return TodaysWordle.fromJson(todayJson);
    }

    static async updateUser(user: User): Promise<void> {
        try {
            await firestore.doc(`players/${user.id}`).update(user.toCloud());
        } catch (err) {
            doLog(`Error [DB/updateUser]: ${err.message}`);
        }
    }

    static async getConfigs(): Promise<WordleConfig> {
        const configs = await firestore.doc(this.configPath).get();
        return configs.data() as WordleConfig;
    }

    static async toggleNotification(user: number, shouldNotify: boolean): Promise<void> {
        try {
            await firestore.doc(`players/${user}`).update({
                notify: shouldNotify,
            });
        } catch (err) {
            doLog(`Error [DB/toggleNotification]: ${err.message}`);
        }
    }

    static async updateConfigs(configs: WordleConfig): Promise<void> {
        try {
            await firestore.doc(this.configPath).update(configs);
        } catch (err) {
            doLog(`Error while updating configs: ${err}`);
        }
    }

    static async updateBlocked(users: number[]): Promise<void> {
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

    static async succeedPeople(): Promise<number> {
        const snapshot = await firestore.collection("players")
            .where("lastGame", "==", gameNo() - 1)
            .get();
        return snapshot.docs.length;
    }

    static async updateToday(): Promise<void> {
        const today = this.getToday();
        firestore.doc("game/today").update({ ...today });
    }

    static async getNotifyUsers(): Promise<User[]> {
        const snapshot = await firestore.collection("players")
            .where("notify", "==", true)
            .where("lastGame", "==", gameNo() - 1)
            .get();
        return snapshot.docs.map(doc => User.fromCloud(doc.data()));
    }

    static async incrementPlayedCount(): Promise<void> {
        try {
            await firestore.doc(this.configPath).update({
                totalPlayed: Firestore.FieldValue.increment(1),
            });
        } catch (err) {
            doLog(`Error while incrementing played count: ${err}`);
        }
    }

    static async updateWinsOrLose(isWins: boolean) : Promise<void> {
        try {
            if (isWins) {
                await firestore.doc(this.configPath).update({
                    totalWins: Firestore.FieldValue.increment(1),
                });
            } else {
                await firestore.doc(this.configPath).update({
                    totalLoses: Firestore.FieldValue.increment(1),
                });
            }
        } catch (err) {
            doLog(`Error while updating wins count: ${err}`);
        }
    }

    static async resetAnalytics(): Promise<void> {
        try {
            await firestore.doc(this.configPath).update({
                totalPlayed: 0,
                totalWins: 0,
                totalLoses: 0,
            });
        } catch (err) {
            doLog(`Error while resetting analytics: ${err}`);
        }
    }

    static async getReleaseNote(): Promise<string> {
        const snapshot = await firestore.doc(this.configPath).get();
        return snapshot.data().releaseNote as string;
    }

    static async updateReleaseNote(releaseNote: string): Promise<void> {
        try {
            await firestore.doc(this.configPath).update({
                releaseNote,
            });
            doLog(`Updated release note to ${releaseNote}`);
        } catch (err) {
            doLog(`Error while updating release note: ${err}`);
        }
    }

    static async getTargetPlayers(): Promise<string> {
        return (await this.getConfigs()).targetPlayers;
    }

    static async updateTargetPlayers(type: PlayerType): Promise<void> {
        try {
            await firestore.doc(this.configPath).update({
                targetPlayers: type,
            });
            doLog(`Updated target players to ${playerTypesMap[type]}`);
        } catch (err) {
            doLog(`Error while updating target players: ${err}`);
        }
    }

    static async getReleaseUsers(type: PlayerType): Promise<User[]> {
        let colRef = firestore.collection("players");
        let query: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query;
        switch (type) {
            case "lastWinners": query = colRef.where("lastGame", "==", gameNo() - 1); break;
            case "weekBackers": query = colRef.where("lastGame", "<", gameNo() - 7); break;
            case "awesomeStreakers": query = colRef.orderBy("streak", "desc").limit(15); break;
            case "testers": query = colRef.where("isTester", "==", true); break;
            case "coolGamers": query = colRef.where("winPercentage", ">", 75); break;
            case "allPlayers":
                default: query = colRef;
        }
        const snapshot = await query.get();
        return snapshot.docs.map(doc => User.fromCloud(doc.data()));
    }
}