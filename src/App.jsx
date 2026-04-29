import styles from './App.module.scss';
import { Tabs } from '@kobalte/core/tabs';
import FoodList from './pages/food/FoodList';
import { StoreProvider } from './context/StoreContext';
import { DialogProvider } from './context/DialogContext';
import Dialog from './components/Dialog';
import Meals from './pages/meals/Meals';

export default function App() {
  return (
    <StoreProvider>
      <DialogProvider>
        <div>
          <Tabs>
            <Tabs.List class={styles.tabsList}>
              <Tabs.Trigger class={styles.tabsTrigger} value="meals-diary">Étkezési napló</Tabs.Trigger>
              <Tabs.Trigger class={styles.tabsTrigger} value="food">Élelmiszerek</Tabs.Trigger>
              <Tabs.Indicator class={styles.tabsIndicator} />
            </Tabs.List>
            <Tabs.Content value="meals-diary"><Meals /></Tabs.Content>
            <Tabs.Content value="food"><FoodList /></Tabs.Content>
          </Tabs>
        </div>
        <Dialog />
      </DialogProvider>
    </StoreProvider>
  );
}