import { createEffect, createSignal, For, onMount } from 'solid-js';
import styles from './Dropdown.module.scss';
import { Button } from '@kobalte/core/button';
import { classList } from '../utils/utils';

export default function Dropdown(props) {

    const [filteredItems, setFilteredItems] = createSignal(props.items);

    createEffect(() => {
        const search = props.searchText?.toLowerCase();
        const itemsWithIdx = props.items.map((item, idx) => ({ item, idx }));
        setFilteredItems(itemsWithIdx.filter(({ item }) => item.toLowerCase().includes(search)));
    });

    return (
        <div class={styles.container}>
            <For each={filteredItems()}>{item => (
                <Button
                    class={classList(
                        styles.item,
                        props.selectedIdx === item.idx ? styles.selected : ''
                    )}
                    disabled={props.disabledIdxs?.some(disabledIdx => disabledIdx === item.idx)}
                    onClick={() => props.onSelect(item.idx)}
                >
                    {item.item}
                </Button>
            )}
            </For>
        </div>
    );
}