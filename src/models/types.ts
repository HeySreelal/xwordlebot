export default interface WordleConfig {
    players: {
        [id: number]: Player,
    };
    totalPlayers: number;
}

interface Player {
    id: number;
    notify: boolean;
}