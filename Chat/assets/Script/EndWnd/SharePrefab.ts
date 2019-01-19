import SDKManager from '../Base/SDKManager';
import EventManager from '../Base/EventManager';
import { EventEnum } from '../Base/EventEnum';
import Tools from '../Base/Tools';
import WindowManager from '../Base/WindowManager';
import ShareWnd from './ShareWnd';
import BaseWindow from '../Base/BaseWindow';
import MessageManager from '../Base/MessageManager';

export default class SharePrefab extends fgui.GComponent{
    private _againBtn:fgui.GLoader;
    private _shareBtn:fgui.GLoader;
    private _sprite:fgui.GLoader;
    private _recordId:string;

    //记录Tex
    private _Tex:cc.RenderTexture = null;

    //记录初始值
    private _recordX:number = -1;
    private _recordY:number = -1;

    //记录窗口
    private _openWnd:BaseWindow;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._sprite = this.getChild("n0").asLoader;
        this._shareBtn = this.getChild("n1").asLoader;
        this._againBtn = this.getChild("n2").asLoader;
        this._againBtn.onClick(this.AgainTest,this);
        this._shareBtn.onClick(this.ShareThisSprite,this);
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
    public SetShowIcon(_tex: cc.RenderTexture, _height: number, _width: number): void {
        this._Tex = _tex;
        this._sprite.texture = new cc.SpriteFrame(_tex);
        this._sprite.setPivot(0.5,0.5);
        this._sprite.setScale(-1,1);
        let size:cc.Vec2 = this.CountSuitableSize(_width,_height);
        this._sprite.setSize(size.x,size.y);
        if(this._recordX == -1){
            this._recordX = this.width/2 - size.x/2;
            this._recordY = this.height/2 - size.y/2 - 170;
        }
        this._sprite.rotation = 180;
        this._sprite.setPosition(this._recordX,this._recordY);
    }


    //关闭界面
    public CloseSelf():void{
        this._sprite.texture = null;
        this._recordX = -1;
        this._recordY = -1;
        WindowManager.GetInstance().CloseWindow<ShareWnd>("ShareWnd",this._openWnd,ShareWnd);
    }

    //设置窗口对象
    public SetWndObj(obj:BaseWindow):void{
        this._openWnd = obj;
    }

    //再测一次
    public AgainTest():void{
        this.CloseSelf();
        EventManager.DispatchEvent(EventEnum.ReqAgainTest);
    }

    public Close():void{
        this._sprite.texture = null;
        this._recordX = -1;
        this._recordY = -1;
    }

    //分享图片
    public ShareThisSprite():void{
        let base64 = Tools.GetBase64ByTexture(this._Tex);
        this.RecordServerShare();
        // SDKManager.GetInstance().SendMessageToFrends(base64,"标题");
        SDKManager.GetInstance().StartShareCall("Quiz Chat",base64,()=>{console.log("分享结束")},this);
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
        let url = "/quce_server/user/Share";
        MessageManager.GetInstance().SendMessage(reqData,url,this,()=>{console.log("成功!")});
    }
}