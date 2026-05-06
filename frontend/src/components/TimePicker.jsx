import { createEffect, createSignal, For, onMount } from 'solid-js';
import styles from './TimePicker.module.scss';
import { Button } from '@kobalte/core/button';
import { classList } from '../utils/utils';

export default function TimePicker(props) {
    const [selectedHour, setSelectedHour] = createSignal(props.currentHour);
    const [selectedMinute, setSelectedMinute] = createSignal(props.currentMinute);

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    createEffect(() => {
        props.setTime(selectedHour(), selectedMinute());
    });

    let hourSelect;
    let minuteSelect;

    onMount(() => {
        const hourMaxScroll = hourSelect.scrollHeight;
        hourSelect.scrollTop = (hourMaxScroll / 72) * (24 + Number(props.currentHour));
        const minuteMaxScroll = minuteSelect.scrollHeight;
        minuteSelect.scrollTop = (minuteMaxScroll / 180) * (60 + Number(props.currentMinute));
    });

    const handleInfiniteScroll = (e) => {
        const max = e.target.scrollHeight;
        const third = max / 3;

        if (e.target.scrollTop <= 0) {
            e.target.scrollTop += third;
        } else if (e.target.scrollTop >= third * 2) {
            e.target.scrollTop -= third;
        }
    };

    return (
        <div class={styles.container}>
            <div
                class={styles.timeSelect}
                ref={hourSelect}
                onScroll={handleInfiniteScroll}
            >
                <For each={Array(3)}>{() => (
                    <div class={styles.group}>
                        <For each={hours}>{(hour) => (
                            <Button
                                class={classList(styles.button, hour === selectedHour() ? styles.selected : '')}
                                onClick={() => setSelectedHour(hour)}
                            >
                                {hour}
                            </Button>
                        )}</For>
                    </div>
                )}</For>
            </div>
            <div
                class={styles.timeSelect}
                ref={minuteSelect}
                onScroll={handleInfiniteScroll}
            >
                <For each={Array(3)}>{() => (
                    <div class={styles.group}>
                        <For each={minutes}>{(minute) => (
                            <Button
                                class={classList(styles.button, minute === selectedMinute() ? styles.selected : '')}
                                onClick={() => setSelectedMinute(minute)}
                            >
                                {minute}
                            </Button>
                        )}</For>
                    </div>
                )}</For>
            </div>
        </div>
    );
}