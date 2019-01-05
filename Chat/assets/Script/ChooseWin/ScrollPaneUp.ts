export default class ScrollPaneUp extends fgui.GComponent{
    private _c1:fgui.Controller;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._c1 = this.getController("pull");
        this.on(fgui.Event.SIZE_CHANGED,this.OnSizeChanged,this);
    }

    private OnSizeChanged():void{
        if(this._c1.selectedIndex == 2||this._c1.selectedIndex == 3){
            return;
        }
        if(this.height > this.sourceHeight){
            this._c1.selectedIndex = 1;
        }
        else{
            this._c1.selectedIndex = 0;
        }
    }

    public ReadyToRefresh():boolean{
        return this._c1.selectedIndex == 1;
    }

    public SetRefreshState(value:number):void{
        this._c1.selectedIndex = value;
    }
}