import { WindowLayer } from "./WindowManager";

export default abstract class BaseWindow{
    private _thisView:fgui.GComponent;
    private _wndLayer:number;
    public abstract OnLoadToExtension():void;
    public abstract OnCreate():void;
    public abstract OnOpen(param?:any):void;
    public abstract OnClose():void;

    private _childWnds:Array<BaseWindow> = [];
    private _parentWnd:{wndName:string,wndFun:BaseWindow} = null;

    public SetView(_view:fgui.GComponent):void{
        if(this._thisView){
            console.log("只可设置一次,不可更改",_view);
            return;
        }
        this._thisView = _view;
    }
    
    public SetFullScreen():void{
        this._thisView.makeFullScreen();
    }
    public GetView():fgui.GComponent{
        return this._thisView;
    }


    //设置组
    public SetCullMask(group:string):void{
        let childs = this._thisView._children;
        for(let i = 0;i < childs.length;i++){
            childs[i].node.group = group;
        }
    }

    
    //获取窗口的层级
    public GetWndLayer():number{
        if(!this._wndLayer){
            this._wndLayer = WindowLayer.LockWnd;
        }
        return this._wndLayer;
    }

    //设置窗口的层级
    protected SetWndLayer(layer:number){
        this._wndLayer = layer;
    }

    //设置子窗口
    public SetChildWnd(_wndFun:BaseWindow):void{
        this._childWnds.push(_wndFun);
    }

    //设置父窗口
    protected SetParentWnd(_wndName:string,_wndFun:BaseWindow):void{
        this._parentWnd.wndName = _wndName;
        this._parentWnd.wndFun = _wndFun;
    }

    //获取子窗口
    public GetChildWnd():Array<BaseWindow>{
        return this._childWnds;
    }
}