const notificationMsgs = [
    "Hey, time to play! New Wordle is here!\n\Remember to send /start to start playing. 👀",
    "New new new! 🆕 New Wordle is here!\n\Send /start to start playing. 🤖",
    "New Wordle is here! 🆕\n\nSend /start to start playing. 🤖",
    "👀 Did your best friend tell you about today's Wordle?\n\nSend /start to start playing. 🤖",
    "New drop! 📨 New Wordle is here!\n\nSend /start to start playing. 🤖",
];

const errors = {
    "blocked": "Forbidden: bot was blocked by the user",
    "something_went_wrong": "Something went wrong. Please try again later.",
}


const excitedMessages = [
    "Excited? But, you've already played today! Next wordle showing up on {TIME} 👀"
];

const inGameMessages = {
    already: "You are already playing the game. Shoot the guesses. 😇",
    notOnGame: "You are not currently playing the game. 😇"
}

const letsStart = `Let's start the game, shoot your first guess!

Meanwhile, send <code>/help</code> anytime if you want to check instructions.`;



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

const notOnGameMessages = [
    "You are not currently playing the game. 😇 Send /start to start playing. 🤖",
    "Oops! You're not on a game. Send /start to start play today's Wordle! 🤖",
    "First, send /start to start playing today's Wordle! 🤖",
    "I didn't get what you said. Send /start to start playing today's Wordle! 🤖",
    "Could you rephrase that, please? Send /help for help message, or /start to start playing. 👀",
    "Let's start the game or need some help? Send /help for help message, or /start to start playing. 😇",
];


export {
    notificationMsgs,
    errors,
    excitedMessages,
    letsStart,
    inGameMessages,
    helpMessage,
    aboutMessage,
    notOnGameMessages,
}