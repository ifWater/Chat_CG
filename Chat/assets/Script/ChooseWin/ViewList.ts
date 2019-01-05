import WindowManager from '../Base/WindowManager';
import ViewBtn from './ViewBtn';
import ChatWnd from '../ChatWin/ChatWnd';
import ScrollPaneUp from './ScrollPaneUp';
import FaceBookSDK from '../Base/FaceBookSDK';
import MessageMangager from '../Base/MessageManager';
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
        fgui.UIObjectFactory.setExtension("ui://Package1/viewBtn",ViewBtn);
        this._list = this.getChild("n2").asList;
        this._list.on(fgui.Event.CLICK_ITEM,this.OnItemClickCall,this);
        this._list.on(fgui.Event.PULL_UP_RELEASE,this.OnPullUpToRefresh,this);
        this._list.itemRenderer = this.RenderListView.bind(this);
    }

    public SetUUID(ID:string):void{
        this._ID = ID;
    }
    
    //根据ID向服务器请求相应的数据
    public ReqDataInId():void{
        if(this._InPullRefresh){
            let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
            footer.SetRefreshState(2);
            this._list.scrollPane.lockFooter(footer.sourceHeight);
        }
        let reqData:object = {};
        reqData["UserID"] = FaceBookSDK.GetInstance().GetPlayerID();
        reqData["CategoryID"] = this._ID;
        reqData["Offset"] = this._list.numItems;
        let url = "/quce_server/user/GetCategoryContent";
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
        this._IsInitList = true;
        let data = param.data.CategoryContentInfo;
        console.log("请求列表数据",data);
        if(data != null){
            if(this._InPullRefresh){
                this._InPullRefresh = false;
                let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
                footer.SetRefreshState(3);
                this._list.scrollPane.lockFooter(footer.sourceHeight);
                this.ResetRefreshCom();
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
                this.ResetRefreshCom();
            }
        }
        
    }

    //请求列表数据失败
    public ReqListDataDef():void{
        if(this._InPullRefresh){
            this._InPullRefresh = false;
            let footer:ScrollPaneUp = this._list.scrollPane.footer as ScrollPaneUp;
            footer.SetRefreshState(4);
            this._list.scrollPane.lockFooter(footer.sourceHeight);
            this.ResetRefreshCom();
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
            reqData["UserID"] = FaceBookSDK.GetInstance().GetPlayerID();
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
        WindowManager.GetInstance().OpenWindow("Chat","ChatWnd",new ChatWnd(),openData,1);

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
