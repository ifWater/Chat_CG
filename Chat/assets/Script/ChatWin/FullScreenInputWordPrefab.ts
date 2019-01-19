import EventManager from "../Base/EventManager";
import { EventEnum, EventDataOne } from "../Base/EventEnum";
import SDKManager from "../Base/SDKManager";
import ConfigMgr from "../Base/ConfigMgr";

export default class FullScreenInputWordPrefab extends fgui.GComponent{
    private _FullInputTxt:fgui.GTextInput;
    private _FullSendBtn:fgui.GLoader;
    private _Eff:fgui.Transition;
    private _IsPlay:boolean;

    // private _txtLast:fgui.GTextField;
    // private _txtBg:fgui.GImage;
    private _txt:fgui.GTextField;

    private _titleTxt:fgui.GTextField;

    //记录将要输出的文本
    private _recordWillSendTxt:string;
    

    public constructor(){
        super();
    }

    protected onConstruct(): void{
        this._FullInputTxt = this.getChild("n3").asTextInput;
        this._FullSendBtn = this.getChild("n4").asLoader;
        this._Eff = this.getTransition("t0");
        this._titleTxt = this.getChild("n11").asTextField;
        // this._txtLast = this.getChild("n8").asTextField;
        // this._txtBg = this.getChild("n2").asImage;
        this._txt = this.getChild("n10").asTextField;
        this._FullSendBtn.onClick(this.SendTxtCall,this);
        this._FullInputTxt.on(fgui.Event.TEXT_CHANGE,this.InputTxtChangeCall,this);
    }

    public SetTxt(str:string):void{
        this._IsPlay = false;
        if(!str){
            this._txt.text = "";
            this._FullInputTxt.text = "";
            this._recordWillSendTxt = "";
            console.log("传入字符串错误",str);
            return;
        }
        // let strLength:number = str.length;
        // if(strLength < 50){
        //     this._txtBg.visible = false;
        //     this._txt.visible = false;
        //     this._txtLast.visible = true;
        //     this._txtLast.text = str;
        // }
        // else{
        //     this._txtBg.visible = true;
        //     this._txt.visible = true;
        //     this._txtLast.visible = false;
        //     this._txt.text = str;
        // }
        this._txt.text = str;
        this._FullInputTxt.text = SDKManager.GetInstance().GetPlayerName();
        this._recordWillSendTxt = this._FullInputTxt.text;
        ConfigMgr.GetInstance().SetRecordInput(this._FullInputTxt.text);
        // ConfigMgr.GetInstance().SetRecordInput(this._FullInputTxt.text);
    }

    //输入文本的改变
    public InputTxtChangeCall():void{
        this._recordWillSendTxt = this._FullInputTxt.text;
    }

    //设置文本大纲
    public SetQuestionAllTxt(_txt:string):void{
        this._titleTxt.text = _txt;
    }

    public SendTxtCall():void{
        let data:EventDataOne<string> = {} as EventDataOne<string>;
        if(this._recordWillSendTxt == "" || this._recordWillSendTxt == undefined){
            if(this._IsPlay == false){
                this._IsPlay = true;
                this._Eff.play(()=>{this._IsPlay = false;});
            }
        }
        data.param = this._recordWillSendTxt;
        EventManager.DispatchEvent(EventEnum.FSInputTo,data);
    }
}