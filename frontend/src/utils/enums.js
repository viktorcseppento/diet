export const MEASURE_UNITS = [
    { id: 0, key: 'HUNDRED_GRAMS', label: '100g' },
    { id: 1, key: 'PORTION', label: '1 adag' }
];

export function measureUnitToLabel(measureUnit) {
    return MEASURE_UNITS.find(mu => mu.key === measureUnit)?.label || '';
}

export function mesaureUnitToText(measureUnit) {
    switch (measureUnit) {
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

export const RULES = [
    { id: 0, key: 'MINIMUM', label: 'Minimum' },
    { id: 1, key: 'MAXIMUM', label: 'Maximum' },
    { id: 2, key: 'FREE', label: 'Mentes' },
]