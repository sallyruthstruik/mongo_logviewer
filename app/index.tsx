/// <reference path="../typings/tsd.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Store, createStore } from 'redux';
import { Provider } from 'react-redux';

import { App } from './components/app';
import { counterApp } from './reducers';
import {applyMiddleware} from "redux";

declare const require: (name: String) => any;
var thunk = require("redux-thunk");

interface IHotModule {
  hot?: { accept: (path: string, callback: () => void) => void };
};

declare const module: IHotModule;

function configureStore(): Store {
  console.log("THUNK", thunk);
  const store: Store = createStore(
      counterApp,
      applyMiddleware(thunk.default)
  );

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer: any = require('./reducers').counterApp;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

const store: Store = configureStore();

class Main extends React.Component<{}, {}> {
  public render(): React.ReactElement<Provider> {
    return (<Provider store={store}>
      <App />
    </Provider>);
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));
