/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import {Service} from "../core/services/Service";
import {IModel} from "../core/models/IModel";
import {PaginatedTableView, IPaginatedTableProps} from "../core/views/PaginatedTableView";
import {LocalService} from "../core/services/LocalService";
import {PaginatedTableViewWithFilters, Filter} from "../core/views/PaginatedTableViewWithFilters";

export const tagService = new LocalService("http://localhost:8000/admin/api/soft_tags");

class Tag implements IModel{
    id: String;
    name: String;
    created: string;
    updated: string;
    active: string;
}

class TagListComponent extends React.Component<{},{}>{

    public render(){
        return (<div>TagList</div>)
    }
}

class TagListView extends PaginatedTableViewWithFilters<Tag>{
    getFilters(props: IPaginatedTableProps): Filter[] {
        return [new Filter(name="name", this)];
    }
    getColumns(): String[] {
        return ["id", "created", "updated", "name"];
    }
    getService(): Service<Tag> {
        return tagService;
    }

    getRowComponent(item: Tag, children: any){
        let cls = "red";
        if(item.active){
            cls = "#dff0d8"
        }
        return <tr style={{background: cls}}>{children}</tr>
    }


}

export const tagListView = new TagListView("tag_list");
