import { Button } from '@kobalte/core/button';
import { createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import appStyles from '~/App.module.scss';
import { useDialogContext } from '../../context/DialogContext';
import { addFood, editFood } from '../../data/foodRepository';
import { MEASURE_UNITS } from '../../utils/enums';
import styles from './BasicFoodForm.module.scss';

export default function BasicFoodForm(props) {
    const { setDialogOpen } = useDialogContext();

    const [formData, setFormData] = createStore(
        props.initialData ? {
            name: props.initialData.name,
            measure: { ...MEASURE_UNITS.find(m => m.key === props.initialData.measure) },
            fat: props.initialData.macros.fat,
            fatSaturated: props.initialData.macros.fatSaturated,
            carbohydrate: props.initialData.macros.fastCarbohydrate + props.initialData.macros.slowCarbohydrate,
            fiber: props.initialData.macros.fiber,
            slowAbsorption: props.initialData.macros.slowCarbohydrate > 0,
            protein: props.initialData.macros.protein
        } : {
            name: '',
            measure: { ...MEASURE_UNITS[0] },
            fat: 0,
            fatSaturated: 0,
            carbohydrate: 0,
            fiber: 0,
            slowAbsorption: false,
            protein: 0
        });

    const valid = createMemo(() => {
        return formData.name.trim().length > 0 &&
            formData.fat != null && formData.fat >= 0 &&
            formData.fatSaturated != null && formData.fatSaturated >= 0 &&
            formData.carbohydrate != null && formData.carbohydrate >= 0 &&
            formData.fiber != null && formData.fiber >= 0 &&
            formData.protein != null && formData.protein >= 0;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (props.initialData) {
            await editFood(props.initialData.id, {
                name: formData.name.trim(),
                type: 'BASIC',
                measure: formData.measure.key,
                macros: {
                    fat: formData.fat,
                    fatSaturated: formData.fatSaturated,
                    fastCarbohydrate: !formData.slowAbsorption ? formData.carbohydrate : 0,
                    slowCarbohydrate: formData.slowAbsorption ? formData.carbohydrate : 0,
                    fiber: formData.fiber,
                    protein: formData.protein
                }
            });
            setDialogOpen(false);
            return;
        }
        await addFood({
            name: formData.name.trim(),
            type: 'BASIC',
            measure: formData.measure.key,
            macros: {
                fat: formData.fat,
                fatSaturated: formData.fatSaturated,
                fastCarbohydrate: !formData.slowAbsorption ? formData.carbohydrate : 0,
                slowCarbohydrate: formData.slowAbsorption ? formData.carbohydrate : 0,
                fiber: formData.fiber,
                protein: formData.protein
            }
        });

        setDialogOpen(false);
    };

    return (
        <form class={appStyles.form}>
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
                        step="0.001"
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
                        step="0.001"
                        min={0}
                        value={formData.fatSaturated}
                        onInput={(e) => setFormData('fatSaturated', parseFloat(e.currentTarget.value || 0))}
                    />
                </div>
            </div>
            <div class={appStyles.formRow}>
                <div class={appStyles.formField}>
                    <label htmlFor='carbohydrate'>Szénhidrát (g):</label>
                    <input
                        class={appStyles.smallInput}
                        id='carbohydrate'
                        type="number"
                        step="0.001"
                        min={0}
                        value={formData.carbohydrate}
                        onInput={(e) => setFormData('carbohydrate', parseFloat(e.currentTarget.value || 0))}
                    />
                </div>
                <div class={appStyles.formField}>
                    <label htmlFor='fiber'>Ebből rost (g):</label>
                    <input
                        class={appStyles.smallInput}
                        id='fiber'
                        type="number"
                        step="0.001"
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
                    step="0.001"
                    min={0}
                    value={formData.protein}
                    onInput={(e) => setFormData('protein', parseFloat(e.currentTarget.value || 0))}
                />
            </div>
            <Button
                class={appStyles.formButton}
                disabled={!valid()}
                onClick={handleSubmit}
            >
                Mentés
            </Button>
        </form>
    );
}