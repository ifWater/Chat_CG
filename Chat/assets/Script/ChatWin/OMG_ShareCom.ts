import SDKManager from '../Base/SDKManager';
import EventManager from '../Base/EventManager';
import { EventEnum } from '../Base/EventEnum';
import Tools from '../Base/Tools';
import WindowManager from '../Base/WindowManager';
import BaseWindow from '../Base/BaseWindow';
import MessageManager from '../Base/MessageManager';
import ConfigMgr from '../Base/ConfigMgr';

export default class OMG_ShareCom extends fgui.GComponent{
    private _againBtn:fgui.GLoader;
    private _shareBtn:fgui.GLoader;
    private _sprite:fgui.GLoader;
    private _recordId:string;
    private _shareToFriend:fgui.GLoader;

    private _WaitEff:fgui.Transition;
    private _WaitEff2:fgui.Transition;
    private _colorFilter:fgui.Transition;
    private _recordWaitEff:fgui.GGroup;
    private _IsInWait:boolean = true;

    //标题
    private _titleTxt:fgui.GTextField;
    //描述
    // private _descriptTxt:fgui.GTextField;
    //记录Tex
    private _Tex:cc.RenderTexture = null;

    //记录初始值
    private _recordX:number = -1;
    private _recordY:number = -1;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._sprite = this.getChild("n0").asLoader;
        this._shareBtn = this.getChild("n1").asLoader;
        this._againBtn = this.getChild("n2").asLoader;
        this._titleTxt = this.getChild("n4").asTextField;
        // this._descriptTxt = this.getChild("n3").asTextField;
        this._WaitEff = this.getTransition("t4");
        this._WaitEff2 = this.getTransition("t3");
        this._colorFilter = this.getTransition("t5");
        this._recordWaitEff = this.getChild("n9").asGroup;
        this._shareToFriend = this.getChild("n13").asLoader;
        this._againBtn.onClick(this.AgainTest,this);
        this._shareBtn.onClick(this.ShareThisSprite,this);
        this._sprite.onClick(this.ShareThisSprite,this);
        this._shareToFriend.onClick(this.ShareToFriend,this);
    }

    //初始化设置标题，描述以及显示的图片
    public InitCom(_title:string,_width:number,_height:number):void{
        this._titleTxt.text = _title;
        // this._descriptTxt.text = _descript;
        let maxWidth = fgui.GRoot.inst.width;
        let newHeight = maxWidth*(_height/_width);
        this._sprite.texture = null;
        this._sprite.setPivot(0,0);
        this._sprite.setScale(1,1);
        this._sprite.rotation = 0;
        this._sprite.setSize(maxWidth,newHeight);
        this._sprite.url = "ui://Chat/waitEffImg"
        this._colorFilter.play(null,-1);
        //控制显示等待时间,播放动画
        this._IsInWait = true;
        this._recordWaitEff.visible = true;
        this._WaitEff.play(()=>{
            this._WaitEff2.play(null,-1);
        });
    }

    //计算出合适的宽高并返回
    public CountSuitableSize(_width:number,_height:number):cc.Vec2{
        let maxWidth = 645;
        let maxHeight = 775;

        let isFind = false;
        let newSize = new cc.Vec2(0,0);
        for(let i = 525;i <= maxWidth;i++){
            newSize.x = i;
            newSize.y = (newSize.x/_width)*_height;
            if(newSize.y <= maxHeight){
                isFind = true;
                break;
            }
        }
        if(isFind == false){
            for(let i = 700;i <= maxHeight;i++){
                newSize.y = i;
                newSize.x = (newSize.y/_height)*_width;
                if(newSize.x <= maxWidth){
                    break;
                }
            }   
        }
        return newSize;
    }

    //加载图片到loader上
    public SetShowIcon(_tex: cc.RenderTexture): void {
        this._Tex = _tex;
        let _texture = new cc.SpriteFrame(_tex);
        // _texture.setRotated(true);
        this._sprite.url = null;
        this._colorFilter.stop(true,false);
        this._sprite.texture = _texture;
        this._sprite.setPivot(0.5,0.5);
        this._sprite.setScale(-1,1);
        this._sprite.rotation = 180;
        this._WaitEff.stop(true,false);
        this._WaitEff2.stop(true,false);
        this._recordWaitEff.visible = false;
        this._IsInWait = false;
    }


    //关闭界面
    public CloseSelf():void{
        this._sprite.texture = null;
        this._recordX = -1;
        this._recordY = -1;
    }

    //再测一次
    public AgainTest():void{
        this.CloseSelf();
        EventManager.DispatchEvent(EventEnum.ReqAgainTest);
    }

    //分享图片给空间
    public ShareThisSprite():void{
        if(this._IsInWait){
            return;
        }
        let base64 = Tools.GetBase64ByTexture(this._Tex);
        this.RecordServerShare();
        // SDKManager.GetInstance().SendMessageToFrends(base64,"标题");
        let _shareData:any = SDKManager.GetInstance().GetShareData();
        SDKManager.GetInstance().StartShareCall("Quiz Chat",base64,()=>{console.log("分享结束")},this,_shareData);
    }

    //分享图片给好友
    public ShareToFriend():void{
        if(this._IsInWait){
            return;
        }
        let base64 = Tools.GetBase64ByTexture(this._Tex);
        this.RecordServerShare();
        let _shareData:any = SDKManager.GetInstance().GetShareData();
        SDKManager.GetInstance().SendMessageToFrends(base64,"Quiz Chat",_shareData);
    }

    //保存类别ID
    public SetCategoryID(_id:string){
        this._recordId = _id;
    }

    //向服务器通知进行分享
    public RecordServerShare():void{
        let reqData:object = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        reqData["CategoryContentID"] = this._recordId;
        let url = "";
        if(ConfigMgr.IsTest){
            url = "/quce_test_server/user/Share";
        }
        else{
            url = "/quce_server/user/Share";
        }
        MessageManager.GetInstance().SendMessage(reqData,url,this,()=>{console.log("成功!")});
    }
}