// Import Third Party Dependencies
import * as Redux from 'redux';

// Import Components
import './components/no-script/no-script';
import './components/todo-app/todo-app';

// Import Configuration
import * as config from '../config.json';

// Import State
import apiService from './state/api/api-service';
import store from './state/store';
import { getTodos } from './state/todo/actions';
import todoReducers from './state/todo/reducers';

// Import Styles
import './styles.css';

function boot() {
    // set environment to be visible on global scope
    (window as any).process = { env: { NODE_ENV: process.env.NODE_ENV } };

    configureApi();
    initializeStore();
    loadTodos();
}

function configureApi() {
    // set base url for api calls
    apiService.setBaseUrl(config.api.baseUrl);
}

function initializeStore() {
    // combine reducers
    const reducer = Redux.combineReducers({
        todo: todoReducers
    });

    // register root reducer with store
    store.replaceReducer(reducer);
}


function loadTodos() {
    // todo: is there a better place?
    store.dispatch(getTodos());
}
boot();