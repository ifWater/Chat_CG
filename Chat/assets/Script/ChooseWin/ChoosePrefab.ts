
export default class ChoosePrefab extends fgui.GButton{
    private _nameTxt:fgui.GTextField;
    private _chooseSpr:fgui.GImage;
    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._nameTxt = this.getChild("n3").asTextField;
        this._chooseSpr = this.getChild("n5").asImage;    
    }

    public SetChooseState(state:boolean):void{
        this._chooseSpr.visible = state;
    }

    public SetTitleName(name:string):void{
        this._nameTxt.text = name;
    }
}