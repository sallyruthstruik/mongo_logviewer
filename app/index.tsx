/// <reference path="../typings/tsd.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './components/app';
import {store} from "./store";
import {Routing} from "./router";


class Main extends React.Component<{}, {}> {
  public render(): React.ReactElement<Provider> {
    return (<Provider store={store}>
      <Routing>
      </Routing>
    </Provider>);
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));
