declare module ReduxLogger{
    function createLogger():any;
}

declare module "redux-logger"{
    export = ReduxLogger;
}