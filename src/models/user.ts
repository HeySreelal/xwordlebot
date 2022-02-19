/**
 * User Model
 */
export default class User {
    id: number;
    name: string;
    lastGame: number;
    streak: number;
    joinedDate: Date;
    onGame: boolean;
    tries: string[];
    notify: boolean;
    maxStreak: number;
    totalGamesPlayed: number;
    totalWins: number;
    currentGame: number;

    constructor (user: U) {
        this.id = user.id;
        this.name = user.name;
        this.lastGame = user.lastGame;
        this.streak = user.streak;
        this.joinedDate = user.joinedDate;
        this.tries = user.tries;
        this.onGame = user.onGame;
        this.notify = user.notify || true;
        this.maxStreak = user.maxStreak || 0;
        this.totalGamesPlayed = user.totalGamesPlayed || 0;
        this.totalWins = user.totalWins || 0;
        this.currentGame = user.currentGame || 0;
    }

    static fromCloud(user: FirebaseFirestore.DocumentData) {
        return new User({
            id: user.id as number,
            name: user.name as string,
            lastGame: user.lastGame as number,
            streak: user.streak || 0 as number,
            joinedDate: user.joinedDate.toDate() as Date,
            onGame: user.onGame as boolean,
            tries: user.tries || [],
            notify: user.notify as boolean,
            maxStreak: user.maxStreak || 0 as number,
            totalGamesPlayed: user.totalGamesPlayed || 0 as number,
            totalWins: user.totalWins || 0 as number,
            currentGame: user.currentGame || 0 as number,
        });
    }

    toCloud(): U {
        return {
            id: this.id,
            name: this.name,
            lastGame: this.lastGame,
            streak: this.streak,
            joinedDate: this.joinedDate,
            tries: this.tries,
            onGame: this.onGame,
            notify: this.notify,
            maxStreak: this.maxStreak,
            totalGamesPlayed: this.totalGamesPlayed,
            totalWins: this.totalWins,
            currentGame: this.currentGame,
        };
    }

    static newUser = (name: string, id: number): User => {
        return new User({
            id,
            name,
            lastGame: 0,
            streak: 0,
            joinedDate: new Date(),
            tries: [],
            onGame: false,
            notify: true,
            maxStreak: 0,
            totalGamesPlayed: 0,
            totalWins: 0,
            currentGame: 0,
        });
    }
}


// User Helper Interface
export interface U {
    id: number;
    name: string;
    lastGame: number;
    streak: number;
    joinedDate: Date;
    onGame: boolean;
    tries: string[];
    notify: boolean;
    maxStreak: number;
    totalGamesPlayed: number;
    totalWins: number;
    currentGame: number;
}
