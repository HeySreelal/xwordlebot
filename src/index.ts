import * as dotenv from 'dotenv';
dotenv.config({
    path: `${__dirname}/../.env`
});

import bot from './config/config';
import { errors } from './config/strings';
import AdminHandlers from './handlers/admin';
import callbackHandler from './handlers/callbacks';
import { letmeBeATester, nextWord, profileHandler } from './handlers/etc';
import WordleFilters from './handlers/filters';
import guessHandler from './handlers/game';
import helpHandler, { aboutHandler } from './handlers/help';
import notificationHandler from './handlers/notification';
import quitHandler from './handlers/quit';
import startHandler from './handlers/start';
import handleErrorWithEase from './helpers/error_logger';
import { doLog } from './helpers/utils';
import updateWord from './helpers/word_updater';

bot.command('start', startHandler);
bot.command("notify", notificationHandler);
bot.command("help", helpHandler);
bot.command("about", aboutHandler);
bot.command("next", nextWord);
bot.command("quit", quitHandler);
bot.command("profile", profileHandler);
bot.command("tester", letmeBeATester);

// Admin Commands
bot.command("mod", AdminHandlers.adminCheck, AdminHandlers.mod);
bot.command("log", AdminHandlers.adminCheck, AdminHandlers.log);
bot.hears(/^(📊 Get Analytics)$/, AdminHandlers.adminCheck, AdminHandlers.getAnalytics);
bot.hears(/^(📃 Get Release Notes)$/, AdminHandlers.adminCheck, AdminHandlers.getReleaseNotes);
bot.hears(/^(📝 Set Release Notes)$/, AdminHandlers.adminCheck, AdminHandlers.askReleasePrompt);
bot.hears(/^(🚀 Release)$/, AdminHandlers.adminCheck, AdminHandlers.promptRelease);
bot.hears(/^(👫 Get Target Players)$/, AdminHandlers.adminCheck, AdminHandlers.getTargetPlayers);
bot.hears(/^(👫 Set Target Players)$/, AdminHandlers.adminCheck, AdminHandlers.askTargetPlayersPrompt);
bot.hears(/^(🍂 Count Release People)$/, AdminHandlers.adminCheck, AdminHandlers.getReleaseUsersCount);

bot.filter(WordleFilters.adminFilters, WordleFilters.adminFilterHandlers);

bot.on("channel_post", _ => {
    return;
});

// On Word Guess
bot.on(":text", guessHandler);

// On Callback Quries with data
bot.on("callback_query:data", callbackHandler);

// Expect the unexpected errors :)
bot.catch((err) => {
    console.log(err);
    const chat = err.ctx.chat.id;
    doLog(`Error for User <code>${chat}</code>: ${err.message}`);
    if(chat) err.ctx.reply(errors.something_went_wrong)
        .catch(e => handleErrorWithEase(e, err.ctx, "errors/unexpected"));
});

// Start bot
bot.start();
console.log("Bot is running!");

// Start updating word
updateWord();
