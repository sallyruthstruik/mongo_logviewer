
import {View} from "./View";
import {Service} from "../services/Service";
import {IModel} from "../models/IModel";
import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

interface ITableProps{
    //props from view class
    columns?: String[],
    renderRow?: (IModel)=>any;

    //props from redux
    data?: IModel[],
    actions?: {
        fetch: ()=>any;
    },
    loading?: boolean
}

class TableComponent extends React.Component<ITableProps,{}>{

    componentDidMount(){
        this.props.actions.fetch();
    }

    render(){
        if(this.props.loading){
            return <div>Loading...</div>
        }
        return (<table>
            <thead><tr>
                {this.props.columns.map(col=>{
                    return <td>{col}</td>
                })}</tr>
            </thead>
            <tbody>
                {this.props.data.map(item=>this.props.renderRow(item))}
            </tbody>
        </table>);
    }

}



export abstract class TableView<Model extends IModel> extends View{
    private name: String;
    private FETCH_STARTED: string;
    private FETCH_FINISHED: string;

    abstract getService(): Service<Model>;

    /**
     * @param name Название компонента, которое будет использоваться в глобальном Redux-стейте
     */
    constructor(name: String){
        super();
        this.name = name;

        this.FETCH_STARTED = `{name}_fetch_started`;
        this.FETCH_FINISHED = `${name}_fetch_finished`;
    }

    /**
     *
     * @param item
     */
    renderRow = (item: any)=>{
        return (<tr>
            {this.getColumns().map((col: String)=>{
                let key = col.toString();
                return <td key={key}>{item[key]}</td>
            })}
        </tr>)
    };

    abstract getColumns(): String[];

    getComponent(){

        @connect(this.mapStateToProps, this.mapDispatchToProps)
        class ConnectedComponent extends React.Component<ITableProps, {}>{
            render(){
                return <TableComponent {...this.props}/>
            }
        }

        return <ConnectedComponent />;
    };

    mapStateToProps = (state)=>{
        try {
            return Object.assign({}, state[this.name.toString()], {
                columns: this.getColumns(),
                renderRow: this.renderRow,

            });
        }catch(e){
            console.error("Возможно вы забыли подключить View в редьюсере");
            throw e;
        }
    };

    mapDispatchToProps = (dispatch)=>{
        return {
            actions: bindActionCreators(this.getActions(), dispatch)
        };
    };

    getReducer() {
        const initialState = this.getInitialState();

        const self = this;
        return function(state=initialState, action){
            switch (action.type){
                case self.FETCH_STARTED:
                    return Object.assign({}, state, {loading: true});
                case self.FETCH_FINISHED:
                    console.log("DATA", action.payload);
                    return Object.assign({}, state, {
                        loading: false,
                        data: action.payload
                    });
                default:
                    return Object.assign({}, state);
            }
        }
    }

    getActions(){
        return {
            fetch: this.fetchAction
        }
    }

    fetchAction = ()=>{
        const self = this;
        return (dispatch)=>{
            dispatch({type: self.FETCH_STARTED});

            self.getService().list().then(data=>dispatch({
                type: self.FETCH_FINISHED,
                payload: data
            }))
        }
    }

    private getInitialState() {
        return {
            data: []
        }
    }
}