import bot from "../config/config";
import { welcomeMessages } from "../config/strings";
import { random } from "./utils";

const greet = async (name: string, user: number): Promise<void> => {
    const greetMsg = random(welcomeMessages).replace("{name}", name);
    bot.api.sendMessage(user, greetMsg, {
        parse_mode: "HTML"
    });
}

export default greet;