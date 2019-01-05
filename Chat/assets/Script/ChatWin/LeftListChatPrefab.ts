import EventManager from '../Base/EventManager';
import{EventEnum,EventFunc,EventDataTwo} from '../Base/EventEnum';
export default class LeftListChatPrefab extends fgui.GComponent{
    private _headIcon:fgui.GLoader;
    private _questionTxt:fgui.GTextField;
    private _questionList:fgui.GList;
    private _isCanClick:boolean = false;
    private _dataList:Array<any>;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._headIcon = this.getChild("n4").asCom.getChild("n0").asLoader;
        this._questionTxt = this.getChild("n2").asTextField;
        this._questionList = this.getChild("n1").asList;
        this._questionList.itemRenderer = this.RenderListCall.bind(this);
        this._questionList.on(fgui.Event.CLICK_ITEM,this.ClickCall,this);
    }

    public SetHeadIcon(url:string):void{
        if(!url){
            console.log("传入图片url错误",url);
            return;
        }
        this._headIcon.url = url;
    }

    public SetQuestion(str:string):void{
        if(!str){
            console.log("传入字符串错误",str);
        }
        this._questionTxt.text = str;
    }

    public SetQuestionList(data:any):void{
        this._isCanClick = true;
        this._dataList = data;
        for(let i = 0;i < this._dataList.length;i++){
            this._questionList.numItems += 1;
        }
    }

    public RenderListCall(idx:number,obj:fgui.GButton):void{
        obj.getChild("n6").text = this._dataList[idx].DescriptionText;
    }

    public ClickCall(obj:fgui.GButton):void{
        if(this._isCanClick){
            this._isCanClick = false;
            //触发事件                                                                                                                                                                                                                                                                                                                                                                                    
            let idx:number = this._questionList.getChildIndex(obj);
            let data:EventDataTwo<string,string> = <EventDataTwo<string,string>>{};
            data.param = this._dataList[idx].ChoiceIdentify;
            data.param2 = this._dataList[idx].DescriptionText;
            EventManager.DispatchEvent(EventEnum.ChooseSome,data);
            obj.getController("btn").selectedIndex = 1;
        }
    }
}
