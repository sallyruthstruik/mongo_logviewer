/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {Service} from "../core/services/Service";
import {TableView} from "../core/views/TableView";
import {IModel} from "../core/models/IModel";

export const tagService = new Service("http://localhost:8000/admin/api/soft_tags");

class Tag implements IModel{
    id: String;
    name: String;
}

class TagListComponent extends React.Component<{},{}>{

    public render(){
        return (<div>TagList</div>)
    }
}

class TagListView extends TableView<Tag>{
    getColumns(): String[] {
        return ["id", "name"];
    }
    getService(): Service<Tag> {
        return tagService;
    }
}

export const tagListView = new TagListView("tag_list");
