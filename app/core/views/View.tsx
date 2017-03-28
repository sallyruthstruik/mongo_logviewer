/**
 * Created by stas on 24.03.17.
 */


import {bindActionCreators} from "redux";
import {IAction} from "./TableView";
import {connect} from "react-redux";
import * as React from "react";

/**
 * Класс, ответственный за конфигурацию Redux-событий и редьюсеров
 */
abstract class ReduxConfigurator<Props>{

}

/**
 * Базовый класс любого Redux-представления
 * Инкапсулирует логику взаимодействия React компонента, actions и редьюсера
 */
export abstract class View<Model, Props>{

    protected name: String;

    constructor(name: string){
        this.name = name;
    }

    /**
     * Функция возвращает обернутый в redux компонент
     */
    getComponent(){
        return ((self)=>{
            @connect(this.mapStateToProps.bind(this), this.mapDispatchToProps.bind(this))
            class ConnectedComponent extends React.Component<Props, {}>{
                render(){
                    return self.getNotWrappedComponent(this.props);
                }
            }

            return ConnectedComponent;
        })(this);
    };

    abstract getActions();

    abstract reducer(state: any, action: IAction): any;

    protected abstract getInitialState();

    /**
     * Возвращает не обернутый в redux компонент
     * @param props
     * @returns {any}
     * @private
     */
    abstract getNotWrappedComponent(props: any);

    getAdditionalProps(){
        return {};
    };

    getReducer() {
        return this.reducer.bind(this);
    }

    mapStateToProps(state){
        try {
            return Object.assign(
                {}, state[this.name.toString()],
                this.getAdditionalProps()
            );
        } catch (e) {
            console.error("Возможно вы забыли подключить View в редьюсере");
            throw e;
        }
    };

    mapDispatchToProps(dispatch){
        return {
            actions: bindActionCreators(this.getActions(), dispatch)
        };
    };

}