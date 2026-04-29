export function calculateCalories(food) {
    return food.fat * 9 + (food.fastCarbohydrates + food.slowCarbohydrates - food.fiber) * 4 + food.protein * 4;
}

export function multiplyFood(food, factor) {
    return {
        fat: food.fat * factor,
        fatSaturated: food.fatSaturated * factor,
        fastCarbohydrates: food.fastCarbohydrates * factor,
        slowCarbohydrates: food.slowCarbohydrates * factor,
        fiber: food.fiber * factor,
        protein: food.protein * factor
    };
}

export function addFoods(...foods) {
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

// ingredients: { food: { name, measure, fat, ..., }, amount }
export function addIngredients(ingredients) {
    return ingredients.reduce((acc, ingredient) => {
        const amountMultiple = getAmountMultiple(ingredient.food.measure, ingredient.amount);
        return ({
            fat: acc.fat + ingredient.food.fat * amountMultiple,
            fatSaturated: acc.fatSaturated + ingredient.food.fatSaturated * amountMultiple,
            fastCarbohydrates: acc.fastCarbohydrates + ingredient.food.fastCarbohydrates * amountMultiple,
            slowCarbohydrates: acc.slowCarbohydrates + ingredient.food.slowCarbohydrates * amountMultiple,
            fiber: acc.fiber + ingredient.food.fiber * amountMultiple,
            protein: acc.protein + ingredient.food.protein * amountMultiple
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
    switch (measureUnit.key) {
        case 'HUNDRED_GRAMS':
            return 100 * amountMultiple;
        case 'PORTION':
            return amountMultiple;
        default:
            return 0;
    }
}

export function getAmountMultiple(measureUnit, amount) {
    switch (measureUnit.key) {
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