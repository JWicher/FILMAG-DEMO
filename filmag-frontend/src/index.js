import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
// eslint-disable-next-line no-unused-vars
import babelPolyfill from 'babel-polyfill';
import './main.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
    , document.getElementById('root'));

serviceWorker.unregister();
