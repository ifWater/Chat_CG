import EventManager from "../Base/EventManager";
import { EventEnum } from "../Base/EventEnum";

export default class FullScreenWordPrefab extends fgui.GComponent{
    private _txt:fgui.GTextField;
    private _nextBtn:fgui.GLoader;
    private _recordIsClick:boolean = false;

    // private _txtBg:fgui.GImage;
    // private _txtLast:fgui.GTextField;

    public constructor(){
        super();
    }

    protected onConstruct(): void{
        this._txt = this.getChild("n0").asTextField;
        this._nextBtn = this.getChild("n1").asLoader;
        this._nextBtn.onClick(this.ClickCall,this);
        // this._txtBg = this.getChild("n2").asImage;
        // this._txtLast = this.getChild("n3").asTextField;
    }

    public SetTxt(str:string):void{
        if(!str){
            console.log("传入字符串错误",str);
            return;
        }
        let strLength:number = str.length;
        if(strLength < 200){
            //28
            // this._txtBg.visible = false;
            // this._txt.visible = false;
            // this._txtLast.visible = true;
            // this._txtLast.text = str;
        }
        else{
            // this._txtBg.visible = true;
            // this._txt.visible = true;
            // this._txtLast.visible = false;
            // this._txt.text = str;
        }
        this._recordIsClick = false;
        this._txt.text = str;
    }

    public ClickCall():void{
        if(this._recordIsClick){
            return;
        }
        this._recordIsClick = true;
        EventManager.DispatchEvent(EventEnum.ReqNextData);
    }
}