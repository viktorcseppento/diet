import { MEASURE_UNITS } from "./enums";

export function formatNumber(num, decimalPlaces = 2) {
    if (!isFinite(num) || num === Number.MAX_VALUE) {
        return 0;
    }

    return Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;
}

export function timeStrFromDateTime(dateTime) {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

export function foodNameWithMeasure(food) {
    return `${food.name} - ${MEASURE_UNITS.find(m => m.key === food.measure).label}`;
}

export function convertToDottedDateString(date) {
    return date ? `${date.getFullYear()}. ${(date.getMonth() + 1).toString().padStart(2, '0')}. ${date.getDate().toString().padStart(2, '0')}.` : null;
}