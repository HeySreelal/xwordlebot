import * as dotenv from 'dotenv';
dotenv.config({
    path: `${__dirname}/../.env`
});

import bot from './config/config';
import guessHandler from './handlers/game';
import startHandler from './handlers/start';
import updateWord from './helpers/word_updater';

bot.command('start', startHandler);
bot.on(":text", guessHandler);

// Start bot
bot.start();

// Start updating word
updateWord();