

import {View} from "./View";
import {IModel} from "../models/IModel";
import {IAction} from "./TableView";
import {store} from "../../store";
import * as lodash from "lodash";

/**
 * Класс отвечает за синхронизацию View с URL QueryString.
 * Использует react-router-redux для синхронизации
 */
export abstract class UrlSyncView <Model extends IModel, Props> extends View<Model, Props>{


    protected abstract getInitialStateWithoutRoutingParams();

    getInitialState() {
        const state = this.getInitialStateWithoutRoutingParams();

        const initialParams = this.getParamsFromLocation();

        return this.mergeQueryParamsIntoInitialState(state, initialParams);
    }

    /**
     * Вызывается для извлечения props из url
     * @returns {any}
     */
    protected getParamsFromLocation() {

        const part = this.getPropsPartFromLocation();
        if(part){
            return JSON.parse(decodeURIComponent(part))
        }

        return {};
    }

    private getPropsPartFromLocation(){
        const regexp = /\?props=(.*)$/;

        const matches = window.location.hash.match(regexp);
        if(matches)
            return matches[1];
    }

    /**
     * Должен быть вызван для сохранения props в url
     * @param props
     */
    protected savePropsInUrl(props: any){
        const propsString = encodeURIComponent(JSON.stringify(props));
        const part = this.getPropsPartFromLocation();
        if(part){
            window.location.hash = window.location.hash.replace(part, propsString);
        }else{
            window.location.hash += `?props=${propsString}`;
        }
    }

    /**
     * Вызывается для интеграции props полученных из url в state
     * @param state
     * @param initialParams
     * @returns {any}
     */
    protected mergeQueryParamsIntoInitialState(state: any, initialParams: any) {
        return lodash.merge({}, state, initialParams);
    }
}