import { createStore } from 'solid-js/store';
import { useDialogContext } from '../../context/DialogContext';
import appStyles from '~/App.module.scss';
import { createMemo } from 'solid-js';
import { Button } from '@kobalte/core/button';
import { addPerson, editPerson } from '../../data/personRepository';

export default function PersonForm(props) {
    const { setDialogOpen } = useDialogContext();

    const [formData, setFormData] = createStore({
        name: props.initialData?.name ?? ''
    });

    const valid = createMemo(() => formData.name.trim().length > 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (props.initialData) {
            await editPerson(props.initialData.id, {
                name: formData.name
            });
        } else {
            await addPerson({
                name: formData.name,
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