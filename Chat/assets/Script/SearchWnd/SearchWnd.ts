import BaseWindow from '../Base/BaseWindow'
import WindowManager from '../Base/WindowManager';
import SearchBtn from './SearchBtn';

export default class SearchWnd extends BaseWindow{
    private _view:fgui.GComponent;
    private _closeBtn:fgui.GLoader;
    private _searchBtn:fgui.GLoader;
    private _inputTxt:fgui.GTextInput;
    private _list:fgui.GList;

    OnLoadToExtension(){
        fgui.UIObjectFactory.setExtension("ui://SearchWnd/SearchWnd",SearchBtn);
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
    }

    OnClose(){
        this._list.removeChildren();
    }

    //记录玩家输入
    public RecordPlayerInput():void{

    }

    //点击关闭回到选择界面
    public ClickCloseCall():void{
        WindowManager.GetInstance().CloseWindow("SearchWnd",this);
    }

    //点击搜索按钮向服务器发送消息
    public CliclSearchBtnCall():void{

    }

    public RefreshList(idx:number,obj:fgui.GObject):void{
        
    }

}