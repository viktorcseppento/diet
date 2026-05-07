import { Button } from '@kobalte/core/button';
import { Popover } from '@kobalte/core/popover';
import { createEffect, createMemo, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import appStyles from '~/App.module.scss';
import Dropdown from '../../components/Dropdown';
import TimePicker from '../../components/TimePicker';
import { useDialogContext } from '../../context/DialogContext';
import { getFoods } from '../../data/foodRepository';
import { addMeal, editMeal } from '../../data/mealRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import { sumIngredients } from '../../utils/calculations';
import { MEASURE_UNITS } from '../../utils/enums';
import { renderMacros } from '../../utils/renderUtils';
import { timeStrFromDateTime } from '../../utils/utils';
import styles from './MealForm.module.scss';

// props: { initialData, day, personId }
export default function MealForm(props) {
    const foods = createLiveQuery(getFoods);
    const { setDialogOpen } = useDialogContext();

    const [formData, setFormData] = createStore(
        props.initialData ? {
            hour: timeStrFromDateTime(props.initialData.date).split(':')[0],
            minute: timeStrFromDateTime(props.initialData.date).split(':')[1],
            foods: props.initialData.foods,
            comment: props.initialData.comment
        } : {
            hour: new Date().getHours().toString().padStart(2, '0'),
            minute: new Date().getMinutes().toString().padStart(2, '0'),
            foods: [],
            comment: null
        });

    const [foodTexts, setFoodTexts] = createStore([]);

    createEffect(() => {
        setFoodTexts(props.initialData ? props.initialData.foods.map(f => `${f.food.name} - ${MEASURE_UNITS.find(m => m.key === f.food.measure).label}`) : []);
    });

    const setFormDataTime = (hour, minute) => {
        setFormData('hour', hour);
        setFormData('minute', minute);
    };

    const valid = createMemo(() => formData.hour?.trim().length > 0
        && formData.minute?.trim().length > 0
        && formData.foods.every(f => f.food && f.amount && f.amount > 0)
    );

    const dateFromTimeStr = function (hourStr, minuteStr) {
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        const date = new Date(props.day().year, props.day().month, props.day().day, hour, minute);
        return date.getTime();
    }

    const macros = createMemo(() => {
        if (valid())
            return sumIngredients(formData.foods.filter(i => (i.food && i.amount)));
        else
            return {};
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (props.initialData) {
            await editMeal(props.initialData.id, {
                date: dateFromTimeStr(formData.hour, formData.minute),
                foods: formData.foods.map(i => ({ foodId: i.food.id, amount: i.amount })),
                comment: formData.comment || null
            });
            setDialogOpen(false);
            return;
        }
        await addMeal({
            personId: props.personId,
            date: dateFromTimeStr(formData.hour, formData.minute),
            foods: formData.foods.map(i => ({ foodId: i.food.id, amount: i.amount })),
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
                        setFormData('foods', [...formData.foods, { food: null, amount: null }]);
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
                                            items={foods().map(f => ({
                                                id: f.id,
                                                name: `${f.name} - ${MEASURE_UNITS.find(m => m.key === f.measure).label}`
                                            }))}
                                            searchText={foodTexts[idx()]}
                                            selectedId={food.id}
                                            disabledIds={[...formData.foods.map(f => f.food?.id).filter(foodId => foodId !== food.id), props.initialData?.id]}
                                            onSelect={(selectedId) => {
                                                const food = foods().find(f => f.id === selectedId);
                                                setFormData('foods', [
                                                    ...formData.foods.slice(0, idx()),
                                                    { food: food, amount: null },
                                                    ...formData.foods.slice(idx() + 1)
                                                ]);
                                                setFoodTexts(idx(), `${food.name} - ${MEASURE_UNITS.find(m => m.key === food.measure).label}`);
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
                                        <Match when={!formData.foods[idx()]?.food?.measure || formData.foods[idx()]?.food?.measure === 'HUNDRED_GRAMS'}>Tömeg (g):</Match>
                                        <Match when={formData.foods[idx()]?.food?.measure === 'PORTION'}>Adagszám:</Match>
                                    </Switch>
                                </label>
                                <input
                                    class={appStyles.mediumInput}
                                    id={`amount ${idx()}`}
                                    type="number"
                                    min={0}
                                    step="0.001"
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