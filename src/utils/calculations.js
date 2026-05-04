export function calculateCalories(macros) {
    return macros.fat * 9 + (macros.fastCarbohydrates + macros.slowCarbohydrates - macros.fiber) * 4 + macros.protein * 4;
}

export function multiplyFood(macros, factor) {
    return {
        fat: macros.fat * factor,
        fatSaturated: macros.fatSaturated * factor,
        fastCarbohydrates: macros.fastCarbohydrates * factor,
        slowCarbohydrates: macros.slowCarbohydrates * factor,
        fiber: macros.fiber * factor,
        protein: macros.protein * factor
    };
}

export function sumFoods(...foods) {
    return foods.reduce((acc, food) => ({
        fat: acc.fat + food.fat,
        fatSaturated: acc.fatSaturated + food.fatSaturated,
        fastCarbohydrates: acc.fastCarbohydrates + food.fastCarbohydrates,
        slowCarbohydrates: acc.slowCarbohydrates + food.slowCarbohydrates,
        fiber: acc.fiber + food.fiber,
        protein: acc.protein + food.protein
    }), {
        fat: 0,
        fatSaturated: 0,
        fastCarbohydrates: 0,
        slowCarbohydrates: 0,
        fiber: 0,
        protein: 0
    });
}

// ingredients: { food: { name, measure, macros: { fat, ..., } }, amount }
export function sumIngredients(ingredients) {
    return ingredients.reduce((acc, ingredient) => {
        const amountMultiple = getAmountMultiple(ingredient.food.measure, ingredient.amount);
        return ({
            fat: acc.fat + ingredient.food.macros.fat * amountMultiple,
            fatSaturated: acc.fatSaturated + ingredient.food.macros.fatSaturated * amountMultiple,
            fastCarbohydrates: acc.fastCarbohydrates + ingredient.food.macros.fastCarbohydrates * amountMultiple,
            slowCarbohydrates: acc.slowCarbohydrates + ingredient.food.macros.slowCarbohydrates * amountMultiple,
            fiber: acc.fiber + ingredient.food.macros.fiber * amountMultiple,
            protein: acc.protein + ingredient.food.macros.protein * amountMultiple
        });
    }, {
        fat: 0,
        fatSaturated: 0,
        fastCarbohydrates: 0,
        slowCarbohydrates: 0,
        fiber: 0,
        protein: 0
    });
}

export function getAmount(measureUnit, amountMultiple) {
    switch (measureUnit) {
        case 'HUNDRED_GRAMS':
            return 100 * amountMultiple;
        case 'PORTION':
            return amountMultiple;
        default:
            return 0;
    }
}

export function getAmountMultiple(measureUnit, amount) {
    switch (measureUnit) {
        case 'HUNDRED_GRAMS':
            return amount / 100;
        case 'PORTION':
            return amount;
        default:
            return 0;
    }
}

export function getMacros(food, amount, measureUnit) {
    const amountMultiple = getAmountMultiple(measureUnit, amount);
    return {
        fat: food.fat * amountMultiple,
        fatSaturated: food.fatSaturated * amountMultiple,
        fastCarbohydrates: food.fastCarbohydrates * amountMultiple,
        slowCarbohydrates: food.slowCarbohydrates * amountMultiple,
        fiber: food.fiber * amountMultiple,
        protein: food.protein * amountMultiple
    };
}