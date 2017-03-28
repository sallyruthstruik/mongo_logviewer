import { counterApp } from './reducers';
import {applyMiddleware} from "redux";
import { Store, createStore } from 'redux';

declare const require: (name: String) => any;
const thunk = require("redux-thunk");

import {createLogger} from "redux-logger";
import {routerMiddleware} from "react-router-redux";
import {hashHistory} from "react-router";
import {push} from "react-router-redux";

const logger = createLogger();

interface IHotModule {
    hot?: { accept: (path: string, callback: () => void) => void };
};

declare const module: IHotModule;

function configureStore(): Store {
    console.log("THUNK", thunk);
    const store: Store = createStore(
        counterApp,
        applyMiddleware(thunk.default, logger, routerMiddleware(hashHistory))
    );

    if (module.hot) {
        module.hot.accept('./reducers', () => {
            const nextRootReducer: any = require('./reducers').counterApp;
            store.replaceReducer(nextRootReducer);
        });
    }


    return store;
}

export const store: Store = configureStore();