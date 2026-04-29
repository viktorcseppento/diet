export function formatNumber(num) {
    if (isFinite(num)) {
        return Math.round(num * 100) / 100;
    } else {
        return 0;
    }
}

export function classList(...classes) {
    return classes.filter(Boolean).join(' ');
}

const monthNames = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
const dayAbbreviations = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];

export function translateMonth(month) {
    return monthNames[month];
}

export function translateDay(day) {
    return dayAbbreviations[day];
}