/* @refresh reload */
import { render } from 'solid-js/web';

import { Route, Router } from '@solidjs/router';
import App from './App';
import { ConfirmDialogProvider } from './context/ConfirmDialogContext';
import { DialogProvider } from './context/DialogContext';
import './index.scss';
import FoodList from './pages/food/FoodList';
import Meals from './pages/meals/Meals';


const root = document.getElementById('root');

render(() => (
    <ConfirmDialogProvider>
        <DialogProvider>
            <Router root={App}>
                <Route path="/" component={Meals} />
                <Route path="/food" component={FoodList} />
            </Router>
        </DialogProvider>
    </ConfirmDialogProvider>
), root);
