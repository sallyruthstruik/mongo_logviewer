
import {IModel} from "../models/IModel";
import {PaginatedTableView, IPaginatedTableProps} from "./PaginatedTableView";
import * as React from "react";
import {store} from "../../store";

/**
 * Все View с возможностью фильтрации должны имплементить этот интерфейс
 */
interface IFilterableView{

    filterValueChanged(change: IFilterValueChange);

}

interface IFilterValueChange{
    name: string,
    value: any
}

export class Filter{
    private name: string;
    private view: IFilterableView;
    private type: string;

    constructor(name: string, view: IFilterableView){
        this.name = name;
        this.view = view;
    }

    onValueChange(e){
        this.view.filterValueChanged({
            name: this.name,
            value: e.target.value
        } as IFilterValueChange)
    }

    getComponent() {
        return <input type="text" name={this.name} onChange={this.onValueChange.bind(this)}></input>;
    }
}

export abstract class PaginatedTableViewWithFilters<Model extends IModel> extends PaginatedTableView<Model>
    implements IFilterableView{

    getNotWrappedComponent(props: IPaginatedTableProps){
        const table = super.getNotWrappedComponent(props);

        const filters = this.buildFilterElement(this.getFilters(props));

        return <div className="paginated-filters-table-view">
            <div className="row">
                <div className="col-md-12">
                    {filters}
                </div>
            </div>
            {table}
        </div>

    }

    abstract getFilters(props: IPaginatedTableProps): Filter[];

    private buildFilterElement(filters: Filter[]) {
        return <ul>{filters.map(f=><li>{f.getComponent()}</li>)}</ul>;
    }

    filterValueChanged(change: IFilterValueChange){
        const actions = this.getActions();
        store.dispatch((dispatch, getState)=>{
            dispatch({
                type: this.SET_REQUEST_PARAMS,
                payload: {
                    filters: [{
                        name: change.name,
                        value: change.value
                    }]
                }
            });

            const newState = getState()[this.name as string];

            actions.fetch(newState.requestParameters)(dispatch);
        })
    }
}