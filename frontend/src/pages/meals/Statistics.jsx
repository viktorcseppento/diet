import { createMemo, createResource, For, Show } from 'solid-js';
import { getFoodsByMeal, getMealsByPerson } from '../../data/mealRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import { allergensFromFoods, allTargetableValuesFromFoods, macrosFromIngredients } from '../../utils/calculations';
import { TARGET_KEYS } from '../../utils/enums';
import { formatNumber } from '../../utils/utils';
import styles from './Statistics.module.scss';

const CURRENT_DAY = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
export default function Statistics(props) {
    const meals = createLiveQuery(() => getMealsByPerson(props.person().id), props.person);
    const [dailyConsumptions] = createResource(meals, async meals => {
        const mealsMacrosAllergens = await Promise.all(meals.map(async meal => {
            const foods = await getFoodsByMeal(meal.id);
            return ({
                date: meal.date,
                macros: macrosFromIngredients(foods),
                allergens: allergensFromFoods(foods.map(f => f.food))
            });
        }));
        const mealsByDay = {};
        mealsMacrosAllergens.forEach(meal => {
            const dayIndex = Math.floor(meal.date / (1000 * 60 * 60 * 24))
            if (!mealsByDay[dayIndex])
                mealsByDay[dayIndex] = [];
            mealsByDay[dayIndex].push(meal);
        });
        const dailyConsumptions = {};
        Object.entries(mealsByDay).forEach(([day, meals]) => {
            dailyConsumptions[day] = allTargetableValuesFromFoods(meals);
        })
        return dailyConsumptions;
    }, { initialValue: {} });

    const numOfDays = createMemo(() => Object.keys(dailyConsumptions()).length);
    const statistics = createMemo(() => {
        const consumptions = {};
        TARGET_KEYS.forEach(targetKey => {
            if (targetKey.ruleType === 'COUNTABLE')
                consumptions[targetKey.key] = {
                    min: Number.MAX_VALUE,
                    max: 0,
                    sum: 0,
                    avg: 0,
                    type: 'COUNTABLE',
                    key: targetKey
                }
            else if (targetKey.ruleType === 'BOOLEAN') {
                consumptions[targetKey.key] = {
                    freeNum: 0,
                    type: 'BOOLEAN',
                    key: targetKey
                }
            }
        });

        const targets = props.person().targets.map(target => ({
            ...target,
            reachedNum: 0,
            maxStreak: 0,
            currentStreak: 0
        }));
        let prevDay = -1;
        Object.entries(dailyConsumptions()).forEach(([day, dailyConsumption]) => {
            TARGET_KEYS.forEach(targetKey => {
                if (targetKey.ruleType === 'COUNTABLE') {
                    consumptions[targetKey.key] = {
                        ...consumptions[targetKey.key],
                        min: Math.min(consumptions[targetKey.key].min, dailyConsumption[targetKey.key]),
                        sum: consumptions[targetKey.key].sum + dailyConsumption[targetKey.key],
                        max: Math.max(consumptions[targetKey.key].max, dailyConsumption[targetKey.key])
                    }
                }
                else if (targetKey.ruleType === 'BOOLEAN') {
                    consumptions[targetKey.key] = {
                        ...consumptions[targetKey.key],
                        freeNum: consumptions[targetKey.key].freeNum + (dailyConsumption[targetKey.key] ? 0 : 1)
                    }
                }
            });

            targets.forEach(target => {
                let reached = false;
                if (target.rule === 'MINIMUM') {
                    if (dailyConsumption[target.key] >= target.value)
                        reached = true;
                }
                else if (target.rule === 'MAXIMUM') {
                    if (dailyConsumption[target.key] <= target.value)
                        reached = true;
                }
                else if (target.rule === 'FREE') {
                    if (!dailyConsumption[target.key])
                        reached = true;
                }

                if (reached) {
                    target.reachedNum++;
                    if (day - prevDay === 1)
                        target.currentStreak++;
                    else if (target.currentStreak === 0)
                        target.currentStreak = 1;

                    if (target.currentStreak > target.maxStreak)
                        target.maxStreak = target.currentStreak;
                }
                else if (day === CURRENT_DAY && target.rule === 'MINIMUM') {
                    return;
                }
                else {
                    target.currentStreak = 0;
                }
            });
            prevDay = day;
        });

        TARGET_KEYS.filter(t => t.ruleType === 'COUNTABLE').forEach(targetKey => {
            consumptions[targetKey.key].avg = consumptions[targetKey.key].sum / numOfDays();
        })

        return { consumptions, targets };
    });

    return (
        <div class={styles.container}>
            <div class={styles.header}>
                <span>{`Napok száma: ${numOfDays()}`}</span>
                <span>{`Étkezések száma: ${meals().length}`}</span>
            </div>
            <Show when={props.person().targets.length > 0}>
                <div class={styles.targets}>
                    <For each={statistics().targets}>
                        {target => (
                            <div class={styles.target}>
                                <div class={styles.targetHeader}>
                                    {target.name}
                                </div>
                                <div class={styles.targetContent}>
                                    <span>{`Arány: ${formatNumber(target.reachedNum / numOfDays() * 100, 0)}% (${target.reachedNum})`}</span>
                                    <span>{`Leghosszabb sorozat: ${target.maxStreak}`}</span>
                                    <span>{`Jelenlegi sorozat: ${target.currentStreak}`}</span>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>
            <div class={styles.grids}>
                <div class={styles.macros}>
                    <div class={styles.tableHeader}></div>
                    <div class={styles.tableHeader}>Minimum</div>
                    <div class={styles.tableHeader}>Maximum</div>
                    <div class={styles.tableHeader}>Átlag</div>
                    <For each={Object.values(statistics().consumptions).filter(c => c.type === 'COUNTABLE')}>
                        {consumption => (
                            <>
                                <div>{`${consumption.key.label} (${consumption.key.unit})`}</div>
                                <div>{formatNumber(consumption.min)}</div>
                                <div>{formatNumber(consumption.max)}</div>
                                <div>{formatNumber(consumption.avg)}</div>
                            </>
                        )}
                    </For>
                </div>
                <div class={styles.allergens}>
                    <div class={styles.tableHeader}></div>
                    <div class={styles.tableHeader}>Mentes nap</div>
                    <For each={Object.values(statistics().consumptions).filter(c => c.type === 'BOOLEAN')}>
                        {consumption => (
                            <>
                                <div>{`${consumption.key.label}`}</div>
                                <div>{`${formatNumber(consumption.freeNum)} (${formatNumber(consumption.freeNum / numOfDays() * 100, 0)}%)`}</div>
                            </>
                        )}
                    </For>
                </div>
            </div>
        </div>
    );
}