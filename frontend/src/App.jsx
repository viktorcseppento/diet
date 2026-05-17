import { App as CapacitorApp } from "@capacitor/app";
import { Button } from '@kobalte/core/button';
import { Tabs } from '@kobalte/core/tabs';
import { useLocation, useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';
import styles from './App.module.scss';
import ConfirmDialog from './components/ConfirmDialog';
import Dialog from './components/Dialog';
import { useConfirmDialogContext } from './context/ConfirmDialogContext';
import { useDialogContext } from './context/DialogContext';
import { initSettings } from './data/settingsRepository';
import SettingsDialog from './pages/settings/SettingsDialog';
import { startSyncScheduler } from './services/syncScheduler';

export default function App(props) {
  const { dialogData, setDialogData, setDialogOpen } = useDialogContext();
  const { confirmDialogData, setConfirmDialogOpen } = useConfirmDialogContext();
  const location = useLocation();
  const navigate = useNavigate();

  onMount(async () => {
    await initSettings();
    startSyncScheduler();
  });

  const currentTab = () => {
    if (location.pathname === "/food") return "food";
    return "diary";
  };

  CapacitorApp.addListener("backButton", ({ canGoBack }) => {
    if (confirmDialogData().isOpen) {
      setConfirmDialogOpen(false);
      return;
    }
    if (dialogData().isOpen) {
      setDialogOpen(false);
      return;
    }
    if (canGoBack && window.history.length > 1) {
      navigate(-1);
    } else {
      CapacitorApp.exitApp();
    }
  });

  return (
    <>
      <Tabs value={currentTab()}>
        <Tabs.List class={styles.tabsList}>
          <Tabs.Trigger
            class={styles.tabsTrigger}
            value="diary"
            onClick={() => navigate('/')}
          >
            Napló
          </Tabs.Trigger>
          <Tabs.Trigger
            class={styles.tabsTrigger}
            value="food"
            onClick={() => navigate('/food')}
          >
            Élelmiszerek
          </Tabs.Trigger>
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
        {props.children}
      </Tabs>
      <Dialog />
      <ConfirmDialog />
    </>
  );
}