/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { connect } from 'react-redux';

import { incrementCounter, decrementCounter, addCounter } from '../actions';
import { CounterList } from './counter_list';
import {tagListView} from "./tag_list";

interface IAppState {
  counters: number[];
}

interface IAppProps {
  dispatch?: (func: any) => void;
  counters?: number[];
}

function select(state: { counters: number[] }): IAppState {
  return {
    counters: state.counters,
  };
}

@connect(select)
export class App extends React.Component<IAppProps, {}> {
  public render(): React.ReactElement<{}> {
    const { dispatch, counters }: any = this.props;



    return (<div>
          {tagListView.getComponent()}
        <button onClick={() => dispatch(addCounter())}>Add Counter</button>
      </div>
    );
  }
}
