import { Bot, Context } from "grammy";
import * as ServiceAccount from "./service-account.json";
import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount as admin.ServiceAccount),
});

const firestore = admin.firestore();
const Firestore = admin.firestore;

const token = process.env.BOT_TOKEN || "YOUR_BOT_TOKEN";

const bot = new Bot<Context>(token);
const launchDate = new Date(2022, 1, 19, 12, 0, 0, 0);


export default bot;
export { firestore, Firestore, launchDate };