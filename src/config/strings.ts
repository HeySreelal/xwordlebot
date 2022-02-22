// I know this is shit :)
// But, just to keep all the strings in one place


/**
 * **Notification Messages**
 * 
 * Contains all the messages that are sent to the user as reminder to play the game.
 */
const notificationMsgs = [
    "Hey, time to play! New Wordle is here!\n\Remember to send /start to start playing. 👀",
    "New new new! 🆕 New Wordle is here!\n\Send /start to start playing. 🤖",
    "New Wordle is here! 🆕\n\nSend /start to start playing. 🤖",
    "👀 Did your best friend tell you about today's Wordle?\n\nSend /start to start playing. 🤖",
    "New drop! 📨 New Wordle is here!\n\nSend /start to start playing. 🤖",
];

/**
 * **Error Messages**
 * 
 * Contains all the messages that are sent to the user when something goes wrong as a Map.
 */
const errors = {
    "blocked": "Forbidden: bot was blocked by the user",
    "something_went_wrong": "Something went wrong. Please try again later.",
}

/**
 * **Excited Messages** 
 * 
 * Messages to be sent when the user tries to play the game again after it's over.
 */
const excitedMessages = [
    "Excited? But, you've already played today! Next wordle showing up on {TIME} 👀",
    "You've already played today! Next wordle showing up on {TIME} 🤖",
    "I'm glad you're excited for this! 😍 Next wordle showing up on {TIME} 🤖",
    "Daily one wordle, that's the rule! 🤓 So next up on {TIME} 🤖",
    "Counting, 1, 2, 3... 🤓 Next Wordle arrives on {TIME} 🤖",
];

/**
 * **Welcome Messages**
 * 
 * Messages to be sent when the user first joins the chat.
 */
const welcomeMessages = [
    "Welcome to Wordle! Glad to have you here <b>{name}</b>! 🤓",
    "Welcome to Wordle Bot, {name}! 🤖 Let's play today's Wordle! 🚀",
    "Hey there, {name}! Greetings from Wordle Bot! 🚀",
]

/**
 * **In Game Messages**
 * 
 * Contains `already` and `notOnGame` and `letsStart` messages.
 * 
 * - `already` message is sent when the user is already playing the game.
 * - `notOnGame` message is sent when the user is not playing the game.
 * - `letsStart` message is sent when the user is not playing the game and tries to play the game.
 */
const inGameMessages = {
    already: "You are already playing the game. Shoot the guesses. 😇",
    notOnGame: "You are not currently playing the game. 😇",
    letsStart: `Let's start the game, shoot your first guess!\n\nMeanwhile, send <code>/help</code> anytime if you want to check instructions.`,
}

/**
 * **Help Message**
 * 
 * Sent when the user sends /help.
 */
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

/**
 * **About Message**
 * 
 * Sent when the user sends /about.
 */
const aboutMessage = `<b>🧑🏻‍💻 About</b>

Wordle Bot is Telegram bot version of the <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a> game.
Created by @HeySreelal with ❤️ for Telegram.

The bot is open source and source is available on <a href="https://github.com/HeySreelal/xwordlebot">GitHub</a>. Feel free to contribute.

Show some love by sharing the bot with your friends!

<a href="https://twitter.com/HeySreelal">Twitter</a> | <a href="https://t.me/xooniverse">Xooniverse</a>
`;

/**
 * **Not On Game Message**
 * 
 * These are the messages that are sent when the user is not playing the game and sends some message to the bot.
 */
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
    inGameMessages,
    helpMessage,
    aboutMessage,
    notOnGameMessages,
    welcomeMessages,
}