import BaseWindow from '../Base/BaseWindow'
import WindowManager from '../Base/WindowManager';
import SharePrefab from './SharePrefab';
import ViewBtn from '../ChooseWin/ViewBtn';
import SDKManager from '../Base/SDKManager';
import MessageManager from '../Base/MessageManager';
import DelayTimeManager from '../Base/DelayTimeManager';
import ScrollPaneUp from '../ChooseWin/ScrollPaneUp';
import ChatWnd from '../ChatWin/ChatWnd';

export default class ShareWnd extends BaseWindow{
    private _returnBgBtn:fgui.GLoader;
    private _view:fgui.GComponent;
    private _list:fgui.GList;
    private _sharePrefab:SharePrefab;
    private _paramData:any;
    private _recordLastNum:number = 0;


    private _data:any = [];
    private _isCanClick:boolean = true;
    private _ID:number = 2;
    private _IsInitList:boolean = false;
    private _InPullRefresh:boolean = false;
    private _nowClickItem:ViewBtn;


    OnLoadToExtension(){
        
    }

    OnCreate(){
        this._view = this.GetView();
        this._returnBgBtn = this._view.getChild("n8").asLoader;
        this._returnBgBtn.onClick(this.CloseSelf,this);
        this._list = this._view.getChild("n10").asList;
        this._list.itemProvider = this.ReturnPrefabUrl.bind(this);
        this._list.itemRenderer = this.RenderListView.bind(this); 
        this._list.on(fgui.Event.CLICK_ITEM,this.OnItemClickCall,this);
        this._list.on(fgui.Event.PULL_UP_RELEASE,this.OnPullUpToRefresh,this);

        // this._view.onClick(this.ShareThisSprite,this);
    }
    
    OnOpen(param:any){
        this._InPullRefresh = false;
        this._paramData = param;
        // this._list.scrollPane.scrollTop(true);
        if(!this._IsInitList){
            this._IsInitList = true;
            this._list.numItems = 1;
            this._recordLastNum = this._list.numItems;
            this.ReqDataInId();
        }
        else{
            this._sharePrefab.SetCategoryID(this._paramData.CategoryContentID);
            this._sharePrefab.SetWndObj(this);
            this._sharePrefab.SetShowIcon(this._paramData.Tex,this._paramData.Height,this._paramData.Width);
            this._recordLastNum = this._list.numItems;
        }
        this._list.scrollToView(0);
    }
    
    OnClose(){
        this._sharePrefab.Close();
    }

    //渲染list
    public RenderListView(idx:number,obj:fgui.GObject):void{
        if(idx < this._recordLastNum){
            return;
        }
        if(idx == 0){
            let prefab:SharePrefab = obj as SharePrefab;
            this._sharePrefab = prefab;
            prefab.SetWndObj(this);
            prefab.SetShowIcon(this._paramData.Tex,this._paramData.Height,this._paramData.Width);
            prefab.SetCategoryID(this._paramData.CategoryContentID);
        }
        else{
            let item:ViewBtn = <ViewBtn>obj;
            item.SetNumTxt(this._data[idx-1].ClickCount);
            item.SetImage(this._data[idx-1].ImgURL);
            item.SetUUID(this._data[idx-1].ID);
            item.SetStartNum(this._data[idx-1].StartOrder);
            item.SetChatType(this._data[idx-1].ShowMethod);
            item.SetFullScreenBgImgUrl(this._data[idx-1].BgImageURL);
            item.SetAudioUrl(this._data[idx-1].BgAudioURL);
            item.SetTitleTxt(this._data[idx-1].ViewTitle);
            item.SetQuestionTxt(this._data[idx-1].Title);
            item.SetLeftRightTag(this._data[idx-1].TitleContegoryID);
        }
    }

    //返回prefab
    public ReturnPrefabUrl(idx:number):string{
        if(idx == 0){
            return "ui://EndWnd/ShareCom";
        }
        else{
            return "ui://EndWnd/viewBtn"
        }
    }

