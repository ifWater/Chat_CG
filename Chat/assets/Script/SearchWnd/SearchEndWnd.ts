import BaseWindow from '../Base/BaseWindow';
import ViewBtn from '../ChooseWin/ViewBtn';
import ScrollPaneUp from '../ChooseWin/ScrollPaneUp';
import FaceBookSDK from '../Base/FaceBookSDK';
import MessageMangager from '../Base/MessageManager';
import DelayTimeManager from '../Base/DelayTimeManager';
import ChatWnd from '../ChatWin/ChatWnd';
import WindowManager from '../Base/WindowManager';
import SearchWnd from './SearchWnd';
import ChooseWin from '../ChooseWin/ChooseWin';
import SDKManager from '../Base/SDKManager';

export default class SearchEndWnd extends BaseWindow{
    private _list:fgui.GList;
    private _searchBtn:fgui.GLoader;
    private _returnBtn:fgui.GLoader;

    private _NoResTip:fgui.GTextField; 

    private _data:any = [];
    private _isCanClick:boolean = true;
    private _ID:string;
    private _InPullRefresh:boolean = false;
    private _nowClickItem:ViewBtn;

    private _recordLastNum:number = 0;
    private _recordWord:string;

    //记录是否是第一次请求
    private _recordFirstRes:boolean = true;

    OnLoadToExtension(){
        fgui.UIObjectFactory.setExtension("ui://Package1/viewBtn",ViewBtn);
    }

    OnCreate(){
        this._list = this.GetView().getChild("n22").asList;
        this._NoResTip = this.GetView().getChild("n29").asTextField;
        this._list.on(fgui.Event.CLICK_ITEM,this.OnItemClickCall,this);
        this._list.on(fgui.Event.PULL_UP_RELEASE,this.OnPullUpToRefresh,this);
        this._list.itemRenderer = this.RenderListView.bind(this);
        this._searchBtn = this.GetView().getChild("n23").asLoader;
        this._returnBtn = this.GetView().getChild("n26").asLoader;
        this._returnBtn.onClick(this.ClickReturnBtn,this);
        this._searchBtn.onClick(this.ClickInputBtn,this);
        this._NoResTip.visible = false;
    }

    OnOpen(data:string){
        this._data = [];
        this._isCanClick = true;
        this._nowClickItem = null;
        this._InPullRefresh = false;
        this._recordLastNum = 0;
        this._recordFirstRes = true;
        this._NoResTip.visible = false;
       this._recordWord = data;
       this.ReqDataInId();
    }

    OnClose(){
        this._list.numItems = 0;
        DelayTimeManager.RemoveDelay(this.ResetRefreshCom, this);
    }

    public ClickInputBtn():void{
        WindowManager.GetInstance().OpenWindow<SearchWnd>("SearchWnd","SearchWnd",SearchWnd,null,1);
    }

    public ClickReturnBtn():void{
        WindowManager.GetInstance().OpenWindow<ChooseWin>("Package1","MainUI", ChooseWin,null,1);
    }

    //根据ID向服务器请求相应的数据
    public ReqDataInId():void{
        if(this._InPullRefresh){
            let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
            footer.SetRefreshState(2);
            this._list.scrollPane.lockFooter(footer.sourceHeight);
        }
        let reqData:object = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        reqData["Keyword"] = this._recordWord;
        reqData["Offset"] = this._list.numItems;
        let url:string = "/quce_server/user/Search";
        MessageMangager.GetInstance().SendMessage(reqData,url,this,this.ReqListDataSuccess,this.ReqListDataDef);
    }

    //重置下拉刷新组件
    private ResetRefreshCom():void{
        let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
        footer.SetRefreshState(0);
        this._list.scrollPane.lockFooter(0);
    }

    //请求列表数据成功
    public ReqListDataSuccess(param:any):void{
        let data = param.data.CategoryContentInfo;
        if(data != null){
            if(this._InPullRefresh){
                this._InPullRefresh = false;
                let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
                footer.SetRefreshState(3);
                this._list.scrollPane.lockFooter(footer.sourceHeight);
                DelayTimeManager.AddDelayOnce(1, this.ResetRefreshCom, this);
            }
            this._data = this._data.concat(data);
            this._recordLastNum = this._list.numItems;
            this._list.numItems += data.length;
        }
        else{
            if(this._InPullRefresh){
                this._InPullRefresh = false;
                let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
                footer.SetRefreshState(4);
                this._list.scrollPane.lockFooter(footer.sourceHeight);
                DelayTimeManager.AddDelayOnce(1, this.ResetRefreshCom, this);
            }
            else{
                console.log("没有信息哟",this._recordFirstRes)
                if(this._recordFirstRes){
                    this._NoResTip.visible = true;
                }
            }
        }
        this._recordFirstRes = false;
    }

    //请求列表数据失败
    public ReqListDataDef():void{
        if(this._InPullRefresh){
            this._InPullRefresh = false;
            let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
            footer.SetRefreshState(4);
            this._list.scrollPane.lockFooter(footer.sourceHeight);
            DelayTimeManager.AddDelayOnce(1, this.ResetRefreshCom, this);
        }
        this._recordFirstRes = false;
    }

    public RenderListView(idx:number,obj:fgui.GObject):void{
        if(idx < this._recordLastNum){
            return;
        }
        let item:ViewBtn = <ViewBtn>obj;
        item.SetNumTxt(this._data[idx].ClickCount);
        item.SetImage(this._data[idx].ImgURL);
        item.SetUUID(this._data[idx].ID);
        item.SetStartNum(this._data[idx].StartOrder);
    }

    public OnItemClickCall(item:fgui.GObject):void{
        console.log("HELLO",this._list.getChildIndex(item));
        let itemObj:ViewBtn = <ViewBtn>item;
        if(this._isCanClick){
            this._isCanClick = false;
            this._nowClickItem = itemObj;
            //向服务器请求增加点击条目
            let reqData:object = {};
            reqData["ID"] = itemObj.GetUUID();
            reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
            let url = "/quce_server/user/ClickCategoryContent";
            MessageMangager.GetInstance().SendMessage(reqData,url,this,this.ReqClickAddNumSuccess,this.ReqClickAddNumDef);
        }
    }

    //请求点击量增加成功
    public ReqClickAddNumSuccess(param:any):void{
        let data = param.data;
        let addNum:number = parseInt(data.AddNum);
        this._nowClickItem.AddNumTxt(addNum);
        this._isCanClick = true;        

        let openData:object = {};
        openData["NextOrder"] = this._nowClickItem.GetStartNum();
        openData["CategoryContentID"] = this._ID;
        //打开聊天界面
        WindowManager.GetInstance().OpenWindow<ChatWnd>("Chat","ChatWnd",ChatWnd,openData,1);

    }

    //请求点击量增加失败
    public ReqClickAddNumDef():void{
        this._isCanClick = true;
    }

    private OnPullUpToRefresh():void{
        let footer:ScrollPaneUp = <ScrollPaneUp>this._list.scrollPane.footer;
        if(footer.ReadyToRefresh()){
            footer.SetRefreshState(2);
            this._list.scrollPane.lockFooter(footer.sourceHeight);
            this._InPullRefresh = true;            
            //向服务器请求数据
            this.ReqDataInId();
        }
    }
}