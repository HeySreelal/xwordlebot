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
   2. Check the [.env.sample](./.env.sample) file for reference.
4. Create a Firebase Project and download the Admin SDK creds as `service-account.json`. Save the file inside `src/config/`
5. Run ```npm run build``` - Make sure you have installed the latest version of [TypeScript](https://www.typescriptlang.org/download)
6. Run ```npm start``` to start the bot


## Words
You can customize the words to be used by the bot by editing the [`src/config/words.ts` file](./src/config/words.ts). 

<hr>

## TODOs: 
- [ ] Add error handlers

## Thanks ❤️
Show some love by sharing the bot with your friends!

[Twitter](https://twitter.com/HeySreelal) | [Xooniverse](https://t.me/xooniverse)