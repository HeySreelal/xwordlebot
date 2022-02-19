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

    constructor (user: U) {
        this.id = user.id;
        this.name = user.name;
        this.lastGame = user.lastGame;
        this.streak = user.streak;
        this.joinedDate = user.joinedDate;
        this.tries = user.tries;
        this.onGame = user.onGame;
    }

    static fromCloud(user: FirebaseFirestore.DocumentData) {
        return new User({
            id: user.id as number,
            name: user.name as string,
            lastGame: user.lastGame as number,
            streak: user.streak || 0 as number,
            joinedDate: user.joinedDate.toDate() as Date,
            onGame: user.onGame as boolean,
            tries: user.tries ?? [],
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
}
