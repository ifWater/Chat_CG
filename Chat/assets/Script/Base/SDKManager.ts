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
    //记录分享时的数据（还未分享）
    private _recordShareData:any;


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
    public StartShareCall(titleTxt:string,imgBase64:string,callBack:Function,callObj:any,_data?:any):void{
        switch(this._recordPlatform){
            case Platform.WB:{
                console.log("不能分享哟!");
                break;
            }
            case Platform.FaceBook:{
                FaceBookSDK.GetInstance().Share(imgBase64,titleTxt,callBack,callObj,_data);
                break;
            }
            case Platform.WeiXin:{
                console.log("不能分享哟!");
                break;
            }
        }
    }

    //给好友发送消息
    public SendMessageToFrends(baseImg:string,titleTxt:string,_data?:any):void{
        switch(this._recordPlatform){
            case Platform.WB:{
                console.log("不能发送消息哟!");
                break;
            }
            case Platform.FaceBook:{
                FaceBookSDK.GetInstance().SendMessageToFriends(baseImg,titleTxt,_data);
                break;
            }
            case Platform.WeiXin:{
                console.log("不能发送消息哟!");
                break;
            }
        }
    }

    //获取分享时附带的数据（通过分享进入）
    public GetShareLoadData():any{
        let data = null;
        switch(this._recordPlatform){
            case Platform.WB:{
                console.log("此平台无法调用该函数！");
                break;
            }
            case Platform.FaceBook:{
                data = FaceBookSDK.GetInstance().GetShareLoadData();
                break;
            }
            case Platform.WeiXin:{
                console.log("此平台无法调用该函数！");
                break;
            }
        }
        return data;
    }

    //设置分享时的data（还未分享）
    public SetShareData(_data:any):void{
        this._recordShareData = _data;
    }

    //获取分享时的data（还未分享）
    public GetShareData():any{
        return this._recordShareData;
    }
}