export default class ChooseBoxPrefab extends fgui.GComponent{
    private _moveEff:fgui.Transition;
    private _bgSprite:fgui.GLoader;
    private _descriptTxt:fgui.GTextField;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._moveEff = this.getTransition("t0");
        this._bgSprite = this.getChild("n0").asLoader;
        this._descriptTxt = this.getChild("n1").asTextField;
    }

    public PlayEff(_delay:number):void{
        this.visible = false;
        this._moveEff.play(null,1,_delay);
    }

    public SetBgSprite(idx:number):void{
        this.visible = false;
        this._bgSprite.url = "ui://Chat/" + (idx%12+1);
    }

    public SetDescriptTxt(_txt:string):void{
        this._descriptTxt.text = _txt;
    }
}