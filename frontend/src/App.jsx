import styles from './App.module.scss';
import { Tabs } from '@kobalte/core/tabs';
import FoodList from './pages/food/FoodList';
import { useDialogContext } from './context/DialogContext';
import Dialog from './components/Dialog';
import Meals from './pages/meals/Meals';
import { Button } from '@kobalte/core/button';
import SettingsDialog from './pages/settings/SettingsDialog';
import { startSyncScheduler } from './services/syncScheduler';
import { onMount } from 'solid-js';
import { initSettings } from './data/settingsRepository';
import ConfirmDialog from './components/ConfirmDialog';

export default function App() {
  const { setDialogData } = useDialogContext();

  onMount(() => {
    initSettings();
    startSyncScheduler();
  });

  return (
    <>
      <Tabs>
        <Tabs.List class={styles.tabsList}>
          <Tabs.Trigger class={styles.tabsTrigger} value="meals-diary">Étkezési napló</Tabs.Trigger>
          <Tabs.Trigger class={styles.tabsTrigger} value="food">Élelmiszerek</Tabs.Trigger>
          <Tabs.Indicator class={styles.tabsIndicator} />
          <Button
            class={styles.settingsButton}
            onClick={() => {
              setDialogData(() => ({
                isOpen: true,
                title: `Beállítások`,
                content: () => <SettingsDialog />
              }));
            }}
          >
            <i class="fa-solid fa-gear" aria-hidden="true" />
          </Button>
        </Tabs.List>
        <Tabs.Content value="meals-diary"><Meals /></Tabs.Content>
        <Tabs.Content value="food"><FoodList /></Tabs.Content>
      </Tabs>
      <Dialog />
      <ConfirmDialog />
    </>
  );
}