import bot from "../config/config";

const greet = async (name: string, user: number): Promise<void> => {
    bot.api.sendMessage(user, `Welcome to Wordle! Glad to have you here <b>${name}</b>! 🤓`, {
        parse_mode: "HTML"
    });
}

export default greet;