
import {IModel} from "../models/IModel";
import {PaginatedTableView, IPaginatedTableProps} from "./PaginatedTableView";
import * as React from "react";
import {store} from "../../store";
import {Store} from "redux";
import {IRequestParameters} from "../services/Service";

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

interface IFilterProps{
    value: any;
}

export class Filter{
    private name: string;
    private view: IFilterableView;
    private type: string;

    constructor(name: string, view: IFilterableView){
        this.name = name;
        this.view = view;
    }

    getName(){
        return this.name;
    }

    onValueChange(e){
        this.view.filterValueChanged({
            name: this.name,
            value: e.target.value
        } as IFilterValueChange)
    }

    /**
     *
     * @param props параметры, которые нужны для создания HTML элемента
     * @returns {any}
     */
    getComponent(props: IFilterProps) {
        return <input type="text"
                      name={this.name}
                      onChange={this.onValueChange.bind(this)}
                      value={props.value}
        ></input>;
    }
}

export abstract class PaginatedTableViewWithFilters<Model extends IModel> extends PaginatedTableView<Model>
    implements IFilterableView{

    abstract getStore(): Store;

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
        const self = this;
        const requestParams: IRequestParameters = this.getStore().getState()[this.name as string].requestParameters;

        return <ul>{filters.map((f)=>{
            let value = requestParams.filters.filter(item=>item.name==f.getName());
            if(value.length > 0){
                value = value[0].value
            }else{
                value = null;
            }

            return <li>{f.getComponent({value})}</li>
        })}</ul>;
    }

    filterValueChanged(change: IFilterValueChange){
        const actions = this.getActions();
        this.getStore().dispatch((dispatch, getState)=>{
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