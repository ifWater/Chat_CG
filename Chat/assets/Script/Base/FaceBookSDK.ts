import ConfigMgr from "./ConfigMgr";

//FaceBook 接口类
export default class FaceBookSDK{
    private FBInstant:any;
    private _playerName:string;
    private _playerIcon:string;
    private _playerId:string;
    private static _instance:FaceBookSDK;
    //获取玩家名字
    public GetPlayerName():string{
        if(this._playerName === undefined){
            this._playerName = this.FBInstant.player.getName();
        }
        return this._playerName;
    }
    public static GetInstance():FaceBookSDK{
        if(this._instance == null){
            this._instance = new FaceBookSDK();
        }
        return this._instance;
    }
    //无成功回调分享
    public Share(imgBase64:string,titleTxt:string,callBack:Function,callObj:any){
        this.FBInstant.shareAsync({
            intent:'SHARE',
            image:imgBase64,
            text:titleTxt
        }).then(()=>{
            callBack();
        })
    }
    //获取玩家头像icon
    public GetPlayerIcon():string{
        if(!this._playerIcon){
            this._playerIcon = this.FBInstant.player.getPhoto();
        }
        return this._playerIcon;
    }

    //获取玩家ID
    public GetPlayerID():string{
        if(!this._playerId){
            this._playerId = this.FBInstant.player.getID();
        }
        return this._playerId;
    }
}