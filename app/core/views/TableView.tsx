
import {View} from "./View";
import {Service, IRequestParameters, defaultParams} from "../services/Service";
import {IModel} from "../models/IModel";
import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {UrlSyncView} from "./UrlSyncViewWrapper";

export interface ITableProps{
    //props from view class
    columns?: String[],
    renderRow?: (IModel)=>any;

    //props from redux
    data?: IModel[],
    requestParameters?: IRequestParameters,
    actions?: {
        fetch: (params: IRequestParameters)=>any;
    },
    loading?: boolean
}

export interface IAction{
    type: string,
    payload: any
}

class TableComponent extends React.Component<ITableProps,{}>{

    componentDidMount(){
        this.props.actions.fetch(this.props.requestParameters);
    }

    render(){
        if(this.props.loading){
            return <div>Loading...</div>
        }
        return (<table className="table">
            <thead><tr>
                {this.props.columns.map(col=>{
                    return <th>{col}</th>
                })}</tr>
            </thead>
            <tbody>
                {this.props.data.map(item=>this.props.renderRow(item))}
            </tbody>
        </table>);
    }
}

export abstract class TableView<Model extends IModel> extends UrlSyncView<Model, ITableProps>{
    protected FETCH_STARTED: string;
    protected FETCH_FINISHED: string;

    /**
     * Метод возвращает сервис, с которым работает представление
     */
    abstract getService(): Service<Model>;

    /**
     * @param name Название компонента, которое будет использоваться в глобальном Redux-стейте
     */
    constructor(name: string){
        super(name);

        this.FETCH_STARTED = `{name}_fetch_started`;
        this.FETCH_FINISHED = `${name}_fetch_finished`;
    }

    abstract getColumns(): String[];

    /**
     * Возвращает функцию, ответственную за рендеринг строк таблицы
     * @returns {(item:any)=>any}
     */
    getRenderRow(): (item: any)=>any{
        return (item: any)=>{
            const children = this.getColumns().map((col: String)=>{
                let key = col.toString();
                return <td key={key}>{item[key]}</td>
            });

            return this.getRowComponent(item, children)
        };
    }

    /**
     * Возвращает компонент-враппер строки таблицы
     * @returns {ConnectedComponent}
     */
    getRowComponent(item: Model, children: any){
        return <tr>{children}</tr>
    }


    getAdditionalProps(){
        return {
            columns: this.getColumns(),
            renderRow: this.getRenderRow(),
        }
    }

    reducer(state=null, action: IAction){
        if(state == null){
            state = this.getInitialState();
        }

        switch (action.type){
            case this.FETCH_STARTED:
                return Object.assign({}, state, {loading: true});
            case this.FETCH_FINISHED:
                return Object.assign({}, state, {
                    loading: false,
                    data: action.payload
                });
            default:
                return Object.assign({}, state);
        }
    };

    getActions(): any{
        return {
            fetch: (params: IRequestParameters)=>(dispatch)=>{
                dispatch({type: this.FETCH_STARTED});

                this.getService().list(params).then(data=>dispatch({
                    type: this.FETCH_FINISHED,
                    payload: data
                }))
            }
        }
    }

    protected getInitialStateWithoutRoutingParams(): ITableProps {
        return {
            data: [],
            requestParameters: defaultParams
        }
    }


    getNotWrappedComponent(props: any) {
        return <TableComponent {...props}/>
    }
}