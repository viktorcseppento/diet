import { Button } from '@kobalte/core/button';
import { createMemo, Match, Show, Switch } from 'solid-js';
import { createStore } from 'solid-js/store';
import appStyles from '~/App.module.scss';
import { useDialogContext } from '../../context/DialogContext';
import { addPerson, editPerson } from '../../data/personRepository';
import { RULES, TARGET_KEYS } from '../../utils/enums';
import styles from './PersonForm.module.scss';
import { classList } from '../../utils/utils';

export default function PersonForm(props) {
    const { setDialogOpen } = useDialogContext();

    const [formData, setFormData] = createStore({
        name: props.initialData?.name ?? '',
        targets: props.initialData?.targets.map(target => ({
            name: target.name,
            key: TARGET_KEYS.find(t => t.key === target.key),
            rule: RULES.find(r => r.key === target.rule),
            value: target.value
        })) ?? []
    });

    const targetsValid = createMemo(() =>
        formData.targets.every(t => t.name && t.key && t.rule && (t.rule.key === 'FREE' || t.value)));

    const valid = createMemo(() => formData.name.trim().length > 0 && targetsValid());

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (props.initialData) {
            await editPerson(props.initialData.id, {
                name: formData.name,
                targets: formData.targets.map(t => ({ name: t.name, key: t.key.key, rule: t.rule.key, value: t.value }))
            });
        } else {
            await addPerson({
                name: formData.name,
                targets: formData.targets.map(t => ({ name: t.name, key: t.key.key, rule: t.rule.key, value: t.value }))
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
            <div class={appStyles.formField}>
                <span>Célok:</span>
                <Button
                    class={styles.targetButton}
                    onClick={() => {
                        setFormData('targets', [...formData.targets, { name: null, key: null, rule: null, value: null }]);
                    }}
                >
                    <i class={`fa-solid fa-plus`} />Új cél
                </Button>
            </div>
            <Show when={formData.targets.length > 0}>
                <div class={styles.targetsList}>
                    <For each={formData.targets}>{(target, idx) => (
                        <div class={styles.targetRow}>
                            <div class={styles.targetFields}>
                                <input
                                    type="text"
                                    value={target.name}
                                    placeholder='Cél neve (pl. Sugar free)'
                                    autocomplete='target'
                                    onInput={(e) => {
                                        setFormData('targets', idx(), target => ({ ...target, name: e.currentTarget.value }));
                                    }}
                                />
                                <select
                                    class={classList(styles.select, target.key == null && styles.placeholder)}
                                    value={target.key?.id ?? null}
                                    onInput={(e) => {
                                        const newKey = TARGET_KEYS[e.currentTarget.value];
                                        let newRule;
                                        let newValue = null;
                                        if (target.key?.ruleType === newKey.ruleType) {
                                            newRule = target.rule;
                                            newValue = target.value;
                                        }
                                        else if (newKey.ruleType === 'COUNTABLE') {
                                            newRule = RULES.find(r => r.key === 'MINIMUM');
                                        }
                                        else if (newKey.ruleType === 'BOOLEAN') {
                                            newRule = RULES.find(r => r.key === 'FREE');
                                        }
                                        return setFormData('targets', idx(), target => ({ ...target, key: TARGET_KEYS[e.currentTarget.value], rule: newRule, value: newValue }));
                                    }}
                                >
                                    <option value={null}>{'Mire?'}</option>
                                    <For each={TARGET_KEYS}>{(key) => (
                                        <option class={styles.option} value={key.id}>{key.label}</option>
                                    )}
                                    </For>
                                </select>
                                <select
                                    class={styles.select}
                                    disabled={!target.rule}
                                    value={target.rule?.id ?? null}
                                    onInput={(e) => setFormData('targets', idx(), target => ({ ...target, rule: RULES[e.currentTarget.value] }))}
                                >
                                    <option value={null}>{RULES.find(r => r.key === 'MINIMUM').label}</option>
                                    <Switch>
                                        <Match when={!target.rule || target.key?.ruleType === 'COUNTABLE'}>
                                            <option value={RULES.find(r => r.key === 'MINIMUM').id}>{RULES.find(r => r.key === 'MINIMUM').label}</option>
                                            <option value={RULES.find(r => r.key === 'MAXIMUM').id}>{RULES.find(r => r.key === 'MAXIMUM').label}</option>
                                        </Match>
                                        <Match when={target.key?.ruleType === 'BOOLEAN'}>
                                            <option value={RULES.find(r => r.key === 'FREE').id}>{RULES.find(r => r.key === 'FREE').label}</option>
                                        </Match>
                                    </Switch>
                                </select>
                                <Show when={target.key?.ruleType === 'COUNTABLE'}>
                                    <input
                                        placeholder={`Érték (${target.key?.unit})`}
                                        class={appStyles.longerInput}
                                        type="number"
                                        step="0.001"
                                        min={0}
                                        value={target.value}
                                        onInput={(e) => setFormData('targets', idx(), target => ({ ...target, value: e.currentTarget.value }))}
                                    />
                                </Show>
                            </div>
                            <Button
                                class={styles.trashButton}
                                onClick={() => {
                                    setFormData('targets', formData.targets.filter((_, i) => i !== idx()));
                                }}
                            >
                                <i class={`fa-solid fa-trash`} />
                            </Button>
                        </div>
                    )}
                    </For>
                </div>
            </Show >
            <Button type="submit" class={appStyles.formButton} disabled={!valid()}>
                Mentés
            </Button>
        </form >
    );
}