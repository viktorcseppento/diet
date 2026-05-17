import { Button } from '@kobalte/core/button';
import { createEffect, createMemo, createSignal, For, Show } from 'solid-js';
import appStyles from '~/App.module.scss';
import SearchBox from '../../components/SearchBox';
import { useConfirmDialogContext } from '../../context/ConfirmDialogContext';
import { useDialogContext } from '../../context/DialogContext';
import { getFoods, removeFood } from '../../data/foodRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import { measureUnitToLabel } from '../../utils/enums';
import { renderMacros } from '../../utils/renderUtils';
import { classList, convertToDottedDateString } from '../../utils/utils';
import BasicFoodForm from './BasicFoodForm';
import CompositeFoodForm from './CompositeFoodForm';
import styles from './FoodList.module.scss';
import NewFoodDialog from './NewFoodDialog';

export default function FoodList() {
    const foods = createLiveQuery(getFoods);

    const { setDialogData } = useDialogContext();
    const { setConfirmDialogData } = useConfirmDialogContext();
    const [search, setSearch] = createSignal('');
    const [collapsed, setCollapsed] = createSignal({ basic: false, composite: false });

    const getFormComponent = (type, food) => {
        if (type === 'BASIC') return () => <BasicFoodForm initialData={food} />;
        if (type === 'COMPOSITE') return () => <CompositeFoodForm initialData={food} />;
        return null;
    };

    const renderFoodItem = (food) => (
        <div class={styles.item}>
            <div class={styles.itemHeader}>
                <span class={styles.name}>{`${food.name} - ${measureUnitToLabel(food.measure)}`}</span>
                <span class={styles.itemButtons}>
                    <Button
                        class={styles.itemButton}
                        onClick={() => {
                            setDialogData(() => ({
                                isOpen: true,
                                title: `Étel módosítása`,
                                content: getFormComponent(food.type, food)
                            }));
                        }}
                    >
                        <i class={`fa-solid fa-pen-to-square`} aria-hidden="true" />
                    </Button>
                    <Button
                        class={classList(styles.itemButton, styles.trashButton)}
                        onClick={() => {
                            setConfirmDialogData(() => ({
                                isOpen: true,
                                title: `Étel törlése`,
                                text: `Biztosan törli a(z) <i><b>${food.name}</b></i> ételt?`,
                                onConfirm: async () => await removeFood(food.id)
                            }));
                        }}
                    >
                        <i class={`fa-solid fa-trash`} aria-hidden="true" />
                    </Button>
                </span>
            </div>
            <div class={styles.description}>
                <div class={styles.macros}>
                    {renderMacros(food.macros)}
                </div>
                <Show when={food.type === 'COMPOSITE'}>
                    <span class={styles.date}>{convertToDottedDateString(new Date(food.lastUpdated))}</span>
                </Show>
            </div>
        </div>
    );

    function Column(props) {
        const isCollapsed = createMemo(() => props.type === 'BASIC' ? collapsed().basic : collapsed().composite);
        const filteredFoods = createMemo(() => {
            const query = search().toLowerCase();
            return foods().filter(food =>
                food.type === props.type && (
                    food.name.toLowerCase().includes(query) ||
                    food.ingredients?.some(i => i.foodName?.toLowerCase().includes(query))
                ));
        });

        let listRef;
        createEffect(() => {
            listRef.style.height = filteredFoods().length * 134 + "px";
            if (isCollapsed()) {
                listRef.style.height = "0";
            }
        });

        return (
            <div class={styles.column}>
                <span
                    class={styles.listHeader}
                    onClick={() => {
                        if (props.type === 'BASIC') setCollapsed(collapsed => ({ basic: !isCollapsed(), composite: collapsed.composite }));
                        if (props.type === 'COMPOSITE') setCollapsed(collapsed => ({ basic: collapsed.basic, composite: !isCollapsed() }));
                    }}
                >
                    {props.type === 'BASIC' ? 'Alap' : 'Összetett'}
                    <span class={styles.expandIcon} data-expanded={!isCollapsed() ? "" : undefined} >
                        <i class='fa-solid fa-chevron-down' />
                    </span>
                </span>
                <div
                    class={styles.list}
                    data-collapsed-transform={isCollapsed() ? "" : undefined}
                    ref={listRef}
                >
                    <For each={filteredFoods()}>{food => renderFoodItem(food)}</For>
                </div>
            </div>
        );
    };

    return (
        <div class={appStyles.container}>
            <div class={styles.control}>
                <Button
                    class={styles.dialogTrigger}
                    onClick={() => setDialogData(() => ({
                        isOpen: true,
                        title: 'Új étel',
                        content: NewFoodDialog
                    }))}
                >
                    <i class={`fa-solid fa-plus`} aria-hidden="true" />Új étel
                </Button>
                <SearchBox value={search} setValue={setSearch} />
            </div>
            <div class={styles.listContainer}>
                <Column type="BASIC" />
                <Column type="COMPOSITE" />
            </div>
        </div>
    );
}