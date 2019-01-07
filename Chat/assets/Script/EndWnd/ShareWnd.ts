import BaseWindow from '../Base/BaseWindow'
import WindowManager from '../Base/WindowManager';
import EventManager from '../Base/EventManager';
import { EventEnum } from '../Base/EventEnum';
import Tools from '../Base/Tools';
import FaceBookSDK from '../Base/FaceBookSDK';

export default class ShareWnd extends BaseWindow{
    private _returnBgBtn:fgui.GLoader;
    private _againBtn:fgui.GLoader;
    private _shareBtn:fgui.GLoader;
    private _sprite:fgui.GLoader;
    private _view:fgui.GComponent;

    //记录Tex
    private _Tex:cc.RenderTexture = null;

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
    }

    OnOpen(param:any){
        if(param){
            this._Tex = param.Tex;
            this.SetShowIcon(param.Tex,param.Height,param.Width);
        }
        else{
            console.log("传入数据为空！");
        }

    }
    
    OnClose(){
        
    }
    
    //加载图片到loader上
    public SetShowIcon(_tex: cc.RenderTexture, _height: number, _width: number): void {
        this._sprite.texture = new cc.SpriteFrame(_tex);
        this._sprite.height = _height;
        this._sprite.width = _width;
        this._sprite.setPivot(0.5,0.5);
        this._sprite.setScale(-1,1);
        this._sprite.rotation = 180;
    }

    //关闭界面
    public CloseSelf():void{
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
        console.log(base64);
        FaceBookSDK.GetInstance().Share(base64,"",()=>{});
    }
}