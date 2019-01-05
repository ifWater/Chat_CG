import BaseWindow from '../Base/BaseWindow';
import Tools from '../Base/Tools';

export default class EndWnd extends BaseWindow{
    private _bgSprite:fgui.GLoader;
    private _view:fgui.GComponent;
    private _recordNewObj:Array<fgui.GObject> = [];

    OnLoadToExtension(){

    }

    OnCreate(){
        this._view = this.GetView();
        this._bgSprite = this._view.getChild("n1").asLoader;
    }

    OnOpen(param:any){
        this._recordNewObj = [];
        this._bgSprite.url = param.BgURL;
        this._view.node.group = "CullMask";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        for(let i = 0;i < param.DrawOrder;i++){
            if(param.DrawOrder[i].Type == "result_text"){
                let newTxt:fgui.GTextField = new fgui.GTextField();
                this._view.addChild(newTxt);                
                this._recordNewObj.push(newTxt);
                let hight:number = parseFloat(param.DrawOrder[i].Height);
                let width:number = parseFloat(param.DrawOrder[i].Width);
                let posX:number = parseFloat(param.DrawOrder[i].X);
                let posY:number = parseFloat(param.DrawOrder[i].Y);
                newTxt.setSize(width,hight);
                newTxt.setPosition(posX,posY);
                newTxt.text = param.DrawOrder[i].Text;
                newTxt.fontSize = parseFloat(param.DrawOrder[i].FontSize);
            }
            else if(param.DrawOrder[i].Type == "result_image"){
                let newLoader:fgui.GLoader = new fgui.GLoader();
                this._view.addChild(newLoader);
                this._recordNewObj.push(newLoader);
                let height:number = parseFloat(param.DrawOrder[i].Height);
                let width:number = parseFloat(param.DrawOrder[i].Width);
                let posX:number = parseFloat(param.DrawOrder[i].X);
                let posY:number = parseFloat(param.DrawOrder[i].Y);
                newLoader.setSize(width,height);
                newLoader.url = param.DrawOrder[i].URL;
                newLoader.setPosition(posX,posY);
            }
            else{
                console.log("类型错误!",param.DrawOrder[i]);
            }
        }

        let _tex:cc.RenderTexture = Tools.GetWHTexture(-3,this._view.width,this._view.height);
    }

    OnClose(){
        for(let i = 0;i < this._recordNewObj.length;i++){
            this._view.removeChild(this._recordNewObj[i]);
            this._recordNewObj[i].dispose();
        }
    }
}