//选择界面
import BaseWindow from '../Base/BaseWindow';
import ViewList from './ViewList';
import ChoosePrefab from './ChoosePrefab';
import ScrollPaneUp from './ScrollPaneUp';
import WindowManager from '../Base/WindowManager';
import SearchWnd from '../SearchWnd/SearchWnd';
import FaceBookSDK from '../Base/FaceBookSDK';
import SDKManager from '../Base/SDKManager';
import MessageManager from '../Base/MessageManager';
import ChatWnd from '../ChatWin/ChatWnd';

export default class ChooseWin extends BaseWindow{
    private _view:fgui.GComponent;
    private _listTitle:fgui.GList;
    private _list:fgui.GList;
    private _pageControll:fgui.Controller;
    private _data:any;
    private _searchBtn:fgui.GLoader;
    private _headIcon:fgui.GLoader;
    private _isCanClick:boolean = true;



    OnLoadToExtension(){
        
    }

    OnCreate(){
        this._view = this.GetView();
        
        this._pageControll = this._view.getController("pageCtr");
        this._pageControll.on(fgui.Event.STATUS_CHANGED,this.OnPageChangeCall,this);

        this._list = this._view.getChild("n0").asList;
        this._list.itemRenderer = this.RenderListPackge.bind(this);
        this._listTitle = this._view.getChild("n8").asList;
        this._listTitle.itemRenderer = this.RenderListTitle.bind(this);
        this._list.scrollPane.mouseWheelEnabled = false;
        this._searchBtn = this._view.getChild("n13").asLoader;
        this._headIcon = this._view.getChild("n19").asCom.getChild("n0").asLoader;

        this._searchBtn.onClick(this.ClickSearchCall,this);

        this._listTitle.on(fgui.Event.CLICK_ITEM,this.OnItemClickCall,this)
    }

    OnOpen(param:any){
        if(param){
            this.InitHeadIcon();
            this.InitList(param);
        }
     }
    
    OnClose(){
        
    }


    //点击搜索区域,,跳转窗口
    public ClickSearchCall():void{
        if(this._isCanClick){
            this._isCanClick = false;
            WindowManager.GetInstance().OpenWindow<SearchWnd>("SearchWnd","SearchWnd",SearchWnd);
            this._isCanClick = true;
        }
    }

    //初始化列表
    public InitList(param:any):void{
        this._data = param.CategoryInfo;
        let pageNum:number = this._data.length;
        for(let i = 0;i < pageNum;i++){
            this._pageControll.addPage(String(i));
        }
        this._list.numItems = pageNum;
        this._listTitle.numItems = pageNum;
        this._pageControll.selectedIndex = 0;
    }

    //初始化头像
    public InitHeadIcon():void{
        this._headIcon.url = SDKManager.GetInstance().GetPlayerIcon();
    }

    //页面列表的渲染回调
    public RenderListPackge(idx:number,obj:fgui.GObject):void{
        let item:ViewList = <ViewList>obj;
        item.SetUUID(this._data[idx].ID);
        item.SetSize(this._list.width,this._list.height);
    }
    //标题列表的渲染回调
    public RenderListTitle(idx:number,obj:fgui.GObject):void{
        let item:ChoosePrefab = <ChoosePrefab>obj;
        let state:boolean = this._pageControll.selectedIndex == idx;
        item.SetTitleName(this._data[idx].Title);
        item.SetChooseState(state);
    }
    //点击上方的标题
    public OnItemClickCall(item:ChoosePrefab):void{
        let itemIdx:number = this._listTitle.getChildIndex(item);
        this._pageControll.selectedIndex = itemIdx;
        // this._listTitle.ensureBoundsCorrect();
    }

    //控制器页面改变
    public OnPageChangeCall(ctr:fgui.Controller):void{
        this._listTitle.scrollToView(ctr.selectedIndex);
        let childs = this._listTitle._children;
        for(let i = 0;i< childs.length;i++){
            let obj = <ChoosePrefab>childs[i]
            obj.SetChooseState(ctr.selectedIndex == i);
        }
        let item:ViewList = this._list.getChildAt(ctr.selectedIndex) as ViewList;
        item.LoadList();
    }
}