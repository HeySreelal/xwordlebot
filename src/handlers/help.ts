import { Context } from "grammy";

const helpHandler = async (ctx: Context) => {
    ctx.replyWithChatAction("typing");
    await ctx.reply(helpMessage, {
        parse_mode: "HTML"
    });
}

const aboutHandler = async (ctx: Context) => {
    ctx.replyWithChatAction("typing");
    await ctx.reply(aboutMessage, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
    });
}


const helpMessage = `
💁‍♀️ <b>Help</b>

The game is about guessing a five letter word. You will have 6 tries to guess the word.
After each guess, you will get a hint about how many letters are in the word and how many are correct. 

Examples: 
Guess: WORLD
Hint: 🟩 ⬛️ ⬛️ ⬛️ ⬛️

Here W is correct, and no other letters are in the word. 

Guess: OPENS
Hint: 🟩 🟨 🟩 ⬛️ ⬛️

In this, O and E are in the word and at correct position, P is in the word but on a different position, but not in the correct position.

🔔 <b>New Word & Notifications</b>
A new word will be available every day. The bot will send you notification when the word is available. You can handle notification preference by sending /notify command.

📱 <b>Available Commands</b>
/start - Start the game
/notify - Enable/Disable notifications
/help - Show this help message
/about - Show about message
/quit - Quit the current game (Resets your streak)
/profile - Show your profile and stats

Happy Wordleing! 🤓
`;

const aboutMessage = `<b>🧑🏻‍💻 About</b>

Wordle Bot is Telegram bot version of the <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a> game.
Created by @HeySreelal with ❤️ for Telegram.

The bot is open source and source is available on <a href="https://github.com/HeySreelal/xwordlebot">GitHub</a>. Feel free to contribute.

Show some love by sharing the bot with your friends!

<a href="https://twitter.com/HeySreelal">Twitter</a> | <a href="https://t.me/xooniverse">Xooniverse</a>
`;

export default helpHandler;
export { aboutHandler };