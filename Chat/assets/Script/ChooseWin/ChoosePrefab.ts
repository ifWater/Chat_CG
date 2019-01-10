
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
        if(state){
            this._nameTxt.fontSize = 34;
            this._nameTxt.alpha = 255;
        }
        else{
            this._nameTxt.fontSize = 28;
            this._nameTxt.alpha = 163;
        }
    }

    public SetTitleName(name:string):void{
        this._nameTxt.text = name;
    }
}