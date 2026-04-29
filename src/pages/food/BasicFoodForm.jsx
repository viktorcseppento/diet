import styles from './BasicFoodForm.module.scss';
import appStyles from '~/App.module.scss';
import { FOOD_TYPES, MEASURE_UNITS } from '../../utils/enums';
import { createStore, unwrap } from 'solid-js/store';
import { createMemo } from 'solid-js';
import { Button } from '@kobalte/core/button';
import { useStore } from '../../context/StoreContext';
import { useDialogContext } from '../../context/DialogContext';

export default function BasicFoodForm(props) {
    const { addFood, editFood } = useStore();
    const { setDialogOpen } = useDialogContext();

    const initialData = props.initialData ? structuredClone(unwrap(props.initialData)) : null;

    const [formData, setFormData] = createStore(
        initialData ? {
            name: initialData.name,
            measure: initialData.measure,
            fat: initialData.fat,
            fatSaturated: initialData.fatSaturated,
            carbohydrates: initialData.fastCarbohydrates + initialData.slowCarbohydrates,
            fiber: initialData.fiber,
            slowAbsorption: initialData.slowCarbohydrates > 0,
            protein: initialData.protein
        } : {
            name: '',
            measure: { ...MEASURE_UNITS[0] },
            fat: 0,
            fatSaturated: 0,
            carbohydrates: 0,
            fiber: 0,
            slowAbsorption: false,
            protein: 0
        });

    const valid = createMemo(() => {
        return formData.name.trim().length > 0 &&
            formData.fat != null && formData.fat >= 0 &&
            formData.fatSaturated != null && formData.fatSaturated >= 0 &&
            formData.carbohydrates != null && formData.carbohydrates >= 0 &&
            formData.fiber != null && formData.fiber >= 0 &&
            formData.protein != null && formData.protein >= 0;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (initialData) {
            editFood(props.idx(), {
                type: FOOD_TYPES.find(t => t.key === 'BASIC'),
                name: formData.name,
                measure: formData.measure,
                fat: formData.fat,
                fatSaturated: formData.fatSaturated,
                fastCarbohydrates: !formData.slowAbsorption ? formData.carbohydrates : 0,
                slowCarbohydrates: formData.slowAbsorption ? formData.carbohydrates : 0,
                fiber: formData.fiber,
                protein: formData.protein
            });
            setDialogOpen(false);
            return;
        }
        addFood({
            type: FOOD_TYPES.find(t => t.key === 'BASIC'),
            name: formData.name,
            measure: formData.measure,
            fat: formData.fat,
            fatSaturated: formData.fatSaturated,
            fastCarbohydrates: !formData.slowAbsorption ? formData.carbohydrates : 0,
            slowCarbohydrates: formData.slowAbsorption ? formData.carbohydrates : 0,
            fiber: formData.fiber,
            protein: formData.protein
        });

        setDialogOpen(false);
    };

    return (
        <form class={appStyles.form} onsubmit={handleSubmit}>
            <div class={appStyles.formField}>
                <label htmlFor='name'>Név:</label>
                <input
                    ref={(el) => setTimeout(() => el.focus(), 10)}
                    id='name'
                    type="text"
                    autocomplete='food'
                    value={formData.name}
                    onInput={(e) => setFormData('name', e.currentTarget.value)}
                />
            </div>
            <div class={appStyles.formField}>
                <label htmlFor='measure'>Mennyiség:</label>
                <select
                    id='measure'
                    value={formData.measure.id}
                    onInput={(e) => setFormData('measure', MEASURE_UNITS[e.currentTarget.value])}
                >
                    <For each={MEASURE_UNITS}>{(unit) => (
                        <option value={unit.id}>{unit.label}</option>
                    )}</For>
                </select>
            </div>
            <div class={appStyles.formRow}>
                <div class={appStyles.formField}>
                    <label htmlFor='fat'>Zsír (g):</label>
                    <input
                        class={appStyles.smallInput}
                        id='fat'
                        type="number"
                        step="0.01"
                        min={0}
                        value={formData.fat}
                        onInput={(e) => setFormData('fat', parseFloat(e.currentTarget.value || 0))}
                    />
                </div>
                <div class={appStyles.formField}>
                    <label htmlFor='fatSaturated'>Ebből telített (g):</label>
                    <input
                        class={styles.smallInput}
                        id='fatSaturated'
                        type="number"
                        step="0.01"
                        min={0}
                        value={formData.fatSaturated}
                        onInput={(e) => setFormData('fatSaturated', parseFloat(e.currentTarget.value || 0))}
                    />
                </div>
            </div>
            <div class={appStyles.formRow}>
                <div class={appStyles.formField}>
                    <label htmlFor='carbohydrates'>Szénhidrát (g):</label>
                    <input
                        class={appStyles.smallInput}
                        id='carbohydrates'
                        type="number"
                        step="0.01"
                        min={0}
                        value={formData.carbohydrates}
                        onInput={(e) => setFormData('carbohydrates', parseFloat(e.currentTarget.value || 0))}
                    />
                </div>
                <div class={appStyles.formField}>
                    <label htmlFor='fiber'>Rost (g):</label>
                    <input
                        class={appStyles.smallInput}
                        id='fiber'
                        type="number"
                        step="0.01"
                        min={0}
                        value={formData.fiber}
                        onInput={(e) => setFormData('fiber', parseFloat(e.currentTarget.value || 0))}
                    />
                </div>
                <div class={appStyles.formField}>
                    <label htmlFor='slowAbsorption'>Lassú felszívódású?:</label>
                    <input
                        type="checkbox"
                        class={styles.checkbox}
                        id='slowAbsorption'
                        checked={formData.slowAbsorption}
                        onInput={(e) => setFormData('slowAbsorption', e.currentTarget.checked)}
                    />
                </div>
            </div>
            <div class={appStyles.formField}>
                <label htmlFor='protein'>Fehérje (g):</label>
                <input
                    type="number"
                    class={appStyles.smallInput}
                    id='protein'
                    step="0.01"
                    min={0}
                    value={formData.protein}
                    onInput={(e) => setFormData('protein', parseFloat(e.currentTarget.value || 0))}
                />
            </div>
            <Button type='submit' class={appStyles.formButton} disabled={!valid()}>Mentés</Button>
        </form>
    );
}