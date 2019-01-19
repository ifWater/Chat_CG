import WindowManager from '../Base/WindowManager';
import ViewBtn from './ViewBtn';
import ChatWnd from '../ChatWin/ChatWnd';
import ScrollPaneUp from './ScrollPaneUp';
import MessageManager from '../Base/MessageManager';
import DelayTimeManager from '../Base/DelayTimeManager';
import SDKManager from '../Base/SDKManager';
export default class ViewList extends fgui.GList{
    private _list:fgui.GList;
    private _data:any = [];
    private _isCanClick:boolean = true;
    private _ID:string;
    private _IsInitList:boolean = false;
    private _InPullRefresh:boolean = false;
    private _nowClickItem:ViewBtn;

    private _recordLastNum:number = 0;
    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._list = this.getChild("n2").asList;
        this._list.on(fgui.Event.CLICK_ITEM,this.OnItemClickCall,this);
        this._list.on(fgui.Event.PULL_UP_RELEASE,this.OnPullUpToRefresh,this);
        this._list.itemRenderer = this.RenderListView.bind(this);
    }

    public SetUUID(ID:string):void{
        this._ID = ID;
    }

    public SetSize(_width:number,_height:number):void{
        // this.width = _width;
        this.height = _height;
        // console.log("---->",_width,_height);
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
        reqData["Offset"] = this._list.numItems;
        let url = "/quce_server/user/GetCategoryContent";
        MessageManager.GetInstance().SendMessage(reqData,url,this,this.ReqListDataSuccess,this.ReqListDataDef);
    }

    //重置下拉刷新组件
    private ResetRefreshCom():void{
        let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
        this._list.scrollPane.lockFooter(0);
        footer.SetRefreshState(0);
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

    //加载列表
    public LoadList():void{
        if(!this._IsInitList){
            this.ReqDataInId();
        }
    }

    public InitList(param:any):void{
        this._data = param;
        this._recordLastNum = this._list.numItems;
        this._list.numItems = param.length;
        this._IsInitList = true;
    }
    public RenderListView(idx:number,obj:fgui.GObject):void{
        if(idx < this._recordLastNum){
            return;
        }
        let item:ViewBtn = <ViewBtn>obj;
        // console.log("--------->",this._data[idx]) 
        item.SetNumTxt(this._data[idx].ClickCount);
        item.SetImage(this._data[idx].ImgURL);
        item.SetUUID(this._data[idx].ID);
        item.SetStartNum(this._data[idx].StartOrder);
        item.SetChatType(this._data[idx].ShowMethod);
        item.SetFullScreenBgImgUrl(this._data[idx].BgImageURL);
        item.SetAudioUrl(this._data[idx].BgAudioURL);
        item.SetTitleTxt(this._data[idx].ViewTitle);
        item.SetQuestionTxt(this._data[idx].Title);
        item.SetLeftRightTag(this._data[idx].TitleContegoryID);
    }

    public OnItemClickCall(item:fgui.GObject):void{
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
        openData["ViewTitle"] = this._nowClickItem.GetQuestionTxt();
        openData["Title"] = this._nowClickItem.GetQuestionTxt();
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
}
