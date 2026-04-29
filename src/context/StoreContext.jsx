import { createContext, createEffect, on, useContext } from "solid-js";
import { createStore } from "solid-js/store";

// people: { name, dates: { "2026-04-20": [{ time: "10:21", fat, carbohydrates, ... , comment, foods: [ { food: { name, measure, fat, ..., }, amount }] }] } }

function getInitialFoods() {
    const foods = localStorage.getItem('foods');
    return foods ? JSON.parse(foods) : [];
}

function getInitialPeople() {
    const people = localStorage.getItem('people');
    return people ? JSON.parse(people) : [];
}

export const StoreContext = createContext();

export function StoreProvider(props) {
    const [foods, setFoods] = createStore(getInitialFoods());
    const [people, setPeople] = createStore(getInitialPeople());

    createEffect(
        on(
            () => [...foods],
            (foods) => {
                localStorage.setItem('foods', JSON.stringify(foods));
            },
            { defer: true })
    );

    createEffect(
        on(
            () => [...people],
            (people) => {
                localStorage.setItem('people', JSON.stringify(people));
            },
            { defer: true })
    );

    const store =
    {
        foods,
        people,
        addFood(food) {
            setFoods(foods => ([food, ...foods]));
        },
        editFood(idx, newFood) {
            setFoods(foods => foods.map((food, i) => i === idx ? newFood : food));
        },
        removeFood(idx) {
            setFoods(foods => foods.filter((_, i) => i !== idx));
        },
        addPerson(person) {
            setPeople(people => ([...people, person]));
        },
        editPerson(idx, newPerson) {
            setPeople(people => people.map((person, i) => i === idx ? newPerson : person));
        },
        removePerson(idx) {
            setPeople(people => people.filter((_, i) => i !== idx));
        },
        addMeal(personIdx, dateStr, meal) {
            setPeople(people => people.map((person, i) => {
                if (i !== personIdx) return person;

                let newDates = {}
                Object.entries(person.dates).forEach(([key, meals]) => {
                    if (key === dateStr) {
                        newDates[key] = [...meals, meal];
                    } else {
                        newDates[key] = meals;
                    }
                });
                if (!newDates[dateStr]) {
                    newDates[dateStr] = [meal];
                }

                return {
                    ...person,
                    dates: newDates
                };
            }));
        },
        editMeal(personIdx, dateStr, mealIdx, newMeal) {
            setPeople(people => people.map((person, i) => {
                if (i !== personIdx) return person;

                let newDates = {}
                Object.entries(person.dates).forEach(([key, meals]) => {
                    if (key === dateStr) {
                        newDates[key] = meals.map((meal, idx) => idx === mealIdx ? newMeal : meal);
                    } else {
                        newDates[key] = meals;
                    }
                });

                return {
                    ...person,
                    dates: newDates
                };
            }));
        },
        removeMeal(personIdx, dateStr, mealIdx) {
            setPeople(people => people.map((person, i) => {
                if (i !== personIdx) return person;

                let newDates = {}
                Object.entries(person.dates).forEach(([key, meals]) => {
                    if (key === dateStr) {
                        const newMeals = meals.filter((_, idx) => idx !== mealIdx);
                        if (newMeals.length > 0) {
                            newDates[key] = newMeals;
                        }
                    } else {
                        newDates[key] = meals;
                    }
                });

                return {
                    ...person,
                    dates: newDates
                };
            }));
        }
    };

    return (
        <StoreContext.Provider value={store} >
            {props.children}
        </StoreContext.Provider >
    );
}

export function useStore() {
    return useContext(StoreContext);
}