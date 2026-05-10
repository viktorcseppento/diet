/* @refresh reload */
import { render } from 'solid-js/web';

import App from './App';
import { DialogProvider } from './context/DialogContext';
import './index.scss';
import { ConfirmDialogProvider } from './context/ConfirmDialogContext';

const root = document.getElementById('root');

render(() => (
    <ConfirmDialogProvider>
        <DialogProvider>
            <App />
        </DialogProvider>
    </ConfirmDialogProvider>
), root);
