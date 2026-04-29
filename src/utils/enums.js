export const MEASURE_UNITS = [
    { id: 0, key: 'HUNDRED_GRAMS', label: '100g' },
    { id: 1, key: 'PORTION', label: '1 adag' }
];

export function mesaureUnitToText(measureUnit) {
    switch (measureUnit.key) {
        case 'HUNDRED_GRAMS':
            return 'g';
        case 'PORTION':
            return 'adag';
        default:
            return '';
    }
}

export const FOOD_TYPES = [
    { id: 0, key: 'BASIC', label: 'Alap' },
    { id: 1, key: 'COMPOSITE', label: 'Összetett' }
];