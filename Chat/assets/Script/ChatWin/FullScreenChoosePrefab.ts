import EventManager from '../Base/EventManager';
import{EventEnum,EventFunc,EventDataTwo} from '../Base/EventEnum';
export default class FullScreenChoosePrefab extends fgui.GComponent{
    private _questionList:fgui.GList;
    // private _textBg:fgui.GImage;
    private _textMore:fgui.GTextField;
    // private _textLast:fgui.GTextField;

    private _isCanClick:boolean = false;
    private _dataList:Array<any>;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        // fgui.UIObjectFactory.setExtension("ui://Package1/viewBtn",ViewBtn);
        // this._textLast = this.getChild("n1").asTextField;
        this._questionList = this.getChild("n0").asList;
        // this._textBg = this.getChild("n2").asImage;
        this._textMore = this.getChild("n3").asTextField;
        
        this._questionList.itemRenderer = this.RenderListCall.bind(this);
        this._questionList.itemProvider = this.ReturnBtnPrefab.bind(this);
        this._questionList.on(fgui.Event.CLICK_ITEM,this.ClickCall,this);
    }

    public SetQuestion(str:string):void{
        if(!str){
            console.log("传入字符串错误",str);
        }
        // let strLength:number = str.length;
        // if(strLength < 50){
        //     this._textBg.visible = false;
        //     this._textMore.visible = false;
        //     this._textLast.visible = true;
        //     this._textLast.text = str;
        // }
        // else{
        //     this._textBg.visible = true;
        //     this._textMore.visible = true;
        //     this._textLast.visible = false;
        // }
        this._textMore.text = str;
    }

    public SetQuestionList(data:any):void{
        this._questionList.numItems = 0;
        this._isCanClick = true;
        this._dataList = data;
        this._questionList.numItems = this._dataList.length;// >= 4 ?this._dataList.length:4;
        // this._questionList.resizeToFit(this._dataList.length);
    }

    public RenderListCall(idx:number,obj:fgui.GButton):void{
        if(idx < this._dataList.length){
            obj.getController("btn").selectedIndex = 0;
            obj.getChild("n2").text = this._dataList[idx].DescriptionText;
            // obj.getChild("n3").text = String.fromCharCode(idx + 65);
        }
        else{
            obj.getController("btn").selectedIndex = 2;
        }
    }

    public ClickCall(obj:fgui.GButton):void{
        if(this._isCanClick){
            if(obj.getController("btn").selectedIndex == 2){
                return;
            }
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

    public ReturnBtnPrefab(idx:number):string{
        return "ui://Chat/FSBtnBig";

        if(this._dataList.length > 4){
            return "ui://Chat/FSBtnLit";
        }
        else{
            return "ui://Chat/FSBtnBig";
        }
    }
}
