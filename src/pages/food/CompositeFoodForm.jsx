import styles from './CompositeFoodForm.module.scss';
import appStyles from '~/App.module.scss';
import { FOOD_TYPES, MEASURE_UNITS } from '../../utils/enums';
import { createStore, unwrap } from 'solid-js/store';
import { createEffect, createMemo, For, Match, Show, Switch } from 'solid-js';
import { Button } from '@kobalte/core/button';
import { useStore } from '../../context/StoreContext';
import { useDialogContext } from '../../context/DialogContext';
import { addIngredients, getAmountMultiple, multiplyFood } from '../../utils/calculations';
import { renderMacros } from '../../utils/renderUtils';
import { Popover } from '@kobalte/core/popover';
import Dropdown from '../../components/Dropdown';

export default function CompositeFoodForm(props) {
    const { foods, addFood, editFood } = useStore();
    const { setDialogOpen } = useDialogContext();

    const initialData = props.initialData ? structuredClone(unwrap(props.initialData)) : null;

    const [formData, setFormData] = createStore(
        initialData ? initialData : {
            name: '',
            ingredients: [],
            measure: { ...MEASURE_UNITS[0] },
            amount: null
        });

    const [ingredientTexts, setIngredientTexts] = createStore(initialData ? initialData.ingredients.map(i => `${i.food.name} - ${i.food.measure.label}`) : []);

    const valid = createMemo(() => {
        return formData.name.trim().length > 0 &&
            formData.ingredients.length > 0 &&
            formData.ingredients.every(i => i.food && i.amount && i.amount > 0) &&
            formData.amount != null && formData.amount > 0;
    });

    const allMacros = createMemo((allMacros) => {
        if (valid)
            return addIngredients(formData.ingredients.filter(i => (i.food && i.amount)));
        else
            return allMacros;
    });

    const macros = createMemo((macros) => {
        if (valid) {
            const amountMultiple = getAmountMultiple(formData.measure, formData.amount);
            return { ...multiplyFood(allMacros(), 1 / amountMultiple) };
        }
        else
            return macros;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initialData) {
            editFood(props.idx(), {
                type: FOOD_TYPES.find(t => t.key === 'COMPOSITE'),
                name: formData.name,
                measure: formData.measure,
                amount: formData.amount,
                ingredients: formData.ingredients.map(i => ({ food: i.food, amount: i.amount })),
                ...macros()
            });
            setDialogOpen(false);
            return;
        }
        addFood({
            type: FOOD_TYPES.find(t => t.key === 'COMPOSITE'),
            name: formData.name,
            measure: formData.measure,
            amount: formData.amount,
            ingredients: formData.ingredients.map(i => ({ food: i.food, amount: i.amount })),
            ...macros()
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
                        setFormData('ingredients', [...formData.ingredients, { food: null, listIdx: null, amount: null }]);
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
                                <Popover modal={false}>
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
                                            items={foods.map(f => (`${f.name} - ${f.measure.label}`))}
                                            searchText={ingredientTexts[idx()]}
                                            selectedIdx={ingredient.listIdx}
                                            disabledIdxs={[...formData.ingredients.map(i => i.listIdx).filter(i => i != null && i !== ingredient.listIdx), props.idx?.()]}
                                            onSelect={(selectedIdx) => {
                                                const food = foods[selectedIdx];
                                                setFormData('ingredients', [
                                                    ...formData.ingredients.slice(0, idx()),
                                                    { food: food, listIdx: selectedIdx, amount: null },
                                                    ...formData.ingredients.slice(idx() + 1)
                                                ]);
                                                setIngredientTexts(idx(), `${food.name} - ${food.measure.label}`);
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
                                        <Match when={!formData.ingredients[idx()]?.food?.measure.key || formData.ingredients[idx()]?.food?.measure.key === 'HUNDRED_GRAMS'}>Tömeg (g):</Match>
                                        <Match when={formData.ingredients[idx()]?.food?.measure.key === 'PORTION'}>Adagszám:</Match>
                                    </Switch>
                                </label>
                                <input
                                    class={appStyles.mediumInput}
                                    id={`amount ${idx()}`}
                                    type="number"
                                    min={0}
                                    step="0.01"
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
                        step="0.01"
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