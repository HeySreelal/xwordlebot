import { Bot, Context } from "grammy";
import * as ServiceAccount from "./service-account.json";
import * as admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount as admin.ServiceAccount),
});

const firestore = admin.firestore();
const Firestore = admin.firestore;

const token = process.env.TEST_TOKEN || "YOUR_BOT_TOKEN";
const logsChannel = process.env.LOGS || "LOGS_CHANNEL_ID";
const admins = (process.env.ADMINS || "ADMIN,USER,IDs").split(",").map(x => parseInt(x));

const bot = new Bot<Context>(token);
const launchDate = new Date(2022, 1, 19, 12, 0, 0, 0);

// TODO: DON'T FORGET TO CHANGE DEBUG TO FALSE ON PRODUCTION
const isDebug = true;

export default bot;
export { firestore, Firestore, launchDate , logsChannel, admins, isDebug };
