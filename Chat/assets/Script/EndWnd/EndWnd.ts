import BaseWindow from '../Base/BaseWindow';
import Tools from '../Base/Tools';
import ConfigMgr from '../Base/ConfigMgr';
import { EventEnum, EventDataThird } from '../Base/EventEnum';
import EventManager from '../Base/EventManager';
import DelayTimeManager from '../Base/DelayTimeManager';

export default class EndWnd extends BaseWindow{
    private _bgSprite:fgui.GLoader;
    private _view:fgui.GComponent;
    private _recordNewObj:Array<fgui.GObject> = [];

    private _bgHeight:string;
    private _bgWidth:string;

    OnLoadToExtension(){

    }

    OnCreate(){
        this._view = this.GetView();
        this._bgSprite = this._view.getChild("n1").asLoader;
    }

    OnOpen(param: any) {
        console.log(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height)
        console.log(this._view.width, this._view.height)
        this._bgSprite.setSize(parseFloat(param.BgWidth),parseFloat(param.BgHeight));
        this._view.setPosition(cc.view.getVisibleSize().width/2, cc.view.getVisibleSize().height/2);
        this._recordNewObj = [];
        this._bgSprite.url = ConfigMgr.ServerIP + param.BgURL;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        this.SetCullMask("CullMask");
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
                    newTxt.setSize(width,hight);
                    newTxt.setPosition(posX,posY);
                    newTxt.text = param.DrawOrder[i].Text;
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
                    console.log(height, width, posX, posY)
                    newLoader.setSize(width, height);
                    newLoader.url = ConfigMgr.ServerIP + param.DrawOrder[i].Object.URL;
                    newLoader.setPosition(posX,posY);
                    this._view.addChild(newLoader);
                }
                else{
                    console.log("类型错误!",param.DrawOrder[i]);
                }
            }
        }
        this._bgHeight = param.BgWidth;
        this._bgWidth = param.BgHeight;
        DelayTimeManager.AddDelayOnce(0.5,this.ShotScreen,this);
    }
    
    OnClose(){
        for(let i = 0;i < this._recordNewObj.length;i++){
            this._view.removeChild(this._recordNewObj[i]);
            this._recordNewObj[i].dispose();
        }
    }
    
    public ShotScreen():void{
        let _tex: cc.RenderTexture = Tools.GetWHTexture(-2, this._view.width, this._view.height);
        let data: EventDataThird<cc.RenderTexture,number,number> = {} as EventDataThird<cc.RenderTexture,number,number>;
        data.param = _tex;
        data.param2 = parseFloat(this._bgWidth);
        data.param3 = parseFloat(this._bgHeight);
        // console.log(Tools.GetBase64ByTexture(_tex));
        EventManager.DispatchEvent(EventEnum.ScreenShotOver,data);
    }
}