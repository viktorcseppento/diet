import styles from './FoodList.module.scss';
import appStyles from '~/App.module.scss';
import NewFoodDialog from './NewFoodDialog';
import { useStore } from '../../context/StoreContext';
import { Button } from '@kobalte/core/button';
import { useDialogContext } from '../../context/DialogContext';
import ConfirmDialogContent from '../../components/ConfirmDialogContent';
import BasicFoodForm from './BasicFoodForm';
import { classList } from '../../utils/utils';
import { FOOD_TYPES } from '../../utils/enums';
import CompositeFoodForm from './CompositeFoodForm';
import { createSignal, For } from 'solid-js';
import { renderMacros } from '../../utils/renderUtils';
import SearchBox from '../../components/SearchBox';

export default function FoodList() {
    const { foods, removeFood } = useStore();
    const { setDialogData } = useDialogContext();
    const [search, setSearch] = createSignal('');

    const getFormComponent = (typeKey, food, idx) => {
        if (typeKey === 'BASIC') return BasicFoodForm({ initialData: food, idx });
        if (typeKey === 'COMPOSITE') return CompositeFoodForm({ initialData: food, idx });
        return null;
    };

    const renderFoodItem = (food, idx, typeKey) => (
        <div class={styles.item}>
            <div class={styles.itemHeader}>
                <span class={styles.name}>{`${food.name} - ${food.measure.label}`}</span>
                <span class={styles.itemButtons}>
                    <Button
                        class={styles.itemButton}
                        onClick={() => {
                            setDialogData(() => ({
                                isOpen: true,
                                title: `Étel módosítása`,
                                content: () => getFormComponent(typeKey, food, idx)
                            }));
                        }}
                    >
                        <i class={`fa-solid fa-pen-to-square`} aria-hidden="true" />
                    </Button>
                    <Button
                        class={classList(styles.itemButton, styles.trashButton)}
                        onClick={() => {
                            setDialogData(() => ({
                                isOpen: true,
                                title: `Étel törlése`,
                                content: () => (
                                    <ConfirmDialogContent
                                        text={`Biztosan törli a(z) <i><b>${food.name}</b></i> ételt?`}
                                        onConfirm={() => removeFood(idx())}
                                    />
                                )
                            }));
                        }}
                    >
                        <i class={`fa-solid fa-trash`} aria-hidden="true" />
                    </Button>
                </span>
            </div>
            <div class={styles.description}>
                {renderMacros(food)}
            </div>
        </div>
    );

    const column = (type) => {
        const filteredFoods = foods.map((food, idx) => ({ food, idx: () => idx }))
            .filter(({ food }) => {
                if (food.type.id !== type.id)
                    return false;
                switch (type.key) {
                    case 'BASIC':
                        return food.name.toLowerCase().includes(search().toLowerCase());
                    case 'COMPOSITE':
                        return food.name.toLowerCase().includes(search().toLowerCase()) ||
                            food.ingredients.some(i => i.food.name.toLowerCase().includes(search().toLowerCase()));
                    default:
                        return false;
                }
            });

        return (
            <div class={styles.column}>
                <span class={styles.listHeader}>{type.key === 'BASIC' ? 'Alap' : 'Összetett'}</span>
                <div class={styles.list}>
                    <For each={filteredFoods}>{({ food, idx }) => renderFoodItem(food, idx, type.key)}</For>
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
                {column(FOOD_TYPES[0])}
                {column(FOOD_TYPES[1])}
            </div>
        </div>
    );
}