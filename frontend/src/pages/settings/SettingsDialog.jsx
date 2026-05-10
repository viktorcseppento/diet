import { Button } from '@kobalte/core/button';
import { Switch } from '@kobalte/core/switch';
import { createEffect, createSignal } from 'solid-js';
import appStyles from '~/App.module.scss';
import { useConfirmDialogContext } from '../../context/ConfirmDialogContext';
import { clearData } from '../../data/metaRepository';
import { getSettings, updateSettingsField } from '../../data/settingsRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import { checkServerConnection, sync } from '../../services/syncService';
import { classList } from '../../utils/utils';
import styles from './SettingsDialog.module.scss';

export default function SettingsDialog() {
    const settings = createLiveQuery(getSettings);
    const { setConfirmDialogData } = useConfirmDialogContext();

    const [serverUrl, setServerUrl] = createSignal(settings()?.serverUrl || '');
    const [connectionSucceeded, setConnectionSucceeded] = createSignal(false);
    const [connectionFailed, setConnectionFailed] = createSignal(false);
    const [connectionPending, setConnectionPending] = createSignal(false);
    const [syncSucceeded, setSyncSucceeded] = createSignal(false);
    const [syncFailed, setSyncFailed] = createSignal(false);
    const [syncPending, setSyncPending] = createSignal(false);
    const [clearSucceeded, setClearSucceeded] = createSignal(false);
    const [clearFailed, setClearFailed] = createSignal(false);
    const [clearPending, setClearPending] = createSignal(false);

    createEffect(() => {
        setServerUrl(settings()?.serverUrl || '');
    });

    return (
        <form class={appStyles.form}>
            <div class={appStyles.formField}>
                <label htmlFor='sync'>Szinkronizálás:</label>
                <Switch class={styles.switch} id='sync' checked={settings()?.sync} onChange={async (e) => {
                    await updateSettingsField("sync", e);
                }} >
                    <Switch.Input class={styles.switchInput} />
                    <Switch.Control class={styles.switchControl}>
                        <Switch.Thumb class={styles.switchThumb} />
                    </Switch.Control>
                </Switch>
            </div>
            <div class={appStyles.formField}>
                <label htmlFor='serverUrl'>Szerver URL:</label>
                <input
                    id='serverUrl'
                    type='text'
                    value={serverUrl()}
                    onInput={(e) => {
                        setServerUrl(e.currentTarget.value);
                    }}
                    onBlur={async () => {
                        await updateSettingsField("serverUrl", serverUrl());
                    }}
                />
            </div>
            <div class={appStyles.formRow}>
                <Button
                    disabled={connectionPending()}
                    class={styles.button}
                    onClick={async () => {
                        setConnectionPending(true);
                        setConnectionSucceeded(false);
                        setConnectionFailed(false);

                        const success = await checkServerConnection();
                        if (success) {
                            setConnectionSucceeded(true);
                        } else {
                            setConnectionFailed(true);
                        }
                        setConnectionPending(false);
                    }}
                >
                    Kapcsolat tesztelése
                </Button>
                <span
                    class={classList(styles.resultText,
                        connectionSucceeded() && styles.success,
                        connectionFailed() && styles.error)}
                >
                    {connectionSucceeded() && "Sikeres kapcsolat!"}
                    {connectionFailed() && "Sikertelen kapcsolat."}
                </span>
            </div>
            <div class={appStyles.formRow}>
                <Button
                    disabled={syncPending()}
                    class={styles.button}
                    onClick={async () => {
                        setSyncPending(true);
                        setSyncSucceeded(false);
                        setSyncFailed(false);

                        const success = await sync();
                        if (success) {
                            setSyncSucceeded(true);
                        } else {
                            setSyncFailed(true);
                        }
                        setSyncPending(false);
                    }}
                >
                    Szinkronizálás
                </Button>
                <span
                    class={classList(styles.resultText,
                        syncSucceeded() && styles.success,
                        syncFailed() && styles.error)}
                >
                    {syncSucceeded() && "Sikeres szinkronizálás!"}
                    {syncFailed() && "Sikertelen szinkronizálás."}
                </span>
            </div>
            <div class={appStyles.formRow}>
                <Button
                    disabled={clearPending()}
                    class={classList(styles.button, styles.deleteButton)}
                    onClick={() => {
                        setConfirmDialogData(() => ({
                            isOpen: true,
                            isDeletion: true,
                            title: 'Adatok törlése',
                            text: `Biztosan törli az összes helyi adatot? Ez nem befolyásolja a szerveren tárolt adatokat, de a művelet visszafordíthatatlan!`,
                            onConfirm: async () => {
                                setClearPending(true);
                                setClearSucceeded(false);
                                setClearFailed(false);
                                try {
                                    await clearData();
                                    setClearSucceeded(true);
                                } catch {
                                    setClearFailed(true);
                                }
                                setClearPending(false);
                            }
                        }));
                    }}
                >
                    Helyi adatok törlése
                </Button>
                <span
                    class={classList(styles.resultText,
                        clearSucceeded() && styles.success,
                        clearFailed() && styles.error)}
                >
                    {clearSucceeded() && "Sikeres törlés!"}
                    {clearFailed() && "Sikertelen törlés."}
                </span>
            </div>
        </form >
    );
}