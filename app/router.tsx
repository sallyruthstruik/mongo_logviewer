import * as React from "react";
import {Router, hashHistory} from "react-router";
import {syncHistoryWithStore} from "react-router-redux";
import {store} from "./store";
import {IStore} from "~react-router-redux~redux";
import {Route} from "react-router";
import {tagListView} from "./components/tag_list";

console.log("HASH HISTORY");

const history = syncHistoryWithStore(hashHistory, store as any);

export class Routing extends React.Component<{}, {}>{

    render(){
        return <Router history={hashHistory}>
            <Route path="test" component={tagListView.getComponent()}/>
        </Router>
    }

}