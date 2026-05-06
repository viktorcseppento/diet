/* @refresh reload */
import { render } from 'solid-js/web';

import App from './App';
import { DialogProvider } from './context/DialogContext';
import './index.scss';

const root = document.getElementById('root');

render(() => (
    <DialogProvider>
        <App />
    </DialogProvider>
), root);
