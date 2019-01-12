import EventManager from '../Base/EventManager';
import{EventEnum,EventFunc,EventDataTwo} from '../Base/EventEnum';
export default class FullScreenChoosePrefab extends fgui.GComponent{
    private _questionTxt:fgui.GTextField;
    private _questionList:fgui.GList;
    private _isCanClick:boolean = false;
    private _dataList:Array<any>;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._questionTxt = this.getChild("n1").asTextField;
        this._questionList = this.getChild("n0").asList;
        this._questionList.itemRenderer = this.RenderListCall.bind(this);
        this._questionList.on(fgui.Event.CLICK_ITEM,this.ClickCall,this);
    }

    public SetQuestion(str:string):void{
        if(!str){
            console.log("传入字符串错误",str);
        }
        this._questionTxt.text = str;
    }

    public SetQuestionList(data:any):void{
        this._questionList.numItems = 0;
        this._isCanClick = true;
        this._dataList = data;
        for(let i = 0;i < this._dataList.length;i++){
            this._questionList.numItems += 1;
        }
        this._questionList.resizeToFit(this._dataList.length);
    }

    public RenderListCall(idx:number,obj:fgui.GButton):void{
        obj.getController("btn").selectedIndex = 0;
        obj.getChild("n6").text = this._dataList[idx].DescriptionText;
        // this._questionList.height = (obj.height + this._questionList.lineGap)*(idx+1);
    }

    public ClickCall(obj:fgui.GButton):void{
        if(this._isCanClick){
            this._isCanClick = false;
            //触发事件                                                                                                                                                                                                                                                                                                                                                                                    
            let idx:number = this._questionList.getChildIndex(obj);
            let data:EventDataTwo<number,string> = <EventDataTwo<number,string>>{};
            data.param = idx;
            data.param2 = this._dataList[idx].DescriptionText;
            EventManager.DispatchEvent(EventEnum.ChooseSome,data);
            obj.getController("btn").selectedIndex = 1;
        }
    }
}
