import * as dotenv from 'dotenv';
dotenv.config({
    path: `${__dirname}/../.env`
});

import bot from './config/config';
import callbackHandler from './handlers/callbacks';
import { nextWord, profileHandler } from './handlers/etc';
import guessHandler from './handlers/game';
import helpHandler, { aboutHandler } from './handlers/help';
import notificationHandler from './handlers/notification';
import quitHandler from './handlers/quit';
import startHandler from './handlers/start';
import updateWord from './helpers/word_updater';

bot.command('start', startHandler);
bot.command("notify", notificationHandler);
bot.command("help", helpHandler);
bot.command("about", aboutHandler);
bot.command("next", nextWord);
bot.command("quit", quitHandler);
bot.command("profile", profileHandler);

bot.on(":text", guessHandler);
bot.on("callback_query:data", callbackHandler);

// Start bot
bot.start();
console.log("Bot is running!");

// Start updating word
updateWord();
