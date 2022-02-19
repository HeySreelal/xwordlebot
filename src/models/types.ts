export default interface WordleConfig {
    players: Player[];
    totalPlayers: number;
}

interface Player {
    id: number;
    notify: boolean;
}