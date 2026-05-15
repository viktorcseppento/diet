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

export function sumMacros(...macrosList) {
    return macrosList.reduce((acc, macros) => ({
        fat: acc.fat + macros.fat,
        fatSaturated: acc.fatSaturated + macros.fatSaturated,
        fastCarbohydrate: acc.fastCarbohydrate + macros.fastCarbohydrate,
        slowCarbohydrate: acc.slowCarbohydrate + macros.slowCarbohydrate,
        fiber: acc.fiber + macros.fiber,
        protein: acc.protein + macros.protein
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
export function macrosFromIngredients(ingredients) {
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

export function allergensFromFoods(foods) {
    return {
        addedSugar: foods.some(f => f.allergens.addedSugar),
        dairy: foods.some(f => f.allergens.dairy),
        egg: foods.some(f => f.allergens.egg),
        gluten: foods.some(f => f.allergens.gluten)
    }
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

export function allTargetableValuesFromFoods(foods) {
    return {
        ...foods.reduce((acc, f) => {
            return {
                kcal: acc.kcal + calculateCalories(f.macros),
                fat: acc.fat + f.macros.fat,
                fatSaturated: acc.fatSaturated + f.macros.fatSaturated,
                carbohydrate: acc.carbohydrate + f.macros.fastCarbohydrate + f.macros.slowCarbohydrate,
                fastCarbohydrate: acc.fastCarbohydrate + f.macros.fastCarbohydrate,
                slowCarbohydrate: acc.slowCarbohydrate + f.macros.slowCarbohydrate,
                fiber: acc.fiber + f.macros.fiber,
                protein: acc.protein + f.macros.protein
            };
        }, {
            kcal: 0,
            fat: 0,
            fatSaturated: 0,
            carbohydrate: 0,
            fastCarbohydrate: 0,
            slowCarbohydrate: 0,
            fiber: 0,
            protein: 0
        }),
        addedSugar: foods.some(f => f.allergens.addedSugar),
        dairy: foods.some(f => f.allergens.dairy),
        egg: foods.some(f => f.allergens.egg),
        gluten: foods.some(f => f.allergens.gluten)
    }
}