import { Button } from '@kobalte/core/button';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { Popover } from '@kobalte/core/popover';
import { createMemo, createSignal, For } from 'solid-js';
import appStyles from '~/App.module.scss';
import ConfirmDialogContent from '../../components/ConfirmDialogContent';
import DatePicker from '../../components/DatePicker';
import { useDialogContext } from '../../context/DialogContext';
import { useStore } from '../../context/StoreContext';
import { classList, translateMonth } from '../../utils/utils';
import styles from './Meals.module.scss';
import MealsList from './MealsList';
import PersonForm from './PersonForm';

const today = new Date();

export default function Meals() {
    const { people, removePerson } = useStore();
    const { setDialogData } = useDialogContext();
    const [selectedPerson, setSelectedPerson] = createSignal(people[0] ? { person: people[0], listIdx: 0 } : null);
    const [selectedDay, setSelectedDay] = createSignal({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() });

    const selectedPersonIdx = createMemo(() => selectedPerson()?.listIdx);

    const resetSelectedDay = () => {
        const today = new Date();
        setSelectedDay({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() });
    };

    const selectedDayStr = createMemo(() => {
        const day = selectedDay();
        return `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
    });

    const mealDates = createMemo(() => {
        if (!selectedPerson()) return [];
        
        return Object.keys(people[selectedPerson().listIdx].dates).map(dateStr => {
            const [year, month, day] = dateStr.split('-').map(Number);
            return { year, month: month - 1, day };
        });
    });

    const navigateDay = (direction) => {
        setSelectedDay(day => {
            const date = new Date(day.year, day.month, day.day);
            date.setDate(date.getDate() + direction);
            return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
        });
    };

    const handlePersonSelect = (person, idx) => {
        setSelectedPerson({ person, listIdx: idx });
        resetSelectedDay();
    };

    const handleAddPerson = () => {
        setDialogData(() => ({
            isOpen: true,
            title: 'Új személy',
            content: () => (
                <PersonForm
                    onSubmit={() => {
                        setSelectedPerson({ person: people[people.length - 1], listIdx: people.length - 1 });
                        resetSelectedDay();
                    }}
                />
            )
        }));
    };

    const handleEditPerson = () => {
        setDialogData(() => ({
            isOpen: true,
            title: 'Személy szerkesztése',
            content: () => (
                <PersonForm
                    initialData={selectedPerson().person}
                    idx={selectedPersonIdx}
                    onSubmit={() => {
                        setSelectedPerson(selectedPerson => ({ person: people[selectedPerson.listIdx], listIdx: selectedPerson.listIdx }));
                        resetSelectedDay();
                    }}
                />
            )
        }));
    };

    const handleDeletePerson = () => {
        setDialogData(() => ({
            isOpen: true,
            title: 'Személy törlése',
            content: () => (
                <ConfirmDialogContent
                    text={`Biztosan törli a kijelölt személyt?`}
                    onConfirm={() => {
                        const currentIdx = selectedPersonIdx();
                        let nextSelectedPerson = null;
                        if (people.length > 1) {
                            const nextIdx = currentIdx === 0 ? 1 : currentIdx - 1;
                            nextSelectedPerson = { person: people[nextIdx], listIdx: currentIdx === 0 ? 0 : nextIdx };
                        }

                        setSelectedPerson(nextSelectedPerson);
                        removePerson(currentIdx);
                        resetSelectedDay();
                    }}
                />
            )
        }));
    };

    return (
        <div class={appStyles.container}>
            <div class={styles.header}>
                <div class={styles.peopleControl}>
                    <DropdownMenu modal={false}>
                        <DropdownMenu.Trigger class={styles.dropdownButton}>
                            <span>{selectedPerson()?.person.name ?? "Válassz személyt!"}</span>
                            <DropdownMenu.Icon class={appStyles.dropdownIcon}>
                                <i class="fa-solid fa-chevron-down" />
                            </DropdownMenu.Icon>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                class={classList(appStyles.dropdownContent, styles.dropdownContent)}
                            >
                                <For each={people}>{(person, idx) =>
                                    <DropdownMenu.Item
                                        class={classList(appStyles.dropdownItem, styles.dropdownItem, selectedPerson() && selectedPersonIdx() === idx() ? appStyles.selected : '')}
                                        onSelect={() => handlePersonSelect(person, idx())}
                                    >
                                        {person.name}
                                    </DropdownMenu.Item>
                                }</For>
                                <DropdownMenu.Item
                                    class={classList(appStyles.dropdownItem, styles.dropdownItem)}
                                    focusable={false}
                                    onSelect={handleAddPerson}
                                >
                                    <i class={`fa-solid fa-plus`} />Új személy
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu>
                    <Button
                        class={styles.iconButton}
                        disabled={!selectedPerson()}
                        onClick={handleEditPerson}
                    >
                        <i class={`fa-solid fa-pen-to-square`} />
                    </Button>
                    <Button
                        class={classList(styles.iconButton, styles.trashButton)}
                        disabled={!selectedPerson()}
                        onClick={handleDeletePerson}
                    >
                        <i class={`fa-solid fa-trash`} />
                    </Button>
                </div>
                <div class={styles.dayControl}>
                    <Button
                        class={classList(styles.iconButton, styles.dayChevronButton)}
                        onClick={() => navigateDay(-1)}
                    >
                        <i class="fa-solid fa-chevron-left" />
                    </Button>
                    <Popover modal={false}>
                        <Popover.Trigger class={styles.dayText}>
                            {selectedDay().year}. {translateMonth(selectedDay().month)}. {selectedDay().day}.
                        </Popover.Trigger>
                        <Popover.Content class={styles.popover}>
                            <DatePicker currentDate={selectedDay} setDay={setSelectedDay} markedDays={mealDates} />
                        </Popover.Content>
                    </Popover>
                    <Button
                        class={classList(styles.iconButton, styles.dayChevronButton)}
                        onClick={() => navigateDay(1)}
                    >
                        <i class="fa-solid fa-chevron-right" />
                    </Button>
                </div>
            </div>
            <MealsList personIdx={selectedPersonIdx} dayStr={selectedDayStr} />
        </div>
    );
}