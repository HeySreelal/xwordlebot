import { Context } from "grammy";
import { isDebug } from "../config/config";
import { errors, notOnGameMessages } from "../config/strings";
import { getFormatedDuration } from "../helpers/date";
import { wordExists } from "../helpers/dictionary";
import handleErrorWithEase from "../helpers/error_logger";
import { guessPrompt, random, resultGrid } from "../helpers/utils";
import WordleDB from "../services/db";

export default async function guessHandler(ctx: Context) {
    if(isDebug) {
        console.log(`${ctx.from.id} is guessing`);
        return;
    }
    try {
        if(!ctx.from && ctx.channelPost) {
            return;
        }
        const user = await WordleDB.getUser(ctx.from.id, ctx.from.first_name);
        const game = WordleDB.getToday();

        if (!game || !user) {
            return ctx.reply(errors.something_went_wrong);
        }

        // Just don't mind if the user is not currently playing the game.
        if (!user.onGame) {
            ctx.reply(random(notOnGameMessages));
            return;
        }

        const guess = ctx.message.text.toLowerCase().split('');

        if (guess.length != 5) {
            return ctx.reply(`Your guess must be 5 letters long!`);
        }

        if (guess.some(letter => !/[a-z]/.test(letter))) {
            return ctx.reply(`Your guess must be only letters!`);
        }

        if (!await wordExists(guess.join(''))) {
            return ctx.reply(`Please enter a valid word!`);
        }

        const result = getBoxes(game.word, guess);

        user.tries.push(guess.join(''));

        if (game.word == guess.join('')) {
            user.onGame = false;
            user.lastGame = game.id;
            user.streak++;
            user.totalWins++;
            if (user.tries.length === 1) {
                await ctx.reply(`Awesome! Just in one try! Nailed it! 🎉`);
            }
            await sendShareMessage(ctx, game.word, user.tries, game.id);

            await ctx.reply(`You guessed the word!\n\nThe word was <b>${game.word.toUpperCase()}</b>! 🚀`, {
                parse_mode: "HTML"
            });
            await ctx.reply(`New word showing up in ${getFormatedDuration(game.next)}!`);

            if (user.maxStreak < user.streak) user.maxStreak = user.streak;

            user.tries = [];
            await WordleDB.updateWinsOrLose(true);
        } else if (user.tries.length >= 6) {
            user.onGame = false;
            user.lastGame = game.id;
            user.streak = 0;
            await sendShareMessage(ctx, game.word, user.tries, game.id);
            await ctx.reply(`You lost! The word was <b>${game.word.toUpperCase()}</b>! 💀`, {
                parse_mode: "HTML"
            });
            await ctx.reply(`New word showing up in ${getFormatedDuration(game.next)}!`);
            user.tries = [];
            await WordleDB.updateWinsOrLose(false);
        } else {
            await ctx.reply(`${result.join(' ')}`);
            await ctx.reply(guessPrompt(user.tries.length + 1));
        }
        await WordleDB.updateUser(user);
    } catch (err) {
        console.log(err);
        handleErrorWithEase(err, ctx, 'guessHandler/game');
    }
}

export function getBoxes(word: string, guess: string[]): string[] {
    let letters: (string | null)[] = word.split('');
    const boxes: (string | null)[] = [null, null, null, null, null];

    // First mark all correct letters
    guess.forEach((guessLetter, index) => {
        if (letters[index] == guessLetter) {
            boxes[index] = "🟩";
            letters[index] = null;
        }
    });

    // Then mark all wrong letters
    guess.forEach((guessLetter, index) => {
        if (!boxes[index] && !letters.includes(guessLetter)) {
            boxes[index] = "⬛️";
        }
    });

    // Finally mark all the letters which are in the word but not in the correct position
    letters.forEach((letter, index) => {
        if (!boxes[index] && letters.includes(letter)) {
            boxes[index] = "🟨";
            letters[index] = null;
        }
    });

    return boxes;
}


const sendShareMessage = async (ctx: Context, word: string, tries: string[], gameId: number) => {
    const grid = resultGrid(word, tries);
    const resultMessage = `\n#WordleBot ${gameId} - ${tries.length} / 6\n\n${grid.join('\n')}\n\n@xWordleBot`;
    await ctx.reply(`<code>${resultMessage.trim()}</code>`, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Share 📩",
                    url: `https://t.me/share/url?url=https://t.me/xwordlebot&text=${encodeURIComponent(resultMessage)}`
                }],
            ],
        }
    }).catch(err => handleErrorWithEase(err, ctx, 'sendShareMessage/game'));
}