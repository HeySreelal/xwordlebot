import { Context, InputFile } from "grammy";
import bot, { admins, logsChannel } from "../config/config";
import { errors } from "../config/strings";
import handleErrorWithEase from "../helpers/error_logger";
import playerTypesMap from "../helpers/player_types";
import profileDetails from "../helpers/profile";
import { doLog, sleep } from "../helpers/utils";
import { PlayerType } from "../models/types";
import User from "../models/user";
import WordleAnalytics from "../services/analytics";
import WordleDB from "../services/db";

export default class AdminHandlers {

    static prompts = {
        setRelease: `Send me the release note:`,
        setTargetPlayers: `Select a option as release target players:`,
    }

    static async mod(ctx: Context) {
        const id = ctx.from.id;
        if (!admins.includes(id)) {
            doLog(`User ${id} is not an admin. Admins are: ${admins}`);
            await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
            return;
        }
        ctx.reply(`Hello Captain, ${ctx.from.first_name}!\n\nWhat would you like to do today?`, {
            reply_markup: {
                keyboard: [
                    [{ "text": "📊 Get Analytics" }],
                    [{ "text": "📃 Get Release Notes" }, { "text": "📝 Set Release Notes" }],
                    [{ "text": "👫 Get Target Players" }, { "text": "👫 Set Target Players" }],
                    [{ "text": "🍂 Count Release People" }],
                    [{ "text": "🚀 Release" }],
                ]
            }
        });
    }

