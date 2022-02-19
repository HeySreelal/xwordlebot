import { getBoxes } from "../handlers/game";

export const guessPrompt = (tryCount: number) : string => {
    if (tryCount === 1) {
        return "Shoot your first guess now...";
    } else if (tryCount === 2) {
        return "Shoot your second guess now...";
    } else if (tryCount === 3) {
        return "Shoot your third guess now...";
    } else if (tryCount === 4) {
        return "Shoot your fourth guess now...";
    } else if (tryCount === 5) {
        return "Shoot your fifth guess now...";
    } else if (tryCount === 6) {
        return "And your last guess... 🎯";
    } else {
        return "Shoot your guess now...";
    }
}

export const resultGrid = (word: string, guesses: string[]) : string[] => {
    let boxes: string[] = [];
    for (const guess of guesses) {
        const result = getBoxes(word, guess.split('')).join(' ');
        boxes.push(result);
    }
    return boxes;
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}