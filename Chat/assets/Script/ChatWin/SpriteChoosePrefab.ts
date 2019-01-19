import Tools from "../Base/Tools";
import ConfigMgr from "../Base/ConfigMgr";
import EventManager from "../Base/EventManager";
import{EventEnum,EventDataTwo} from '../Base/EventEnum';

export default class SpriteChoosePrefab extends fgui.GComponent{
    private _headIcon:fgui.GLoader;
    private _questionSprite:fgui.GLoader;
    private _questionList:fgui.GList;
    private _isCanClick:boolean = false;
    private _dataList:Array<any>;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._headIcon = this.getChild("n4").asCom.getChild("n0").asLoader;
        this._questionSprite = this.getChild("n2").asLoader;
        this._questionList = this.getChild("n1").asList;
        this._questionList.itemRenderer = this.RenderListCall.bind(this);
        this._questionList.on(fgui.Event.CLICK_ITEM,this.ClickCall,this);
    }

    public SetHeadIcon(url:string):void{
        if(!url){
            console.log("传入图片url错误",url);
            return;
        }
        Tools.ChangeURL(ConfigMgr.ServerIP + url,this._headIcon);
        // this._headIcon.url = ConfigMgr.ServerIP + url;
    }

    public SetQuestionSprite(url:string,_width:number,_height:number):void{
        this._questionSprite.url = url;
        this._questionSprite.width = _width;
        this._questionSprite.height = _height;
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