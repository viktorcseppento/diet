import { createEffect, createSignal, For, onMount } from 'solid-js';
import styles from './Dropdown.module.scss';
import { Button } from '@kobalte/core/button';
import { classList } from '../utils/utils';

// props.items are { id, name }
export default function Dropdown(props) {

    const [filteredItems, setFilteredItems] = createSignal(props.items);

    createEffect(() => {
        const search = props.searchText?.toLowerCase();
        
        setFilteredItems(props.items.filter(item => item.name.toLowerCase().includes(search)));
    });

    return (
        <div class={styles.container}>
            <For each={filteredItems()}>{item => (
                <Button
                    class={classList(
                        styles.item,
                        props.selectedId === item.id ? styles.selected : ''
                    )}
                    disabled={props.disabledIds?.some(disabledId => disabledId === item.id)}
                    onClick={() => props.onSelect(item.id)}
                >
                    {item.name}
                </Button>
            )}
            </For>
        </div>
    );
}