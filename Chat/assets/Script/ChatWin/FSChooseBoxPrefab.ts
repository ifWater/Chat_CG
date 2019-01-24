import EventManager from "../Base/EventManager";
import { EventEnum,EventDataOne,EventDataTwo } from "../Base/EventEnum";

export default class FSChooseBoxPrefab extends fgui.GComponent{
    private _descriptTxt:fgui.GTextField;
    private _chooseTxt:fgui.GTextField;
    private _chooseBtn:fgui.GLoader;
    private _SendBtn:fgui.GLoader;
    private _titleTxt:fgui.GRichTextField;


    //记录显示在按钮上面的文本
    private _recordWillSendTxt:string = "";
    //记录将要发送的选项序号
    private _recordWillSendIdx:number = 0;
    //记录将要发送的选项数据
    private _recordWillSendData:string = "";
    //记录服务器下发的选项
    private _recordListData:any;
    //记录是否可以点击
    private isCanClick:boolean = true;
    //记录是否可弹出
    private isCanOpen:boolean = true;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._descriptTxt = this.getChild("n10").asTextField;
        this._chooseTxt = this.getChild("n15").asTextField;
        this._chooseBtn = this.getChild("n13").asLoader;
        this._SendBtn = this.getChild("n4").asLoader;
        this._titleTxt = this.getChild("n16").asRichTextField;
        this._chooseBtn.onClick(this.ClickChooseBtnCall,this);
        this._SendBtn.onClick(this.SendTxtCall,this);
    }


    //点击按钮，弹出选项列表
    public ClickChooseBtnCall():void{
        if(this.isCanOpen){
            let data:EventDataOne<FSChooseBoxPrefab> = {} as EventDataOne<FSChooseBoxPrefab>;
            data.param = this;
            EventManager.DispatchEvent(EventEnum.OpenChooseBox,data);
        }
        this.isCanOpen = false;
    }

    public SetDescriptTxt(_str:string):void{
        this.isCanClick = true;
        this._descriptTxt.text = _str;
    }

    public SetQuestionData(data:any){
        this._recordListData = data;
        this._chooseTxt.text = this._recordListData[0].DescriptionText;
        this._recordWillSendTxt = this._recordListData[0].DescriptionText;
    }

    //获取记录的服务器下发数据
    public GetServerData():any{
        return this._recordListData;
    }

    //发送选中的选项
    public SendTxtCall():void{
        if(!this.isCanClick){
            return;
        }
        this.isCanClick = false;
        let data:EventDataTwo<number,string> = <EventDataTwo<number,string>>{};
        data.param = this._recordWillSendIdx;
        data.param2 = this._recordWillSendData;
        EventManager.DispatchEvent(EventEnum.ChooseSome,data);
    }

    //设置当前的选项数据
    public SetNowChooseData(_idx:number,_txt:string):void{
        this._chooseTxt.text = _txt
        this._recordWillSendTxt = _txt;
        this._recordWillSendIdx = _idx;
        this._recordWillSendData = _txt;
    }
    
    //重置当前点击
    public ResetNowClick():void{
        this.isCanOpen = true;
    }

    //设置测试大纲
    public SetQuestionAllTxt(_txt:string):void{
        this._titleTxt.text = _txt;
    }
}