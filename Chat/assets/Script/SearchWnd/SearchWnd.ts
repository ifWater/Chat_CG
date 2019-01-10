import BaseWindow from '../Base/BaseWindow'
import WindowManager from '../Base/WindowManager';
import SearchBtn from './SearchBtn';
import FaceBookSDK from '../Base/FaceBookSDK';
import MessageManager from "../Base/MessageManager";
import EventManager from '../Base/EventManager';
import{EventEnum,EventDataOne} from '../Base/EventEnum';
import SearchEndWnd from './SearchEndWnd';
import SDKManager from '../Base/SDKManager';

export default class SearchWnd extends BaseWindow{
    private _view:fgui.GComponent;
    private _closeBtn:fgui.GLoader;
    private _searchBtn:fgui.GLoader;
    private _inputTxt:fgui.GTextInput;
    private _list:fgui.GList;

    private _hotData:Array<string>;
    private _recordTxt:string;

    OnLoadToExtension(){
        fgui.UIObjectFactory.setExtension("ui://SearchWnd/SearchBtn",SearchBtn);
    }

    OnCreate(){
        this._view = this.GetView();
        this._closeBtn = this._view.getChild("n18").asLoader;
        this._searchBtn = this._view.getChild("n16").asLoader;
        this._inputTxt = this._view.getChild("n17").asTextInput;
        this._list = this._view.getChild("n15").asList;


        this._closeBtn.onClick(this.ClickCloseCall,this);
        this._searchBtn.onClick(this.CliclSearchBtnCall,this);
        this._inputTxt.on(fgui.Event.TEXT_CHANGE,this.RecordPlayerInput,this);
        this._inputTxt.on(fgui.Event.Submit,this.CliclSearchBtnCall,this);
        this._list.itemRenderer = this.RefreshList.bind(this);
    }

    OnOpen(){
        //向服务器请求火爆的搜索数据
        let reqData:object  = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        let url = "/quce_server/user/GetHotSearchRecommend";
        MessageManager.GetInstance().SendMessage(reqData,url,this,this.ReqHotSuccesss,this.ReqHotDef);
        EventManager.AddEventListener(EventEnum.ClickHotSearch,this.ClickHotCall,this);
    }

    OnClose(){
        this._list.removeChildren();
        EventManager.RemoveEventListener(EventEnum.ClickHotSearch,this.ClickHotCall,this);
    }

    public ClickHotCall(data:any){
        let _data:EventDataOne<string> = data as EventDataOne<string>;
        this._inputTxt.text = _data.param;
        this._recordTxt = _data.param;
        this.CliclSearchBtnCall();
    }

    //请求热搜关键词成功
    public ReqHotSuccesss(param:any){
        this._hotData = param.data.Keywords;
        this._list.numItems = this._hotData.length;
        this._list.resizeToFit(this._hotData.length);
        // console.log(this._hotData.length)
    }

    //请求热搜关键词失败
    public ReqHotDef(){

    }

    //记录玩家输入
    public RecordPlayerInput():void{
        this._recordTxt = this._inputTxt.text;
    }

    //点击关闭回到选择界面
    public ClickCloseCall():void{
        WindowManager.GetInstance().CloseWindow<SearchWnd>("SearchWnd",this,SearchWnd);
    }

    //点击搜索按钮向服务器发送消息
    public CliclSearchBtnCall():void{
        WindowManager.GetInstance().OpenWindow<SearchEndWnd>("Package1","SearchEndWnd",SearchEndWnd,this._recordTxt,1);

    }

    public RefreshList(idx:number,obj:fgui.GObject):void{
        let prefab:SearchBtn = obj as SearchBtn;
        prefab.SetWordAndSprite(this._hotData[idx]);
        
    }

}