import ConfigMgr from './ConfigMgr';
import EventManager from './EventManager';
import { EventEnum } from './EventEnum';
import DelayTimeManager from './DelayTimeManager';
export default class MessageManager{
    private static _instance:MessageManager;

    public static GetInstance():MessageManager{
        if(this._instance == undefined){
            this._instance = new MessageManager();
        }
        return this._instance;
    }

    public SendMessage(reqData:any,url:string,callObj:object,callback:Function,defCall?:Function){
        if(CC_DEBUG||ConfigMgr.IsTest){
            console.log("开始请求数据！",reqData,url);
        }
        let param:string = JSON.stringify(reqData);

        let xhr:XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    let reponse = xhr.responseText;
                    if(reponse){
                        let reponseJson = JSON.parse(reponse);
                        if(CC_DEBUG||ConfigMgr.IsTest){
                            console.log("收到数据:",reponseJson);
                        }
                        if(reponseJson.code != 20000){
                            console.log("数据解析错误",reponseJson);
                            defCall.call(callObj);
                        }
                        else{
                            // DelayTimeManager.AddDelayOnce(2,()=>{
                            //     EventManager.DispatchEvent(EventEnum.WaitModelOver);
                            //     callback.call(callObj,reponseJson);
                            // },this);
                            // EventManager.DispatchEvent(EventEnum.WaitModelOver);
                            callback.call(callObj,reponseJson);
                        }
                    }
                    else{
                        console.log("数据解析错误!",reponse,reponse);
                        if(defCall){
                            defCall.call(callObj);
                        }
                    }
                }
                else{
                    console.log("请求失败!!");
                    if(defCall){
                        defCall.call(callObj)
                    }
                }
            }
        };
        xhr.open("POST",ConfigMgr.ServerIP+url,true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xhr.send(param);
    }
}