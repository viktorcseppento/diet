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
];

export const TARGET_KEYS = [
    { id: 0, key: 'kcal', label: 'Kalória', ruleType: 'COUNTABLE', unit: 'kcal' },
    { id: 1, key: 'fat', label: 'Zsír', ruleType: 'COUNTABLE', unit: 'g' },
    { id: 2, key: 'fatSaturated', label: 'Telített zsír', ruleType: 'COUNTABLE', unit: 'g' },
    { id: 3, key: 'carbohydrate', label: 'Szénhidrát', ruleType: 'COUNTABLE', unit: 'g' },
    { id: 4, key: 'fastCarbohydrate', label: 'Gyors szénhidrát', ruleType: 'COUNTABLE', unit: 'g' },
    { id: 5, key: 'slowCarbohydrate', label: 'Lassú szénhidrát', ruleType: 'COUNTABLE', unit: 'g' },
    { id: 6, key: 'fiber', label: 'Rost', ruleType: 'COUNTABLE', unit: 'g' },
    { id: 7, key: 'protein', label: 'Fehérje', ruleType: 'COUNTABLE', unit: 'g' },
    { id: 8, key: 'addedSugar', label: 'Hozzáadott cukor', ruleType: 'BOOLEAN' },
    { id: 9, key: 'dairy', label: 'Tejtermék', ruleType: 'BOOLEAN' },
    { id: 10, key: 'egg', label: 'Tojás', ruleType: 'BOOLEAN' },
    { id: 11, key: 'gluten', label: 'Glutén', ruleType: 'BOOLEAN' },
];