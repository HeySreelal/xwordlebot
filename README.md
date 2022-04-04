# Wordle Bot

## Give a try! [@xWordleBot](https://t.me/xwordlebot).

This is a simple bot inspired by [Wordle game](https://www.nytimes.com/games/wordle/index.html). 

The bot is entirely written in TypeScript. Thanks to [grammY](https://grammy.dev/) Telegram Bot framework. And to [datamuse](https://www.datamuse.com/api/) API for word check.

<hr>

## Setup

1. Clone the repo.
2. Run ```npm install```
3. Create an .env file with the following variables:
   1. BOT_TOKEN - the Telegram bot token provided by [@BotFather](https://t.me/BotFather)
   2. LOGS - Telegram channel or group ID where the bot will send logs. (Make sure bot is an admin of the channel or member of the group).
   3. ADMINS - Telegram User IDs of the admins of the bot.
   4. Check the [.env.sample](./.env.sample) file for reference.
4. Create a Firebase Project and download the Admin SDK creds as `service-account.json`. Save the file inside `src/config/`
5. Run ```npm run build``` - Make sure you have installed the latest version of [TypeScript](https://www.typescriptlang.org/download)
6. And to complete the setup run ```npm run setup```.
7. Run ```npm start``` to start the bot.


## Words
You can customize the words to be used by the bot by editing the [`src/config/words.ts` file](./src/config/words.ts). 

<hr>

## TODOs: 
- [x] Add error handlers.
- [ ] **Meaning of Words**: Thinking of adding `/meaning` command or similar thing to send the meaning of the word at the end of the game daily.
- [ ] **Better Reminders**: Currently we're sending reminders only to people who have played yesterday's game and turned on notifications. I think, it's better to nudge the users who haven't played the game for a while like 7 days or more to play.

## Thanks ❤️
Show some love by sharing the bot with your friends!

[Twitter](https://twitter.com/HeySreelal) | [Xooniverse](https://t.me/xooniverse)