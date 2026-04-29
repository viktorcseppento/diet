import { Button } from '@kobalte/core/button';
import { createMemo, For, Show } from 'solid-js';
import ConfirmDialogContent from '../../components/ConfirmDialogContent';
import { useDialogContext } from '../../context/DialogContext';
import { useStore } from '../../context/StoreContext';
import { addFoods, getMacros } from '../../utils/calculations';
import { mesaureUnitToText } from '../../utils/enums';
import { renderMacros } from '../../utils/renderUtils';
import { classList } from '../../utils/utils';
import MealForm from './MealForm';
import styles from './MealsList.module.scss';

export default function MealsList({ personIdx, dayStr }) {
    const { setDialogData } = useDialogContext();
    const { people, removeMeal } = useStore();

    const meals = createMemo(() => {
        const person = people[personIdx()];
        if (!person) return [];

        return person.dates[dayStr()] || [];
    });

    const sortedMeals = createMemo(() => meals()
        .map((meal, idx) => ({ meal, idx }))
        .sort((a, b) => a.meal.time.localeCompare(b.meal.time)));

    return (
        <div class={styles.container}>
            <div class={styles.dayMacros}>
                {renderMacros(addFoods(...meals()))}
            </div>
            <Button
                disabled={personIdx() == null}
                class={styles.newMealButton}
                onClick={() => setDialogData(() => ({
                    isOpen: true,
                    title: 'Új étkezés',
                    content: () => (
                        <MealForm
                            personIdx={personIdx}
                            dayStr={dayStr}
                        />
                    )
                }))}
            >
                <i class={`fa-solid fa-plus`} />Új étkezés
            </Button>
            <div class={styles.mealsList}>
                <For each={sortedMeals()}>
                    {mealWithIdx => (
                        <div class={styles.meal}>
                            <div class={styles.mealHeader}>
                                <div class={styles.mealTime}>{mealWithIdx.meal.time}</div>
                                <div class={styles.itemButtons}>
                                    <Button
                                        class={styles.itemButton}
                                        onClick={() => setDialogData(() => ({
                                            isOpen: true,
                                            title: 'Étkezés szerkesztése',
                                            content: () => (
                                                <MealForm
                                                    initialData={mealWithIdx.meal}
                                                    personIdx={personIdx}
                                                    dayStr={dayStr}
                                                    mealIdx={() => mealWithIdx.idx}
                                                />
                                            )
                                        }))}
                                    >
                                        <i class={`fa-solid fa-pen-to-square`} />
                                    </Button>
                                    <Button
                                        class={classList(styles.itemButton, styles.trashButton)}
                                        onClick={() => setDialogData(() => ({
                                            isOpen: true,
                                            title: 'Étkezés törlése',
                                            content: () => (
                                                <ConfirmDialogContent
                                                    text="Biztosan törölni szeretnéd ezt az étkezést?"
                                                    onConfirm={() => {
                                                        return removeMeal(personIdx(), dayStr(), mealWithIdx.idx);
                                                    }}
                                                />
                                            )
                                        }))}
                                    >
                                        <i class={`fa-solid fa-trash`} />
                                    </Button>
                                </div>
                            </div>
                            <div class={styles.mealContent}>
                                <div class={styles.mealMacros}>
                                    {renderMacros(mealWithIdx.meal)}
                                </div>
                                <Show when={mealWithIdx.meal.comment}>
                                    <div class={styles.comment}>
                                        {`Megjegyzés: ${mealWithIdx.meal.comment}`}
                                    </div>
                                </Show>
                                <div class={styles.foodsList}>
                                    <For each={mealWithIdx.meal.foods}>{foodItem => (
                                        <div class={styles.food}>
                                            <span class={styles.foodTitle}>{`${foodItem.food.name} - ${foodItem.amount} ${mesaureUnitToText(foodItem.food.measure)}`}</span>
                                            <div class={styles.foodMacros}>
                                                {renderMacros(getMacros(foodItem.food, foodItem.amount, foodItem.food.measure))}
                                            </div>
                                        </div>
                                    )}</For>
                                </div>
                            </div>
                        </div>
                    )}
                </For>
            </div >
        </div >
    );
}