    static async getAnalytics(ctx: Context): Promise<void> {
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }
            ctx.replyWithChatAction("typing");
            const config = await WordleDB.getConfigs();
            const reply = await WordleAnalytics.getDaily(config);
            await ctx.reply(reply, {
                parse_mode: "HTML"
            });
        } catch (err) {
            handleErrorWithEase(err, ctx, "getAnalytics/admin");
        }
    }

    static async getReleaseNotes(ctx: Context): Promise<void> {
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }
            await ctx.replyWithChatAction("typing");
            const note = await WordleDB.getReleaseNote();
            await sleep(200);
            await ctx.reply(`📃 Current release note is: \n\n<b>${note}</b>`, {
                parse_mode: "HTML"
            });
        } catch (err) {
            handleErrorWithEase(err, ctx, "getReleaseNotes/admin");
        }
    }

    static async askReleasePrompt(ctx: Context): Promise<void> {
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }
            await ctx.reply(AdminHandlers.prompts.setRelease, {
                reply_markup: {
                    force_reply: true
                }
            });
        } catch (err) {
            handleErrorWithEase(err, ctx, "setReleaseNote/admin");
        }
    }

    static async setReleaseNote(ctx: Context): Promise<void> {
        const note = ctx.message.text;
        await WordleDB.updateReleaseNote(note);
        await ctx.reply(`Release note set to: \n\n<b>${note}</b>`, {
            parse_mode: "HTML"
        });
    }

    static async promptRelease(ctx: Context): Promise<void> {
        ctx.reply(`Are you sure you want to release?`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Yes 🛰", callback_data: "release_yes" }, { text: "No 🤔", callback_data: "release_no" }],
                ],
            },
        });
    }

    static async release(ctx: Context, confirmed: boolean) {
        if (!confirmed) {
            await ctx.answerCallbackQuery("Release cancelled.");
            await ctx.editMessageText(`Success releases are made after multiple tries. 👨🏻‍💻`,)
            await ctx.editMessageReplyMarkup({
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "❌ Release Cancelled", callback_data: "ignore" }],
                    ],
                }
            })
            await ctx.reply(`No problem. Let's do this sometime soon! 🛰`);
            return;
        }
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }

            doLog("Preparing for release...");
            await ctx.answerCallbackQuery("Preparing for release...");
            await ctx.editMessageText("Pushing into the horizon! 🚀");
            await ctx.editMessageReplyMarkup({
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "✅ Release accpted!", callback_data: "ignore" }],
                    ],
                }
            })

            const config = await WordleDB.getConfigs();
            const users = await WordleDB.getReleaseUsers(config.targetPlayers);

            let blockedPeeps = [];
            let failedPeeps = 0;
            for (const user of users) {
                await bot.api.sendMessage(user.id, config.releaseNote, {
                    parse_mode: "HTML"
                }).catch(err => {
                    if (err.description === errors.blocked || err.description === errors.cannot_initiate) {
                        blockedPeeps.push(user.id);
                        config.blockedPlayers++;
                    }
                    failedPeeps++;
                });
                await sleep(1000);
            }

            if (blockedPeeps.length > 0) {
                doLog("Updating config... 🧑🏻‍🔧");
                await WordleDB.updateConfigs(config);
                doLog("Updating blocked people... 🧑🏻‍💻");
                await WordleDB.updateBlocked(blockedPeeps);
            }

            await ctx.reply(`Release complete. 🎉`);
            doLog("Release complete. 🎉");
            doLog(`Tried sending release to: ${users.length}. Eventually realized that ${blockedPeeps.length} have blocked. That sums up to total of ${failedPeeps} failed messages.\n\nHopefully, we have delivered ${users.length - failedPeeps} messages. 🚀`);
        } catch (err) {
            console.log(err);
            handleErrorWithEase(err, ctx, "release/admin");
        }
    }

    static async getTargetPlayers(ctx: Context): Promise<void> {
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }
            await ctx.replyWithChatAction("typing");
            const type = await WordleDB.getTargetPlayers();
            await ctx.reply(`👫 Current target players are: <b>${playerTypesMap[type]}</b>`, {
                parse_mode: "HTML"
            });
        } catch (err) {
            handleErrorWithEase(err, ctx, "getTargetPlayers/admin");
        }
    }

    static async askTargetPlayersPrompt(ctx: Context): Promise<void> {
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }
            await ctx.reply(AdminHandlers.prompts.setTargetPlayers, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Last Game Winners 🎉", callback_data: "targetPlayers_lastWinners" }],
                        [{ text: "Week Backers 📅", callback_data: "targetPlayers_weekBackers" }],
                        [{ text: "Awesome Streakers 🔥", callback_data: "targetPlayers_awesomeStreakers" }],
                        [{ text: "Cool Gamers 🧛", callback_data: "targetPlayers_coolGamers" }],
                        [{ text: "Testers 👨🏻‍💻", callback_data: "targetPlayers_testers" }],
                        [{ text: "All Players ⛹️‍♂️", callback_data: "targetPlayers_allPlayers" }],
                    ],
                }
            });
        } catch (err) {
            handleErrorWithEase(err, ctx, "setTargetPlayers/admin");
        }
    }

    static async setTargetPlayers(ctx: Context, value: PlayerType): Promise<void> {
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }
            await ctx.answerCallbackQuery("Setting target players...");
            await ctx.editMessageText(`Setting target players to: <b>${playerTypesMap[value]}</b>`, {
                parse_mode: "HTML"
            });
            await WordleDB.updateTargetPlayers(value);
            await ctx.editMessageText(`👫 Target players set to: <b>${playerTypesMap[value]}</b>`, {
                parse_mode: "HTML"
            });
            await ctx.editMessageReplyMarkup({
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "✅ Target Players Set", callback_data: "ignore" }],
                    ],
                }
            });
        } catch (err) {
            handleErrorWithEase(err, ctx, "setTargetPlayers/admin");
        }
    }

    static async getReleaseUsersCount(ctx: Context) {
        const config = await WordleDB.getConfigs();
        const users = await WordleDB.getReleaseUsers(config.targetPlayers);
        await ctx.reply(`There are <b>${users.length}</b> users in the release list.`, {
            parse_mode: "HTML"
        });
    }

    static async postTesterRequest(ctx: Context, user: User) {
        await bot.api.sendMessage(
            logsChannel, `🆕 New Tester Request: ` +
            `<b>${ctx.from.first_name}</b>\n\n` +
            `ID <b>${ctx.from.id}</b>\n\n${profileDetails(user)}\n` +
        `#TesterRequest`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Approve ✅', callback_data: `testerRequest_${user.id}-approve` }],
                        [{ text: 'Reject ❌', callback_data: `testerRequest_${user.id}-reject` }]
                    ],
                },
            }
        );
    }

    static async testerRequest(ctx: Context, value: string) {
        try {
            const id = ctx.from.id;
            if (!admins.includes(id)) {
                doLog(`User ${id} is not an admin. Admins are: ${admins}`);
                await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
                return;
            }
            // value = 1407956293-approve
            const [userId, action] = value.split("-");
            const user = await WordleDB.getUser(parseInt(userId));
            let reply = "Tester Request Update! 🧑🏻‍💻\n\n";
            if (action == "approve") {
                user.role = "Tester";
                reply = reply + `Hey, you have been approved as a tester, now! 🎉\n\nYou'll be updated when we're conducting a release or updates. 🚀 \nLet's hangout at @xBotsChat if you're interested!`;

                ctx.editMessageReplyMarkup({
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Approved ✅', callback_data: `testerRequest_${user.id}-reject` }],
                        ],
                    }
                });
            } else if (action == "reject") {
                user.role = "Player";
                reply = reply + `Hey, we have closely reviewd your profile and have decided to reject your tester request for now. 🙂\n\nDon't worry, you can apply again sometime later to get approved!`;
                ctx.editMessageReplyMarkup({
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Rejected ❌', callback_data: `testerRequest_${user.id}-approve` }],
                        ],
                    }
                });
            }
            bot.api.sendMessage(user.id, reply, {
                parse_mode: "HTML",
            });
            await WordleDB.updateUser(user);

            ctx.answerCallbackQuery("Tester Request Updated!");

        } catch (err) {
            handleErrorWithEase(err, ctx, "testerRequest/admin");
        }
    }

    static async log(ctx: Context) {
        const id = ctx.from.id;
        if (!admins.includes(id)) {
            doLog(`User ${id} is not an admin. Admins are: ${admins}`);
            await ctx.reply(`You are not authorized to use this command. 👨🏻‍💻`);
            return;
        }
        ctx.replyWithDocument(new InputFile("./logs.txt"));
    }
}