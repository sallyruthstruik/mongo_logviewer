/**
 * Created by stas on 24.03.17.
 */

import {IModel} from "../models/IModel";

declare var $: any;

export interface IFilterItem{
    name: string,
    value: any,
    type?: string
}

export interface IRequestParameters{
    filters?: IFilterItem[];
    page?: number;
    pages?: number;
    page_size?: number;
    ordering?: string[];
}

export const defaultParams: IRequestParameters = {
    filters: [],
    page: 1,
    page_size: 10,
    ordering: []
};

/**
 * Базовый класс сервиса для взаимодействия с бэкендом.
 */
export class Service<Model extends IModel>{
    private endpoint: String;

    constructor(endpoint: String){
        this.endpoint = endpoint;
    }

    protected makeJsonHttpRequest(params: IRequestParameters): Promise<Model[]>{

        const url = `${this.endpoint}?page=${params.page}&page_size=${params.page_size}`;

        return $.ajax({
            "url": url,
            "dataType": "json",
            "method": "get"
        })
    }

    list(params: IRequestParameters = defaultParams): Promise<Model []>{
        return this.makeJsonHttpRequest(params).then((data: any)=>data);
    }
}