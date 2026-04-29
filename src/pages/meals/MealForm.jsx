import { createStore, unwrap } from 'solid-js/store';
import { useStore } from '../../context/StoreContext';
import styles from './MealForm.module.scss';
import appStyles from '~/App.module.scss';
import { createMemo, Show } from 'solid-js';
import { useDialogContext } from '../../context/DialogContext';
import { Button } from '@kobalte/core/button';
import { Popover } from '@kobalte/core/popover';
import TimePicker from '../../components/TimePicker';
import Dropdown from '../../components/Dropdown';
import { renderMacros } from '../../utils/renderUtils';
import { addIngredients } from '../../utils/calculations';

// props: { initialData, personIdx, dayStr, mealIdx }
export default function MealForm(props) {
    const { foods, addMeal, editMeal } = useStore();
    const { setDialogOpen } = useDialogContext();

    const initialData = props.initialData ? structuredClone(unwrap(props.initialData)) : null;

    const [formData, setFormData] = createStore(
        initialData ? {
            hour: initialData.time.split(':')[0],
            minute: initialData.time.split(':')[1],
            foods: initialData.foods,
            comment: initialData.comment
        } : {
            hour: new Date().getHours().toString().padStart(2, '0'),
            minute: new Date().getMinutes().toString().padStart(2, '0'),
            foods: [],
            comment: null
        });

    const [foodTexts, setFoodTexts] = createStore(initialData ? initialData.foods.map(f => `${f.food.name} - ${f.food.measure.label}`) : []);

    const setFormDataTime = (hour, minute) => {
        setFormData('hour', hour);
        setFormData('minute', minute);
    };

    const valid = createMemo(() => formData.hour?.trim().length > 0
        && formData.minute?.trim().length > 0
        && formData.foods.every(f => f.food && f.amount && f.amount > 0)
    );

    const macros = createMemo((macros) => {
        if (valid)
            return addIngredients(formData.foods.filter(i => (i.food && i.amount)));
        else
            return macros;
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (initialData) {
            editMeal(props.personIdx(), props.dayStr(), props.mealIdx(), {
                time: `${formData.hour}:${formData.minute}`,
                foods: formData.foods.map(i => ({ food: i.food, amount: i.amount })),
                ...macros(),
                comment: formData.comment || null
            });
            setDialogOpen(false);
            return;
        }
        addMeal(props.personIdx(), props.dayStr(), {
            time: `${formData.hour}:${formData.minute}`,
            foods: formData.foods.map(i => ({ food: i.food, amount: i.amount })),
            ...macros(),
            comment: formData.comment || null
        });

        setDialogOpen(false);
    };

    return (
        <form class={appStyles.form} onSubmit={handleSubmit}>
            <div class={appStyles.formField}>
                <span>Időpont:</span>
                <Popover modal={false}>
                    <Popover.Trigger class={styles.timeSelect}>
                        {formData.hour ? `${formData.hour}` : '––'}
                        {':'}
                        {formData.minute ? `${formData.minute}` : '––'}
                    </Popover.Trigger>
                    <Popover.Content class={styles.popover}>
                        <TimePicker
                            currentHour={formData.hour}
                            currentMinute={formData.minute}
                            setTime={setFormDataTime}
                        />
                    </Popover.Content>
                </Popover>
            </div>
            <div class={appStyles.formField}>
                <span>Ételek:</span>
                <Button
                    class={styles.foodButton}
                    onClick={() => {
                        setFormData('foods', [...formData.foods, { food: null, listIdx: null, amount: null }]);
                        setFoodTexts([...foodTexts, '']);
                    }}
                >
                    <i class={`fa-solid fa-plus`} />Új étel
                </Button>
            </div>
            <Show when={formData.foods.length > 0}>
                <div class={styles.foodsList}>
                    <For each={formData.foods}>{(food, idx) => (
                        <div class={styles.food}>
                            <div class={styles.foodHeader}>
                                <Popover modal={false}>
                                    <Popover.Trigger
                                        class={styles.foodSelect}
                                        as='input'
                                        type='text'
                                        value={foodTexts[idx()]}
                                        autocomplete='off'
                                        placeholder='Válassz ételt!'
                                        onClick={(e) => {
                                            e.currentTarget.select();
                                        }}
                                        onInput={(e) => {
                                            setFoodTexts(idx(), e.currentTarget.value);
                                        }}
                                    >

                                    </Popover.Trigger>
                                    <Popover.Content class={styles.popover}>
                                        <Dropdown
                                            items={foods.map(f => (`${f.name} - ${f.measure.label}`))}
                                            searchText={foodTexts[idx()]}
                                            selectedIdx={food.listIdx}
                                            disabledIdxs={[...formData.foods.map(i => i.listIdx).filter(i => i != null && i !== food.listIdx), props.idx?.()]}
                                            onSelect={(selectedIdx) => {
                                                const food = foods[selectedIdx];
                                                setFormData('foods', [
                                                    ...formData.foods.slice(0, idx()),
                                                    { food: food, listIdx: selectedIdx, amount: null },
                                                    ...formData.foods.slice(idx() + 1)
                                                ]);
                                                setFoodTexts(idx(), `${food.name} - ${food.measure.label}`);
                                            }}
                                        />
                                    </Popover.Content>
                                </Popover>
                                <Button
                                    class={styles.trashButton}
                                    onClick={() => {
                                        setFormData('foods', formData.foods.filter((_, i) => i !== idx()));
                                        setFoodTexts(foodTexts.filter((_, i) => i !== idx()));
                                    }}
                                >
                                    <i class={`fa-solid fa-trash`} />
                                </Button>
                            </div>
                            <div class={appStyles.formField}>
                                <label htmlFor={`amount ${idx()}`}>
                                    <Switch>
                                        <Match when={!formData.foods[idx()]?.food?.measure.key || formData.foods[idx()]?.food?.measure.key === 'HUNDRED_GRAMS'}>Tömeg (g):</Match>
                                        <Match when={formData.foods[idx()]?.food?.measure.key === 'PORTION'}>Adagszám:</Match>
                                    </Switch>
                                </label>
                                <input
                                    class={appStyles.mediumInput}
                                    id={`amount ${idx()}`}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={food.amount}
                                    onInput={(e) => setFormData('foods', idx(), 'amount', parseFloat(e.currentTarget.value || 0))}
                                />
                            </div>
                        </div>
                    )}
                    </For>
                </div>
            </Show>
            <div class={appStyles.formFieldColumn}>
                <label htmlFor='comment'>Megjegyzés:</label>
                <textarea
                    id='comment'
                    rows={4}
                    style={{ resize: 'none' }}
                    value={formData.comment}
                    onInput={(e) => setFormData('comment', e.currentTarget.value)}
                />
            </div>
            <div class={styles.macroText}>
                <span class={styles.macroTextTitle}>Tápanyag:</span>
                {renderMacros(macros())}
            </div>
            <Button type="submit" class={appStyles.formButton} disabled={!valid()}>
                Mentés
            </Button>
        </form>
    );
}