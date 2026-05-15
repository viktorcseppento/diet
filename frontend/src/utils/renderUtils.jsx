import { calculateCalories } from "./calculations";
import { formatNumber } from "./utils";

export function renderMacros(macros) {
    return <>
        <span>{`Energia: ${formatNumber(calculateCalories(macros))} kcal`}</span>
        <span>{`Zsír: ${formatNumber(macros.fat)} g (telített: ${formatNumber(macros.fatSaturated)} g)`}</span>
        <span>{`Szénhidrát: ${formatNumber(macros.fastCarbohydrate + macros.slowCarbohydrate)} g (gyors: ${formatNumber(macros.fastCarbohydrate)} g - lassú: ${formatNumber(macros.slowCarbohydrate)} g)`}</span>
        <span>{`Rost: ${formatNumber(macros.fiber)} g`}</span>
        <span>{`Fehérje: ${formatNumber(macros.protein)} g`}</span>
    </>;
}

export function renderMacrosAndAllergens(macros, allergens) {
    return <>
        <span>{`Energia: ${formatNumber(calculateCalories(macros))} kcal`}</span>
        <span>{`Zsír: ${formatNumber(macros.fat)} g (telített: ${formatNumber(macros.fatSaturated)} g)`}</span>
        <span>{`Szénhidrát: ${formatNumber(macros.fastCarbohydrate + macros.slowCarbohydrate)} g (gyors: ${formatNumber(macros.fastCarbohydrate)} g - lassú: ${formatNumber(macros.slowCarbohydrate)} g)`}</span>
        <span>{`Rost: ${formatNumber(macros.fiber)} g`}</span>
        <span>{`Fehérje: ${formatNumber(macros.protein)} g`}</span>
        <span>{`Hozzáadott cukor: ${allergens.addedSugar ? 'igen' : 'nem'}`}</span>
        <span>{`Tejtermék: ${allergens.dairy ? 'igen' : 'nem'}`}</span>
        <span>{`Tojás: ${allergens.egg ? 'igen' : 'nem'}`}</span>
        <span>{`Glutén: ${allergens.gluten ? 'igen' : 'nem'}`}</span>
    </>;
}