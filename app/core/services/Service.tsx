/**
 * Created by stas on 24.03.17.
 */

import {IModel} from "../models/IModel";

declare var $: any;


interface IRequestParameters{
    filters: any;
}

/**
 * Базовый класс сервиса для взаимодействия с бэкендом.
 */
export class Service<Model extends IModel>{
    private endpoint: String;

    constructor(endpoint: String){
        this.endpoint = endpoint;
    }

    protected makeJsonHttpRequest(): Promise<Model[]>{
        return $.ajax({
            "url": this.endpoint,
            "dataType": "json",
            "method": "get"
        })
    }

    list(): Promise<Model []>{
        return this.makeJsonHttpRequest().then((data: any)=>data.results);
    }
}