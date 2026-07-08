export const getFutureDate = (daysFromToday: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    const yyyy = date.getFullYear();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${dd}-${mm}`;
};

export const getFutureWeekday = (daysFromToday: number): string => {
    const date = new Date();
    let added = 0;
    while (added < daysFromToday) {
        date.setDate(date.getDate() + 1);
        const day = date.getDay();
        if (day !== 0 && day !== 6) { // Skip Saturday (6) and Sunday (0)
            added++;
        }
    }
    const yyyy = date.getFullYear();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${dd}-${mm}`;
};