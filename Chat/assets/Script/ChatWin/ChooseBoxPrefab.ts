export default class ChooseBoxPrefab extends fgui.GComponent{
    private _moveEff:fgui.Transition;
    private _bgSprite:fgui.GLoader;
    private _descriptTxt:fgui.GTextField;
    private _Allgroup:fgui.GGroup;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._moveEff = this.getTransition("t0");
        this._bgSprite = this.getChild("n0").asLoader;
        this._descriptTxt = this.getChild("n1").asTextField;
        this._Allgroup = this.getChild("n2").asGroup;
    }

    public PlayEff(_delay:number):void{
        this._Allgroup.visible = false;
        this._moveEff.play(null,1,_delay);
    }

    public SetBgSprite(idx:number):void{
        this._moveEff.stop(true);
        this._Allgroup.visible = false;
        this._bgSprite.url = "ui://Chat/" + (idx%12+1);
    }

    public SetDescriptTxt(_txt:string):void{
        this._descriptTxt.text = _txt;
    }

    public GetIsShow():boolean{
        return this._Allgroup.visible;
    }
}