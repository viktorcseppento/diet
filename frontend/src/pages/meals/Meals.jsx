import { Button } from '@kobalte/core/button';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { Popover } from '@kobalte/core/popover';
import { createEffect, createMemo, createSignal, For } from 'solid-js';
import appStyles from '~/App.module.scss';
import DatePicker from '../../components/DatePicker';
import { useConfirmDialogContext } from '../../context/ConfirmDialogContext';
import { useDialogContext } from '../../context/DialogContext';
import { getMealDatesByPerson } from '../../data/mealRepository';
import { getPeople, removePerson } from '../../data/personRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import { classList, translateMonth } from '../../utils/utils';
import styles from './Meals.module.scss';
import MealsList from './MealsList';
import PersonForm from './PersonForm';

const today = new Date();

export default function Meals() {
    const people = createLiveQuery(getPeople);
    const { setDialogData } = useDialogContext();
    const { setConfirmDialogData } = useConfirmDialogContext();
    const [selectedPersonIdx, setSelectedPersonIdx] = createSignal();
    const [selectedDay, setSelectedDay] = createSignal({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() });

    const selectedPerson = createMemo(() => selectedPersonIdx() != null ? people()[selectedPersonIdx()] : null);
    const mealDates = createLiveQuery(() => getMealDatesByPerson(selectedPerson()?.id), selectedPerson);

    const isToday = createMemo(() =>
        selectedDay().year === today.getFullYear() &&
        selectedDay().month === today.getMonth() &&
        selectedDay().day === today.getDate()
    );

    createEffect(() => {
        if (people().length === 0) {
            setSelectedPersonIdx(null);
        }

        if (selectedPersonIdx() == null && people().length > 0) {
            setSelectedPersonIdx(0);
        }
    });

    const resetSelectedDay = () => {
        const today = new Date();
        setSelectedDay({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() });
    };

    const navigateDay = (direction) => {
        setSelectedDay(day => {
            const date = new Date(day.year, day.month, day.day);
            date.setDate(date.getDate() + direction);
            return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
        });
    };

    const handlePersonSelect = (idx) => {
        setSelectedPersonIdx(idx);
        resetSelectedDay();
    };

    const handleAddPerson = () => {
        setDialogData(() => ({
            isOpen: true,
            title: 'Új személy',
            content: () => (
                <PersonForm
                    onSubmit={() => {
                        setSelectedPersonIdx(people().length);
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
                    initialData={selectedPerson()}
                    onSubmit={() => {
                        resetSelectedDay();
                    }}
                />
            )
        }));
    };

    const handleDeletePerson = () => {
        setConfirmDialogData(() => ({
            isOpen: true,
            title: 'Személy törlése',
            text: `Biztosan törli a kijelölt személyt?`,
            onConfirm: async () => {
                const currentIdx = selectedPersonIdx();
                let nextSelectedPersonIdx = null;
                if (people().length > 1) {
                    nextSelectedPersonIdx = currentIdx === 0 ? 0 : currentIdx - 1;
                }

                await removePerson(selectedPerson().id);
                setSelectedPersonIdx(nextSelectedPersonIdx);
                resetSelectedDay();
            }
        }));
    };

    return (
        <div class={appStyles.container}>
            <div class={styles.header}>
                <div class={styles.peopleControl}>
                    <DropdownMenu modal={false}>
                        <DropdownMenu.Trigger class={styles.dropdownButton}>
                            <span>{selectedPerson()?.name ?? "Válassz személyt!"}</span>
                            <DropdownMenu.Icon class={appStyles.dropdownIcon}>
                                <i class="fa-solid fa-chevron-down" />
                            </DropdownMenu.Icon>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                class={classList(appStyles.dropdownContent, styles.dropdownContent)}
                            >
                                <For each={people()}>{(person, idx) =>
                                    <DropdownMenu.Item
                                        class={classList(appStyles.dropdownItem, styles.dropdownItem, selectedPerson() && selectedPersonIdx() === idx() ? appStyles.selected : '')}
                                        onSelect={() => handlePersonSelect(idx())}
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
                        disabled={selectedPersonIdx() == null}
                        onClick={handleEditPerson}
                    >
                        <i class={`fa-solid fa-pen-to-square`} />
                    </Button>
                    <Button
                        class={classList(styles.iconButton, styles.trashButton)}
                        disabled={selectedPersonIdx() == null}
                        onClick={handleDeletePerson}
                    >
                        <i class={`fa-solid fa-trash`} />
                    </Button>
                </div>
                <div class={styles.dayControl}>
                    <Button
                        class={classList(styles.iconButton, styles.dayChevronButton)}
                        disabled={!selectedPerson()}
                        onClick={() => navigateDay(-1)}
                    >
                        <i class="fa-solid fa-chevron-left" />
                    </Button>
                    <Popover modal={false}>
                        <Popover.Trigger class={styles.dayText} disabled={!selectedPerson()}>
                            {selectedDay().year}. {translateMonth(selectedDay().month)}. {selectedDay().day}.
                        </Popover.Trigger>
                        <Popover.Content class={styles.popover}>
                            <DatePicker currentDate={selectedDay} setDay={setSelectedDay} markedDays={mealDates} />
                        </Popover.Content>
                    </Popover>
                    <Button
                        class={classList(styles.iconButton, styles.dayChevronButton)}
                        disabled={!selectedPerson() || isToday()}
                        onClick={() => navigateDay(1)}
                    >
                        <i class="fa-solid fa-chevron-right" />
                    </Button>
                </div>
            </div>
            <MealsList person={selectedPerson} day={selectedDay} />
        </div>
    );
}