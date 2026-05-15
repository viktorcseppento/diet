import { Button } from '@kobalte/core/button';
import { createMemo, createResource, For, Show } from 'solid-js';
import { useConfirmDialogContext } from '../../context/ConfirmDialogContext';
import { useDialogContext } from '../../context/DialogContext';
import { getFoodsByMeal, getMealsByPersonAndDay, removeMeal } from '../../data/mealRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import { allergensFromFoods, getMacros, macrosFromIngredients, sumMacros } from '../../utils/calculations';
import { mesaureUnitToText } from '../../utils/enums';
import { renderMacros } from '../../utils/renderUtils';
import { classList, timeStrFromDateTime } from '../../utils/utils';
import MealForm from './MealForm';
import styles from './MealsList.module.scss';
import Targets from './Targets';

export default function MealsList(props) {
    const { setDialogData } = useDialogContext();
    const { setConfirmDialogData } = useConfirmDialogContext();
    const meals = createLiveQuery(() => getMealsByPersonAndDay(props.person()?.id, props.day()), props.person, props.day);

    const sortedMeals = createMemo(() => [...meals()].sort((m1, m2) => m2.timestamp - m1.timestamp));
    const [mealsWithFoodsAndMacrosAllergens] = createResource(sortedMeals, async sortedMeals => {
        return await Promise.all(sortedMeals.map(async meal => {
            const foods = await getFoodsByMeal(meal.id);
            return ({
                ...meal,
                foods,
                macros: macrosFromIngredients(foods),
                allergens: allergensFromFoods(foods.map(f => f.food))
            });
        }));
    }, { initialValue: [] });

    return (
        <div class={styles.container}>
            <Show when={props.person()?.targets.length > 0}>
                <Targets targets={props.person().targets} meals={mealsWithFoodsAndMacrosAllergens} />
            </Show>
            <div class={styles.dayMacros}>
                {renderMacros(sumMacros(...mealsWithFoodsAndMacrosAllergens().map(m => m.macros)))}
            </div>
            <Button
                disabled={!props.person()}
                class={styles.newMealButton}
                onClick={() => setDialogData(() => ({
                    isOpen: true,
                    title: 'Új étkezés',
                    content: () => (
                        <MealForm
                            personId={props.person().id}
                            day={props.day}
                        />
                    )
                }))}
            >
                <i class={`fa-solid fa-plus`} />Új étkezés
            </Button>
            <div class={styles.mealsList}>
                <For each={mealsWithFoodsAndMacrosAllergens()}>
                    {meal => (
                        <div class={styles.meal}>
                            <div class={styles.mealHeader}>
                                <div class={styles.mealTime}>{timeStrFromDateTime(meal.date)}</div>
                                <div class={styles.itemButtons}>
                                    <Button
                                        class={styles.itemButton}
                                        onClick={() => setDialogData(() => ({
                                            isOpen: true,
                                            title: 'Étkezés szerkesztése',
                                            content: () => (
                                                <MealForm
                                                    initialData={meal}
                                                    personId={props.person().id}
                                                    day={props.day}
                                                />
                                            )
                                        }))}
                                    >
                                        <i class={`fa-solid fa-pen-to-square`} />
                                    </Button>
                                    <Button
                                        class={classList(styles.itemButton, styles.trashButton)}
                                        onClick={() => setConfirmDialogData(() => ({
                                            isOpen: true,
                                            title: 'Étkezés törlése',
                                            text: 'Biztosan törölni szeretnéd ezt az étkezéset?',
                                            onConfirm: () => removeMeal(meal.id)
                                        }))}
                                    >
                                        <i class={`fa-solid fa-trash`} />
                                    </Button>
                                </div>
                            </div>
                            <div class={styles.mealContent}>
                                <div class={styles.mealMacros}>
                                    {renderMacros(meal.macros)}
                                </div>
                                <Show when={meal.comment}>
                                    <div class={styles.comment}>
                                        {`Megjegyzés: ${meal.comment}`}
                                    </div>
                                </Show>
                                <div class={styles.foodsList}>
                                    <For each={meal.foods}>{foodItem => (
                                        <div class={styles.food}>
                                            <span class={styles.foodTitle}>{`${foodItem.food.name} - ${foodItem.amount} ${mesaureUnitToText(foodItem.food.measure)}`}</span>
                                            <div class={styles.foodMacros}>
                                                {renderMacros(getMacros(foodItem.food.macros, foodItem.amount, foodItem.food.measure))}
                                            </div>
                                        </div>
                                    )}</For>
                                </div>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
}