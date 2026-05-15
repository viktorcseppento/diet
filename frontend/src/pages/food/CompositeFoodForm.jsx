import { Button } from '@kobalte/core/button';
import { Popover } from '@kobalte/core/popover';
import { createEffect, createMemo, For, Match, Show, Switch } from 'solid-js';
import { createStore } from 'solid-js/store';
import appStyles from '~/App.module.scss';
import Dropdown from '../../components/Dropdown';
import { useDialogContext } from '../../context/DialogContext';
import { addFood, editFood, getFoods, getIngredients } from '../../data/foodRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import { getAmountMultiple, multiplyFood, macrosFromIngredients, allergensFromFoods } from '../../utils/calculations';
import { MEASURE_UNITS } from '../../utils/enums';
import { renderMacros } from '../../utils/renderUtils';
import { foodNameWithMeasure } from '../../utils/utils';
import styles from './CompositeFoodForm.module.scss';

export default function CompositeFoodForm(props) {
    const foods = createLiveQuery(getFoods);
    const ingredients = createLiveQuery(() => getIngredients(props.initialData?.id));
    const { setDialogOpen } = useDialogContext();

    const [formData, setFormData] = createStore(
        props.initialData ? {
            name: props.initialData.name,
            ingredients: [],
            measure: { ...MEASURE_UNITS.find(m => m.key === props.initialData.measure) },
            amount: props.initialData.amount
        } : {
            name: '',
            ingredients: [],
            measure: { ...MEASURE_UNITS[0] },
            amount: null
        });

    const [ingredientTexts, setIngredientTexts] = createStore([]);

    createEffect(() => {
        setFormData('ingredients', ingredients());
        setIngredientTexts(ingredients().map(i => foodNameWithMeasure(i.food)));
    });

    const ingredientsValid = createMemo(() =>
        formData.ingredients.length > 0 && formData.ingredients.every(i => i.food && i.amount && i.amount > 0));

    const valid = createMemo(() => {
        return formData.name.trim().length > 0 &&
            ingredientsValid() &&
            formData.amount != null && formData.amount > 0;
    });

    const allMacros = createMemo(() => {
        if (ingredientsValid())
            return macrosFromIngredients(formData.ingredients.filter(i => (i.food && i.amount)));
        else
            return {};
    });

    const macros = createMemo(() => {
        if (ingredientsValid() && formData.amount > 0 && formData.measure) {
            const amountMultiple = getAmountMultiple(formData.measure.key, formData.amount);
            return multiplyFood(allMacros(), 1 / amountMultiple);
        }
        else
            return {};
    });

    const allergens = createMemo(() => {
        if (ingredientsValid() && formData.amount > 0 && formData.measure) {
            return allergensFromFoods(formData.ingredients.map(i => i.food));
        }
        else
            return {};
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (props.initialData) {
            await editFood(props.initialData.id, {
                type: 'COMPOSITE',
                name: formData.name.trim(),
                measure: formData.measure.key,
                amount: formData.amount,
                ingredients: formData.ingredients.map(i => ({ foodId: i.food.id, foodName: i.food.name, amount: i.amount })),
                macros: macros(),
                allergens: allergens()
            });
            setDialogOpen(false);
            return;
        }
        await addFood({
            type: 'COMPOSITE',
            name: formData.name.trim(),
            measure: formData.measure.key,
            amount: formData.amount,
            ingredients: formData.ingredients.map(i => ({ foodId: i.food.id, foodName: i.food.name, amount: i.amount })),
            macros: macros(),
            allergens: allergens()
        });
        setDialogOpen(false);
    };

    return (
        <form class={appStyles.form} onsubmit={handleSubmit}>
            <div class={appStyles.formField}>
                <label htmlFor='name'>Név:</label>
                <input
                    ref={(el) => setTimeout(() => el.focus(), 10)}
                    id='name'
                    autocomplete='food'
                    type="text"
                    value={formData.name}
                    onInput={(e) => setFormData('name', e.currentTarget.value)}
                />
            </div>
            <div class={appStyles.formField}>
                <span>Hozzávalók:</span>
                <Button
                    class={styles.ingredientButton}
                    onClick={() => {
                        setFormData('ingredients', [...formData.ingredients, { food: null, amount: null }]);
                        setIngredientTexts([...ingredientTexts, '']);
                    }}
                >
                    <i class={`fa-solid fa-plus`} />Új hozzávaló
                </Button>
            </div>
            <Show when={formData.ingredients.length > 0}>
                <div class={styles.ingredientsList}>
                    <For each={formData.ingredients}>{(ingredient, idx) => (
                        <div class={styles.ingredient}>
                            <div class={styles.ingredientHeader}>
                                <Popover
                                    modal={false}
                                    onOpenChange={(open) => {
                                        if (open)
                                            return;
                                        const food = formData.ingredients[idx()].food;
                                        const foodName = food ? foodNameWithMeasure(food) : '';
                                        setIngredientTexts(idx(), foodName ?? '');
                                    }}
                                >
                                    <Popover.Trigger
                                        class={styles.foodSelect}
                                        as='input'
                                        id={`ingredient ${idx()}`}
                                        type='text'
                                        value={ingredientTexts[idx()]}
                                        autocomplete='off'
                                        placeholder='Válassz hozzávalót!'
                                        onClick={(e) => {
                                            e.currentTarget.select();
                                        }}
                                        onInput={(e) => {
                                            setIngredientTexts(idx(), e.currentTarget.value);
                                        }}
                                    >
                                    </Popover.Trigger>
                                    <Popover.Content class={styles.popover}>
                                        <Dropdown
                                            items={foods().map(f => ({
                                                id: f.id,
                                                name: foodNameWithMeasure(f)
                                            }))}
                                            searchText={ingredientTexts[idx()]}
                                            selectedId={ingredient.food?.id}
                                            disabledIds={[...formData.ingredients.map(i => i.food?.id).filter(i => i !== ingredient.id), props.initialData?.id]}
                                            onSelect={(selectedId) => {
                                                const food = foods().find(f => f.id === selectedId);
                                                const currentData = formData.ingredients[idx()];
                                                setFormData('ingredients', [
                                                    ...formData.ingredients.slice(0, idx()),
                                                    { ...currentData, food: food },
                                                    ...formData.ingredients.slice(idx() + 1)
                                                ]);
                                                setIngredientTexts(idx(), foodNameWithMeasure(food));
                                            }}
                                        />
                                    </Popover.Content>
                                </Popover>
                                <Button
                                    class={styles.trashButton}
                                    onClick={() => {
                                        setFormData('ingredients', formData.ingredients.filter((_, i) => i !== idx()));
                                        setIngredientTexts(ingredientTexts.filter((_, i) => i !== idx()));
                                    }}
                                >
                                    <i class={`fa-solid fa-trash`} />
                                </Button>
                            </div>
                            <div class={appStyles.formField}>
                                <label htmlFor={`amount ${idx()}`}>
                                    <Switch>
                                        <Match when={!formData.ingredients[idx()]?.food?.measure || formData.ingredients[idx()]?.food?.measure === 'HUNDRED_GRAMS'}>Tömeg (g):</Match>
                                        <Match when={formData.ingredients[idx()]?.food?.measure === 'PORTION'}>Adagszám:</Match>
                                    </Switch>
                                </label>
                                <input
                                    class={appStyles.mediumInput}
                                    id={`amount ${idx()}`}
                                    type="number"
                                    min={0}
                                    step="0.001"
                                    value={ingredient.amount}
                                    onInput={(e) => setFormData('ingredients', idx(), 'amount', parseFloat(e.currentTarget.value || 0))}
                                />
                            </div>
                        </div>
                    )}
                    </For>
                </div>
            </Show>
            <div class={appStyles.formRow}>
                <div class={appStyles.formField}>
                    <label htmlFor='measure'>Mérés:</label>
                    <select
                        id='measure'
                        value={formData.measure.id}
                        onInput={(e) => {
                            setFormData('measure', MEASURE_UNITS[e.currentTarget.value]);
                            setFormData('amount', null);
                        }}
                    >
                        <For each={MEASURE_UNITS}>{(unit) => (
                            <option value={unit.id}>{unit.label}</option>
                        )}</For>
                    </select>
                </div>
                <div class={appStyles.formField}>
                    <label htmlFor='fullAmount'>
                        <Switch>
                            <Match when={formData.measure.key === 'HUNDRED_GRAMS'}>Össztömeg (g):</Match>
                            <Match when={formData.measure.key === 'PORTION'}>Adagszám:</Match>
                        </Switch>
                    </label>
                    <input
                        class={appStyles.mediumInput}
                        id='fullAmount'
                        type="number"
                        step="0.001"
                        min={0}
                        value={formData.amount}
                        onInput={(e) => setFormData('amount', parseFloat(e.currentTarget.value || 0))}
                    />
                </div>
            </div>
            <div class={styles.macroText}>
                <span class={styles.macroTextTitle}>Tápanyag:</span>
                {renderMacros(macros())}
            </div>

            <Button type='submit' class={appStyles.formButton} disabled={!valid()}>Mentés</Button>
        </form >
    );
}