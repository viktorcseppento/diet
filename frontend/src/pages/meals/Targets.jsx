import { createMemo, For, Match, Switch } from 'solid-js';
import { allTargetableValuesFromFoods } from '../../utils/calculations';
import { TARGET_KEYS } from '../../utils/enums';
import { formatNumber } from '../../utils/utils';
import styles from './Targets.module.scss';

// props: { targets, extended meals }
export default function Targets(props) {

    const allValues = createMemo(() => allTargetableValuesFromFoods(props.meals()));
    const smallWindow = window.outerWidth < 600;

    const targetsWithProgress = createMemo(() => props.targets.map(t => {
        let reached = false, green = 0, red = 0;
        const currentValue = allValues()[t.key];
        const progress = Math.min(1, currentValue / t.value);
        switch (t.rule) {
            case 'MAXIMUM':
                reached = currentValue <= t.value;
                green = progress > 0.5 ? 2 * (1 - progress) * 255 : 255;
                red = progress < 0.5 ? 255 * 2 * progress : 255;
                break;
            case 'MINIMUM':
                reached = currentValue >= t.value;
                green = progress < 0.5 ? 2 * progress * 255 : 255;
                red = progress > 0.5 ? 255 * 2 * (-progress + 1) : 255;
                break;
            case 'FREE':
                reached = !currentValue;
                break;
        }

        return ({
            ...t,
            currentValue,
            reached,
            unit: TARGET_KEYS.find(tk => tk.key === t.key).unit,
            progress,
            color: `rgb(${red}, ${green}, 0)`,
        });
    }));

    return (
        <div class={styles.container}>
            <For each={targetsWithProgress()}>
                {target => (
                    <div class={styles.target}>
                        <span class={styles.targetName}>{target.name}:</span>
                        <span class={styles.reachedIcon}>{target.reached ? <i class={`fa-solid fa-check ${styles.check}`} /> : <i class={`fa-solid fa-xmark ${styles.cross}`} />}</span>
                        <Switch>
                            <Match when={target.rule === 'MAXIMUM' || target.rule === 'MINIMUM'}>
                                {smallWindow && <>
                                    <span>
                                        {`${formatNumber(target.currentValue)} ${target.unit} / ${formatNumber(target.value)} ${target.unit}`}
                                    </span>
                                    <span class={styles.break} />
                                </>}
                                {!smallWindow && <span>{`${formatNumber(target.currentValue)} ${target.unit}`}</span>}
                                <div class={styles.progressContainer}>
                                    <div class={styles.progressBarContainer}>
                                        <div
                                            class={styles.progressBar}
                                            style={{
                                                "background-color": target.color,
                                                "padding-right": `${100 * (1 - target.progress)}%`
                                            }}
                                        >
                                        </div>
                                    </div>
                                    {!smallWindow && <span>{`${formatNumber(target.value)} ${target.unit}`}</span>}
                                </div>
                            </Match>
                        </Switch>
                    </div>
                )}
            </For>
        </div>
    );
}