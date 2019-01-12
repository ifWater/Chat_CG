import BaseWindow from '../Base/BaseWindow'
import WindowManager from '../Base/WindowManager';
import EventManager from '../Base/EventManager';
import { EventEnum } from '../Base/EventEnum';
import Tools from '../Base/Tools';
import FaceBookSDK from '../Base/FaceBookSDK';
import SDKManager from '../Base/SDKManager';
import DelayTimeManager from '../Base/DelayTimeManager';

export default class ShareWnd extends BaseWindow{
    private _returnBgBtn:fgui.GLoader;
    private _againBtn:fgui.GLoader;
    private _shareBtn:fgui.GLoader;
    private _sprite:fgui.GLoader;
    private _view:fgui.GComponent;

    //记录Tex
    private _Tex:cc.RenderTexture = null;

    //记录初始值
    private _recordX:number = -1;
    private _recordY:number = -1;

    OnLoadToExtension(){

    }

    OnCreate(){
        this._view = this.GetView();
        this._returnBgBtn = this._view.getChild("n1").asLoader;
        this._againBtn = this._view.getChild("n3").asLoader;
        this._shareBtn = this._view.getChild("n2").asLoader;
        this._sprite = this._view.getChild("n0").asLoader;
        this._returnBgBtn.onClick(this.CloseSelf,this);
        this._againBtn.onClick(this.AgainTest,this);
        this._shareBtn.onClick(this.ShareThisSprite,this);
        // this._view.onClick(this.ShareThisSprite,this);
    }

    OnOpen(param:any){
        if(param){
            this._Tex = param.Tex;
            // this._sprite.url = "https://cutepard.com/quce_server/static/soul/llo.png";
            this.SetShowIcon(param.Tex,param.Height,param.Width);
        }
        else{
            console.log("传入数据为空！");
        }

    }
    
    OnClose(){
        this._sprite.texture = null;
    }

    //计算出合适的宽高并返回
    public CountSuitableSize(_width:number,_height:number):cc.Vec2{
        let maxWidth = 645;
        let maxHeight = 860;

        let newSize = new cc.Vec2(0,0);
        for(let i = 525;i <= maxWidth;i++){
            newSize.x = i;
            newSize.y = (newSize.x/_width)*_height;
            if(newSize.y <= maxHeight){
                break;
            }
        }
        return newSize;
    }

    //加载图片到loader上
    public SetShowIcon(_tex: cc.RenderTexture, _height: number, _width: number): void {
        this._sprite.texture = new cc.SpriteFrame(_tex);
        this._sprite.setPivot(0.5,0.5);
        this._sprite.setScale(-1,1);
        let size:cc.Vec2 = this.CountSuitableSize(_width,_height);
        this._sprite.setSize(size.x,size.y);
        console.log("====>",size);
        console.log("->",this._view.width,this._view.height)
        if(this._recordX == -1){
            this._recordX = this._view.width/2 - size.x/2;
            this._recordY = this._view.height/2 - size.y/2 - 100;
        }
        this._sprite.rotation = 180;
        this._sprite.setPosition(this._recordX,this._recordY);
    }


    //关闭界面
    public CloseSelf():void{
        this._sprite.texture = null;
        // this._sprite.setPivot(0.5,0.5);
        // this._sprite.setScale(1,1);
        // this._sprite.rotation = 0;
        this._recordX = -1;
        this._recordY = -1;
        WindowManager.GetInstance().CloseWindow<ShareWnd>("ShareWnd",this,ShareWnd);
    }

    //再测一次
    public AgainTest():void{
        this.CloseSelf();
        EventManager.DispatchEvent(EventEnum.ReqAgainTest);
    }

    //分享图片
    public ShareThisSprite():void{
        let base64 = Tools.GetBase64ByTexture(this._Tex);
        // console.log(base64);
        SDKManager.GetInstance().SendMessageToFrends(base64);
        // SDKManager.GetInstance().StartShareCall(base64,"",()=>{console.log("分享结束")},this);
    }
}