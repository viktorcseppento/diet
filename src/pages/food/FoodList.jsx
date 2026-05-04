import { Button } from '@kobalte/core/button';
import { createSignal, For } from 'solid-js';
import appStyles from '~/App.module.scss';
import ConfirmDialogContent from '../../components/ConfirmDialogContent';
import SearchBox from '../../components/SearchBox';
import { useDialogContext } from '../../context/DialogContext';
import { getFoods, removeFood } from '../../data/foodRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import { measureUnitToLabel } from '../../utils/enums';
import { renderMacros } from '../../utils/renderUtils';
import { classList } from '../../utils/utils';
import BasicFoodForm from './BasicFoodForm';
import CompositeFoodForm from './CompositeFoodForm';
import styles from './FoodList.module.scss';
import NewFoodDialog from './NewFoodDialog';

export default function FoodList() {
    const foods = createLiveQuery(getFoods);

    const { setDialogData } = useDialogContext();
    const [search, setSearch] = createSignal('');

    const getFormComponent = (type, food) => {
        if (type === 'BASIC') return () => <BasicFoodForm initialData={food} />;
        if (type === 'COMPOSITE') return () => <CompositeFoodForm initialData={food} />;
        return null;
    };

    const renderFoodItem = (food, type) => (
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
                                content: getFormComponent(type, food)
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
                                        onConfirm={async () => await removeFood(food.id)}
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
                {renderMacros(food.macros)}
            </div>
        </div>
    );

    const column = (type) => {
        const filteredFoods = foods()
            .filter(food => food.type === type && food.name.toLowerCase().includes(search().toLowerCase()));

        return (
            <div class={styles.column}>
                <span class={styles.listHeader}>{type === 'BASIC' ? 'Alap' : 'Összetett'}</span>
                <div class={styles.list}>
                    <For each={filteredFoods}>{food => renderFoodItem(food, type)}</For>
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
                {column('BASIC')}
                {column('COMPOSITE')}
            </div>
        </div>
    );
}