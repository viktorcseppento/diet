import styles from './NewFoodDialog.module.scss';
import { Tabs } from '@kobalte/core/tabs';
import BasicFoodForm from './BasicFoodForm';
import CompositeFoodForm from './CompositeFoodForm';

export default function NewFoodDialog() {
    return (
        <Tabs class={styles.tabs}>
            <Tabs.List class={styles.tabsList}>
                <Tabs.Trigger class={styles.tabsTrigger} value="basic">Alap</Tabs.Trigger>
                <Tabs.Trigger class={styles.tabsTrigger} value="composite">Összetett</Tabs.Trigger>
                <Tabs.Indicator class={styles.tabsIndicator} />
            </Tabs.List>
            <Tabs.Content value="basic"><BasicFoodForm /></Tabs.Content>
            <Tabs.Content value="composite"><CompositeFoodForm /></Tabs.Content>
        </Tabs>
    );
}