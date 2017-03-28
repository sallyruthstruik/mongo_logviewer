
import {IModel} from "../models/IModel";
import {TableView, ITableProps} from "./TableView";
import {Pagination} from "react-bootstrap";
import * as React from "react";

import * as lodash from "lodash";


export interface IPaginatedTableProps extends ITableProps{
    actions?: {
        fetch: ()=>any;
        setPage: ()=>any;
    }
}

export abstract class PaginatedTableView<Model extends IModel> extends TableView<Model>{
    protected SET_REQUEST_PARAMS: string;

    constructor(name: string){
        super(name);

        this.SET_REQUEST_PARAMS = `${name}_set_request_params`;
    }

    getNotWrappedComponent(props: IPaginatedTableProps): any {
        const table = super.getNotWrappedComponent(props);

        const pagination = <Pagination
            activePage={props.requestParameters.page}
            items={props.requestParameters.pages}
            onSelect={props.actions.setPage}
        />;

        return (<div className="paginated-table-view">
            <div className="row">
                <div className="col-md-4 col-md-offset-4">
                    {pagination}
                    </div>
            </div>
            <div className="row">
                {table}
            </div>
            <div className="row">
                <div className="col-md-4 col-md-offset-4">
                    {pagination}
                    </div>
            </div>
        </div>)
    }


    reducer(state: IPaginatedTableProps = null, action): {}{
        if(action.type == this.FETCH_FINISHED){
            const params = Object.assign(action.payload);
            const results = params.results;
            delete params.results;

            return Object.assign({}, state, {
                loading: false,
                data: results,
                requestParameters: lodash.merge(
                    state.requestParameters, params
                )
            })
        }
        else if(action.type == this.SET_REQUEST_PARAMS){
            console.log(
                {requestParameters: {page: action.payload}},
                lodash.merge({}, state, {requestParameters: action.payload})
            );
            this.savePropsInUrl({requestParameters: action.payload});
            return lodash.merge({}, state, {requestParameters: action.payload})
        }

        return super.reducer(state, action);
    }

    getActions(){
        const actions: any = super.getActions();

        const self = this;
        actions.setPage = (number: number)=>{
            return (dispatch, getState)=>{
                dispatch({
                    type: self.SET_REQUEST_PARAMS,
                    payload: {
                        page: number
                    }
                });

                const newState = getState()[self.name as string];

                actions.fetch(newState.requestParameters)(dispatch);

            };
        };

        return actions;
    }
}