import { createStore } from 'solid-js/store';
import { useDialogContext } from '../../context/DialogContext';
import { useStore } from '../../context/StoreContext';
import appStyles from '~/App.module.scss';
import { createMemo } from 'solid-js';
import { Button } from '@kobalte/core/button';

export default function PersonForm(props) {
    const { addPerson, editPerson } = useStore();
    const { setDialogOpen } = useDialogContext();

    const [formData, setFormData] = createStore({
        name: props.initialData?.name ?? ''
    });

    const valid = createMemo(() => formData.name.trim().length > 0);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (props.initialData) {
            editPerson(props.idx(), {
                name: formData.name,
                dates: props.initialData.dates
            });
        } else {
            addPerson({
                name: formData.name,
                dates: {}
            });
        }

        props.onSubmit?.();
        setDialogOpen(false);
    };

    return (
        <form class={appStyles.form} onSubmit={handleSubmit}>
            <div class={appStyles.formField}>
                <label htmlFor="name">Név:</label>
                <input
                    ref={(el) => setTimeout(() => {
                        el?.focus()
                    }, 10)}

                    id="name"
                    type="text"
                    value={formData.name}
                    onInput={(e) => setFormData('name', e.currentTarget.value)}
                />
            </div>
            <Button type="submit" class={appStyles.formButton} disabled={!valid()}>
                Mentés
            </Button>
        </form>
    );
}