import { calculateCalories } from "./calculations";
import { formatNumber } from "./utils";

export function renderMacros(macros) {
    return <>
        <span>{`Energia: ${formatNumber(calculateCalories(macros))} kcal`}</span>
        <span>{`Zsír: ${formatNumber(macros.fat)} g (telített: ${formatNumber(macros.fatSaturated)} g)`}</span>
        <span>{`Szénhidrát: ${formatNumber(macros.fastCarbohydrates + macros.slowCarbohydrates)} g (gyors: ${formatNumber(macros.fastCarbohydrates)} g - lassú: ${formatNumber(macros.slowCarbohydrates)} g - rost: ${formatNumber(macros.fiber)} g)`}</span>
        <span>{`Fehérje: ${formatNumber(macros.protein)} g`}</span>
    </>;
}