    //根据ID向服务器请求相应的数据
    public ReqDataInId():void{
        if(this._InPullRefresh){
            let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
            footer.SetRefreshState(2);
            this._list.scrollPane.lockFooter(75);
        }
        let reqData:object = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        reqData["CategoryID"] = this._ID;
        reqData["Offset"] = this._list.numItems - 1;
        let url = "/quce_server/user/GetCategoryContent";
        MessageManager.GetInstance().SendMessage(reqData,url,this,this.ReqListDataSuccess,this.ReqListDataDef);
    }

    //重置下拉刷新组件
    private ResetRefreshCom():void{
        let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
        footer.SetRefreshState(0);
        this._list.scrollPane.lockFooter(0);
    }

    //请求列表数据成功
    public ReqListDataSuccess(param:any):void{
        this._IsInitList = true;
        let data = param.data.CategoryContentInfo;
        // console.log("请求列表数据",data);
        if(data != null){
            if(this._InPullRefresh){
                this._InPullRefresh = false;
                let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
                footer.SetRefreshState(3);
                this._list.scrollPane.lockFooter(75);
                DelayTimeManager.AddDelayOnce(1, this.ResetRefreshCom, this);
            }
            this._data = this._data.concat(data);
            this._recordLastNum = this._list.numItems;
            this._list.numItems += data.length;
            this._list.ensureBoundsCorrect();
        }
        else{
            if(this._InPullRefresh){
                this._InPullRefresh = false;
                let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
                footer.SetRefreshState(4);
                this._list.scrollPane.lockFooter(75);
                DelayTimeManager.AddDelayOnce(1, this.ResetRefreshCom, this);
            }
        }
        
    }

    //请求列表数据失败
    public ReqListDataDef():void{
        if(this._InPullRefresh){
            this._InPullRefresh = false;
            let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
            footer.SetRefreshState(4);
            this._list.scrollPane.lockFooter(75);
            DelayTimeManager.AddDelayOnce(1, this.ResetRefreshCom, this);
        }
    }

    public OnItemClickCall(item:fgui.GObject):void{
        let idx = this._list.getChildIndex(item);
        if(idx == 0){
            return;
        }
        let itemObj:ViewBtn = <ViewBtn>item;
        if(this._isCanClick){
            this._isCanClick = false;
            this._nowClickItem = itemObj;
            //向服务器请求增加点击条目
            let reqData:object = {};
            reqData["ID"] = itemObj.GetUUID();
            reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
            let url = "/quce_server/user/ClickCategoryContent";
            MessageManager.GetInstance().SendMessage(reqData,url,this,this.ReqClickAddNumSuccess,this.ReqClickAddNumDef);
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
        openData["CategoryContentID"] = this._nowClickItem.GetUUID();
        openData["ShowMethod"] = this._nowClickItem.GetChatType();
        openData["BgImageURL"] = this._nowClickItem.GetFullScreenBgImgUrl();
        openData["BgAudioURL"] = this._nowClickItem.GetAudioUrl();
        openData["Title"] = this._nowClickItem.GetQuestionTxt();
        this.CloseSelf();
        //打开聊天界面
        WindowManager.GetInstance().OpenWindow<ChatWnd>("Chat","ChatWnd",ChatWnd,openData);

    }

    //请求点击量增加失败
    public ReqClickAddNumDef():void{
        this._isCanClick = true;
    }

    private OnPullUpToRefresh():void{
        let footer:ScrollPaneUp = <ScrollPaneUp>this._list.scrollPane.footer;
        if(footer.ReadyToRefresh()){
            footer.SetRefreshState(2);
            this._list.scrollPane.lockFooter(75);
            this._InPullRefresh = true;            
            //向服务器请求数据
            this.ReqDataInId();
        }
    }

    //关闭界面
    public CloseSelf():void{
        this._sharePrefab.Close();
        WindowManager.GetInstance().CloseWindow<ShareWnd>("ShareWnd",this,ShareWnd);
        // WindowManager.GetInstance().CloseWindow<ChatWnd>("ChatWnd",this,ChatWnd);
        WindowManager.GetInstance().CloseNameWindow<ChatWnd>("ChatWnd",ChatWnd);
    }
}