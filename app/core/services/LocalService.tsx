
import {Service, IRequestParameters, defaultParams} from "./Service";
import {IModel} from "../models/IModel";

/**
 * Локально сохраняет копию данных полученных с сервера для более быстрой работы
 */
export class LocalService<Model extends IModel>extends Service<Model>{

    private data: Model[];

    list(params: IRequestParameters = defaultParams): Promise<any> {
        let promise = new Promise((resolve, reject)=>{
            resolve(this.data);
        });
        if(!this.data){
            const fetchParams = Object.assign({}, params) as IRequestParameters;
            fetchParams.page_size = 10000;
            promise = super.list(fetchParams)
                 .then((data: any)=>{
                    this.data = data.results;
                    return this.data;
                 })
        }

        return promise.then(data=>{
            const page = params.page;
            const page_size = params.page_size;

            let output = this.data;

            console.log("FILTERS", params);
            if(params.filters.length > 0){
                for(let {name:string, value} of params.filters){
                    output = output.filter((item)=>{
                        return item[name].match(new RegExp(`.*${value}.*`));
                    })
                }
            }

            output = output.slice(
                page_size*(page-1), page_size*page
            );


            const out = {
                results: output,
                page: page,
                page_size: page_size,
                pages: this.data.length/page_size,
                total: this.data.length
            };

            return out;
        });
    }
}