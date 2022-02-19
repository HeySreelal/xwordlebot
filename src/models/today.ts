export default class TodaysWordle {
    constructor(
        public word: string,
        public id: number,
        public date: Date,
        public next: Date,
    ) { }

    static fromCloud(data: FirebaseFirestore.DocumentData): TodaysWordle {
        return new TodaysWordle(
            data.word,
            data.id,
            data.date.toDate(),
            data.next.toDate(),
        );
    }

    static fromJson(data: any): TodaysWordle {
        return new TodaysWordle(
            data.word,
            data.id,
            new Date(data.date),
            new Date(data.next),
        );
    }

    toJson(): any {
        return {
            word: this.word,
            id: this.id,
            date: this.date.toISOString(),
            next: this.next.toISOString(),
        };
    }
}