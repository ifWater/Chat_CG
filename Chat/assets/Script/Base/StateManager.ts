import BaseState from "./BaseState";

export default class StateManager{
    private static _instance:StateManager;
    
    public static GetInstance():StateManager{
        if(this._instance == undefined){
            this._instance = new StateManager();
        }
        return this._instance;
    }

    private _nowState:BaseState;
    //获取当前状态
    public GetNowState():BaseState{
        return this._nowState;
    }

    
}