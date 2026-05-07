export function calculateCalories(macros) {
    return macros.fat * 9 + (macros.fastCarbohydrate + macros.slowCarbohydrate - macros.fiber) * 4 + macros.protein * 4;
}

export function multiplyFood(macros, factor) {
    return {
        fat: macros.fat * factor,
        fatSaturated: macros.fatSaturated * factor,
        fastCarbohydrate: macros.fastCarbohydrate * factor,
        slowCarbohydrate: macros.slowCarbohydrate * factor,
        fiber: macros.fiber * factor,
        protein: macros.protein * factor
    };
}

export function sumFoods(...foods) {
    return foods.reduce((acc, food) => ({
        fat: acc.fat + food.fat,
        fatSaturated: acc.fatSaturated + food.fatSaturated,
        fastCarbohydrate: acc.fastCarbohydrate + food.fastCarbohydrate,
        slowCarbohydrate: acc.slowCarbohydrate + food.slowCarbohydrate,
        fiber: acc.fiber + food.fiber,
        protein: acc.protein + food.protein
    }), {
        fat: 0,
        fatSaturated: 0,
        fastCarbohydrate: 0,
        slowCarbohydrate: 0,
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
            fastCarbohydrate: acc.fastCarbohydrate + ingredient.food.macros.fastCarbohydrate * amountMultiple,
            slowCarbohydrate: acc.slowCarbohydrate + ingredient.food.macros.slowCarbohydrate * amountMultiple,
            fiber: acc.fiber + ingredient.food.macros.fiber * amountMultiple,
            protein: acc.protein + ingredient.food.macros.protein * amountMultiple
        });
    }, {
        fat: 0,
        fatSaturated: 0,
        fastCarbohydrate: 0,
        slowCarbohydrate: 0,
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
        fastCarbohydrate: food.fastCarbohydrate * amountMultiple,
        slowCarbohydrate: food.slowCarbohydrate * amountMultiple,
        fiber: food.fiber * amountMultiple,
        protein: food.protein * amountMultiple
    };
}