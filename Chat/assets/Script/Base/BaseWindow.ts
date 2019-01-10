import { WindowLayer } from "./WindowManager";

export default abstract class BaseWindow{
    private _thisView:fgui.GComponent;
    private _wndLayer:number;
    public abstract OnLoadToExtension():void;
    public abstract OnCreate():void;
    public abstract OnOpen(param?:any):void;
    public abstract OnClose():void;
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
}