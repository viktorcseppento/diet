import { getSettings } from '../../data/settingsRepository';
import createLiveQuery from '../../hooks/createLiveQuery';
import styles from './SettingsDialog.module.scss';
import appStyles from '~/App.module.scss';

export default function SettingsDialog() {
    const settings = createLiveQuery(getSettings);

    return (
        <div>
        </div>
    );
}