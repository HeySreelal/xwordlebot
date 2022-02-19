import bot from "../config/config";

const greet = async (name: string, user: number): Promise<void> => {
    bot.api.sendMessage(user, `Welcome to Wordle! Glad to have you here <b>${name}</b>! 🤓` +
    `\n\nLet's get the ball rolling! Send <code>/start</code> again to start the game.`, {
        parse_mode: "HTML"
    });
}

export default greet;