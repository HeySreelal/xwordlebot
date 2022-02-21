const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const getFormatedDate = (date: Date): string => {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year} at ${date.toLocaleTimeString()} GMT`;
};

export const getFormatedDuration = (end: Date): string => {
    const start = new Date();
    const duration = end.getTime() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 8) {
        return getFormatedDate(end);
    } else {
        return `${hours}h ${minutes}m`;
    }
}

export const dayInMs = 1000 * 60 * 60 * 24;