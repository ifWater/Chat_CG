export default abstract class BaseWindow{
    private _thisView:fgui.GComponent;
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
    public GetView():fgui.GComponent{
        return this._thisView;
    }
}