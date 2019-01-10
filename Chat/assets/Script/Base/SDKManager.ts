import FaceBookSDK from "./FaceBookSDK";

enum Platform{
    WB,
    FaceBook,
    WeiXin,
}

export default class SDKManager{
    private static _instance:SDKManager;

    public static GetInstance():SDKManager{
        if(this._instance == null){
            this._instance = new SDKManager();
        }
        return this._instance;
    }

    //记录唯一平台
    private _recordPlatform:number = 0;


    //获取玩家名字
    public GetPlayerName():string{
        switch(this._recordPlatform){
            case Platform.WB:{
                return "PlayerName";
            }
            case Platform.FaceBook:{
                return FaceBookSDK.GetInstance().GetPlayerName();
            }
            case Platform.WeiXin:{
                return "PlayerName";
            }
        }
    }

    //获取玩家头像icon
    public GetPlayerIcon():string{
        switch(this._recordPlatform){
            case Platform.WB:{
                return "https://cutepard.com/quce_server/static/system1.png";
            }
            case Platform.FaceBook:{
                return FaceBookSDK.GetInstance().GetPlayerIcon();
            }
            case Platform.WeiXin:{
                return "https://cutepard.com/quce_server/static/system1.png";
            }
        }
    }

    //获取玩家ID
    public GetPlayerID():string{
        switch(this._recordPlatform){
            case Platform.WB:{
                return "IfWater";
            }
            case Platform.FaceBook:{
                return FaceBookSDK.GetInstance().GetPlayerID();
            }
            case Platform.WeiXin:{
                return "IfWater";
            }
        }
    }

    //分享回调
    public StartShareCall(titleTxt:string,imgBase64:string,callBack:Function,callObj:any):void{
        switch(this._recordPlatform){
            case Platform.WB:{
                console.log("不能分享哟!");
                break;
            }
            case Platform.FaceBook:{
                FaceBookSDK.GetInstance().Share(imgBase64,titleTxt,callBack,callObj);
                break;
            }
            case Platform.WeiXin:{
                console.log("不能分享哟!");
                break;
            }
        }
    }
}