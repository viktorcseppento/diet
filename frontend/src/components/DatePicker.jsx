import { Button } from '@kobalte/core/button';
import styles from './DatePicker.module.scss';
import appStyles from '~/App.module.scss';
import { createMemo, createSignal, For, Show } from 'solid-js';
import { classList, translateDay, translateMonth } from '../utils/utils';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';

function convertDay(day) {
    if (day === 0) return 6;
    return day - 1;
}

export default function DatePicker(props) {
    const [year, setYear] = createSignal(props.currentDate().year);
    const [month, setMonth] = createSignal(props.currentDate().month);

    const displayedDates = createMemo(() => {
        const currentYear = year();
        const currentMonth = month();
        const firstDayOfMonth = convertDay(new Date(currentYear, currentMonth, 1).getDay());
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const lastDayOfMonth = convertDay(new Date(currentYear, currentMonth + 1, 0).getDay());
        const dates = [];

        // Previous month days
        for (let i = 0; i < firstDayOfMonth; i++) {
            const date = new Date(currentYear, currentMonth, -firstDayOfMonth + i + 1);
            dates.push({ year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), currentMonth: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            dates.push({ year: currentYear, month: currentMonth, day: i, currentMonth: true });
        }

        // Next month days
        for (let i = 1; i < 7 - lastDayOfMonth; i++) {
            const date = new Date(currentYear, currentMonth + 1, i);
            dates.push({ year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), currentMonth: false });
        }

        return dates;
    });

    const navigateMonth = (direction) => {
        const newDate = new Date(year(), month() + direction, 1);
        setYear(newDate.getFullYear());
        setMonth(newDate.getMonth());
    };

    const goToToday = () => {
        const today = new Date();
        const todayObj = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
        props.setDay(todayObj);
        setYear(todayObj.year);
        setMonth(todayObj.month);
    };

    const selectDate = (date) => {
        props.setDay({ year: date.year, month: date.month, day: date.day });
        setYear(date.year);
        setMonth(date.month);
    };

    const isSelected = (date) => {
        const current = props.currentDate();
        return current.year === date.year && current.month === date.month && current.day === date.day;
    };

    const isMarked = (date) => {
        return props.markedDays().some(d => d.year === date.year && d.month === date.month && d.day === date.day);
    };

    return (
        <div class={styles.container}>
            <div class={styles.controls}>
                <div class={styles.arrows}>
                    <Button
                        class={styles.arrowButton}
                        onClick={() => navigateMonth(-1)}
                    >
                        <i class="fa-solid fa-chevron-left"></i>
                    </Button>
                    <Button
                        class={styles.todayButton}
                        onClick={goToToday}
                    >
                        MA
                    </Button>
                    <Button
                        class={styles.arrowButton}
                        onClick={() => navigateMonth(1)}
                    >
                        <i class="fa-solid fa-chevron-right"></i>
                    </Button>
                </div>
                <div class={styles.selectControls}>
                    <div class={styles.yearSelect}>
                        <Button
                            class={styles.yearArrowButton}
                            onClick={() => setYear(year() - 1)}
                        >
                            <i class="fa-solid fa-chevron-left" />
                        </Button>
                        <span class={styles.yearText}>{year()}</span>
                        <Button
                            class={styles.yearArrowButton}
                            onClick={() => setYear(year() + 1)}
                        >
                            <i class="fa-solid fa-chevron-right" />
                        </Button>
                    </div>
                    <DropdownMenu modal={false}>
                        <DropdownMenu.Trigger class={classList(styles.select, styles.monthSelect)}>
                            <span>{translateMonth(month())}</span>
                            <DropdownMenu.Icon class={appStyles.dropdownIcon}>
                                <i class="fa-solid fa-chevron-down" />
                            </DropdownMenu.Icon>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                class={classList(appStyles.dropdownContent, styles.dropdownContent)}
                            >
                                <For each={[...Array(12).keys()]}>{(i) =>
                                    <DropdownMenu.Item
                                        class={classList(appStyles.dropdownItem, styles.dropdownItem)}
                                        onSelect={() => setMonth(i)}
                                    >
                                        {translateMonth(i)}
                                    </DropdownMenu.Item>
                                }</For>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu>
                </div>
            </div>
            <div class={styles.calendar}>
                <For each={[...Array(7).keys()]}>{(i) =>
                    <span class={styles.day}>{translateDay(i)}</span>
                }</For>
                <For each={displayedDates()}>{(date) =>
                    <span
                        class={classList(
                            styles.day,
                            !date.currentMonth ? styles.otherMonth : '',
                            isSelected(date) ? styles.selectedDay : ''
                        )}
                        onClick={() => selectDate(date)}
                    >
                        <Show when={isMarked(date)}>
                            <div class={styles.mark} />
                        </Show>
                        {date.day}
                    </span>
                }</For>
            </div>
        </div >
    );
}