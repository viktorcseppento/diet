import { calculateCalories } from "./calculations";
import { formatNumber } from "./utils";

export function renderMacros(food) {
    return <>
        <span>{`Energia: ${formatNumber(calculateCalories(food))} kcal`}</span>
        <span>{`Zsír: ${formatNumber(food.fat)} g (telített: ${formatNumber(food.fatSaturated)} g)`}</span>
        <span>{`Szénhidrát: ${formatNumber(food.fastCarbohydrates + food.slowCarbohydrates)} g (gyors: ${formatNumber(food.fastCarbohydrates)} g - lassú: ${formatNumber(food.slowCarbohydrates)} g - rost: ${formatNumber(food.fiber)} g)`}</span>
        <span>{`Fehérje: ${formatNumber(food.protein)} g`}</span>
    </>;
}