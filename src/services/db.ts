import { readFileSync } from "fs";
import { Firestore, firestore } from "../config/config";
import greet from "../helpers/greet";
import TodaysWordle from "../models/today";
import WordleConfig from "../models/types";
import User from "../models/user";

export default class WordleDB {
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
                const doc = await tr.get(firestore.doc("game/config"));
                const players = doc.data().players;
                players[userId] = {
                    id: userId,
                    notify: true,
                };
                tr.update(firestore.doc("game/config"), {
                    players,
                    totalPlayers: Firestore.FieldValue.increment(1),
                });
            })
            return user;
        } catch (err) {
            console.log(err);
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
            console.log(err);
        }
    }

    static getConfigs = async (): Promise<WordleConfig> => {
        const configs = await firestore.doc("game/config").get();
        return configs.data() as WordleConfig;
    }

    static toggleNotification = async (user: number, shouldNotify: boolean): Promise<void> => {
        try {
            await firestore.runTransaction(async tr => {
                const doc = await tr.get(firestore.doc("game/config"));
                const players = doc.data().players;
                players[user].notify = shouldNotify;
                tr.update(firestore.doc("game/config"), { players });
            });
            await firestore.doc(`players/${user}`).update({
                notify: true,
            });
        } catch (err) {
            console.log(err);
        }
    }
}