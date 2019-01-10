import BaseWindow from '../Base/BaseWindow';
import Tools from '../Base/Tools';
import ConfigMgr from '../Base/ConfigMgr';
import { EventEnum, EventDataThird } from '../Base/EventEnum';
import EventManager from '../Base/EventManager';
import DelayTimeManager from '../Base/DelayTimeManager';
import WindowManager from '../Base/WindowManager';
import FaceBookSDK from '../Base/FaceBookSDK';
import SDKManager from '../Base/SDKManager';

export default class EndWnd extends BaseWindow{
    private _bgSprite:fgui.GLoader;
    private _view:fgui.GComponent;
    private _recordNewObj:Array<fgui.GObject> = [];

    private _bgHeight:string;
    private _bgWidth:string;

    private loadImageReCount:number = 0;

    OnLoadToExtension(){
        this.SetWndLayer(4);
    }

    OnCreate(){
        this._view = this.GetView();
        this._bgSprite = this._view.getChild("n4").asLoader;
    }

    OnOpen(param: any) {
        // console.log(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height)
        // console.log(this._view.width, this._view.height)
        // this._bgSprite.setSize(734,925);
        this._view.setSize(parseFloat(param.BgWidth),parseFloat(param.BgHeight));
        // this._view.setPosition(0,0);
        this._view.setPosition(cc.view.getVisibleSize().width/2, cc.view.getVisibleSize().height/2);
        this._recordNewObj = [];0 
        if(param.DrawOrder){
            for (let i = 0; i < param.DrawOrder.length; i++){
                if(param.DrawOrder[i].Type == "result_text"){
                    let newTxt:fgui.GTextField = new fgui.GTextField();
                    newTxt.node.group = "CullMask";
                    this._view.addChild(newTxt);                
                    this._recordNewObj.push(newTxt);
                    let hight: number = parseFloat(param.DrawOrder[i].Object.Height);
                    let width: number = parseFloat(param.DrawOrder[i].Object.Width);
                    let posX: number = parseFloat(param.DrawOrder[i].Object.X);
                    let posY: number = parseFloat(param.DrawOrder[i].Object.Y);
                    // newTxt.setSize(width,hight);
                    newTxt.fontSize = param.DrawOrder[i].Object.FontSize;
                    newTxt.setPosition(posX,posY);
                    if(param.DrawOrder[i].Object.IsSelf == 1){
                        newTxt.text = ConfigMgr.GetInstance().GetRecordInput();
                    }
                    else if(param.DrawOrder[i].Object.IsSelf == 2){
                        newTxt.setPivot(0.5,0.5);
                        newTxt.text = ConfigMgr.GetInstance().GetRecordInput() + " " + param.DrawOrder[i].Object.Text;
                    }
                    else{
                        newTxt.text = param.DrawOrder[i].Object.Text;
                    }
                    newTxt.fontSize = parseFloat(param.DrawOrder[i].Object.FontSize);
                }
                else if(param.DrawOrder[i].Type == "result_image"){
                    let newLoader:fgui.GLoader = new fgui.GLoader();
                    newLoader.node.group = "CullMask";
                    this._recordNewObj.push(newLoader);
                    let height: number = parseFloat(param.DrawOrder[i].Object.Height);
                    let width: number = parseFloat(param.DrawOrder[i].Object.Width);
                    let posX: number = parseFloat(param.DrawOrder[i].Object.X);
                    let posY: number = parseFloat(param.DrawOrder[i].Object.Y);
                    // console.log(height, width, posX, posY)
                    // console.log(newLoader)
                    // newLoader.setSize(665, 723);
                    let url = "";
                    if(param.DrawOrder[i].Object.IsSelf == 1){
                        url = SDKManager.GetInstance().GetPlayerIcon();
                    }
                    else{
                        url = ConfigMgr.ServerIP + param.DrawOrder[i].Object.URL;
                    }
                    // newLoader.url = FaceBookSDK.GetInstance().GetPlayerIcon();;
                    this.loadImageReCount += 1;        
                    Tools.ChangeURL(url,newLoader,EventEnum.ImageLoadOver);
                    // newLoader.url = ConfigMgr.ServerIP + param.DrawOrder[i].Object.URL;
                    newLoader.setPosition(posX,posY);
                    newLoader.fill = 4;
                    newLoader.setSize(width, height);
                    // this._view.addChild(newLoader);
                    this._view.addChildAt(newLoader,0);
                }
                else{
                    console.log("类型错误!",param.DrawOrder[i]);
                }
            }
        }
        this.loadImageReCount += 1;
        Tools.ChangeURL(ConfigMgr.ServerIP + param.BgURL,this._bgSprite,EventEnum.ImageLoadOver);
        this._bgSprite.setSize(parseFloat(param.BgWidth),parseFloat(param.BgHeight));
        this._bgSprite.setPosition(0,0);
        this.SetCullMask("CullMask");
        this._bgWidth = param.BgWidth;
        this._bgHeight = param.BgHeight;
        EventManager.AddEventListener(EventEnum.ImageLoadOver,this.WaitImageLoadOver,this);
        // DelayTimeManager.AddDelayOnce(5,this.ShotScreen,this);
    }
    
    OnClose(){
        for(let i = 0;i < this._recordNewObj.length;i++){
            this._view.removeChild(this._recordNewObj[i]);
            this._recordNewObj[i].dispose();
        }
        this._bgSprite.texture = null;
        this.loadImageReCount = 0;
        EventManager.RemoveEventListener(EventEnum.ImageLoadOver,this.WaitImageLoadOver,this);
    }

    public WaitImageLoadOver():void{
        this.loadImageReCount -= 1;
        if(this.loadImageReCount == 0){
            this.ShotScreen();
            // DelayTimeManager.AddDelayOnce(0.5,this.ShotScreen,this);
        }
    }
    
    public ShotScreen():void{
        let _tex: cc.RenderTexture = Tools.GetWHTexture(-2, this._view.width, this._view.height);
        let data: EventDataThird<cc.RenderTexture,number,number> = {} as EventDataThird<cc.RenderTexture,number,number>;
        data.param = _tex;
        data.param2 = parseFloat(this._bgWidth);
        data.param3 = parseFloat(this._bgHeight);
        // console.log(Tools.GetBase64ByTexture(_tex));
        WindowManager.GetInstance().CloseWindow<EndWnd>("EndWnd",this,EndWnd);
        EventManager.DispatchEvent(EventEnum.ScreenShotOver,data);
    }
}