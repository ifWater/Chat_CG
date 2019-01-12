import ConfigMgr from "./ConfigMgr";

//FaceBook 接口类
export default class FaceBookSDK{
    private FBInstant:any = window["FBInstant"];
    private _playerName:string;
    private _playerIcon:string;
    private _playerId:string;
    private _platform:string;
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
    //给好友发送消息
    public SendMessageToFriends(baseImg:string):void{
        this.FBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Join The Fight',
            image: baseImg,
            text: {
              default: 'X just invaded Y\'s village!',
              localizations: {
                ar_AR: 'X \u0641\u0642\u0637 \u063A\u0632\u062A ' +
                '\u0642\u0631\u064A\u0629 Y!',
                en_US: 'X just invaded Y\'s village!',
                es_LA: '\u00A1X acaba de invadir el pueblo de Y!',
              }
            },
            template: 'VILLAGE_INVASION',
            data: { myReplayData: '...' },
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
          }).then(function() {
            // closes the game after the update is posted.
            // this.FBInstant.quit();
          });
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

    //获取当前FaceBook平台
    public GetNowPlatform():string{
        if(!this._platform){
            this._platform = this.FBInstant.getPlatform();
        }
        return this._platform;
    }

    //跳转到其他FaceBook类游戏
    public JumpToOtherGame(gameId:string){
        this.FBInstant.switchGameAsync(gameId).catch(
            function(err){
                console.log("跳转游戏失败！,",err);
            }
        );
    }

    //获取广告ID
    public GetAdsId(){
        this.FBInstant.getPlacementID();
    }

    //加载横幅广告
    public PreloadAds(){
        let adsId = this.GetAdsId();
        this.FBInstant.getInterstitialAdAsync(
            adsId,
        ).then(function(interstitial){
            return interstitial.loadAsync();
        }).catch(function(err){
            console.log("加载广告失败！",err);
        }).then(function(){
            console.log("广告加载完毕");
        }).catch(function(err){
            console.log("广告播放失败！",err);
        })
    }
}