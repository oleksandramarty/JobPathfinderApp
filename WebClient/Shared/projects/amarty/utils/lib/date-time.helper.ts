const getUserTimeShift = (): number => {
    const date = new Date();
    return -date.getTimezoneOffset(); // The offset is returned in minutes, so we negate it to get the shift in minutes.
};

export const handleLocalDate = (date: any): Date => {
    let handledDate = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), new Date(date).getDate(), 0, 0, 0);
    if (handledDate) {
        handledDate.setMinutes(handledDate.getMinutes() + getUserTimeShift());
    }

    return handledDate;
};

export function getUTCString(): string {
    const offset = -new Date().getTimezoneOffset() / 60;
    const sign = offset >= 0 ? '+' : '-';
    return `UTC ${sign}${Math.abs(offset)}`;
}
