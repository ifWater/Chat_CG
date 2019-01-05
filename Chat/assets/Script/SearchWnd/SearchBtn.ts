export default class SearchBtn extends fgui.GComponent{
    private _bgSprite:fgui.GLoader;
    private _txt:fgui.GTextField;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._bgSprite = this.getChild("n0").asLoader;
        this._txt = this.getChild("n1").asTextField;

        this._bgSprite.onClick(this.ClickCall,this);
    }

    //向服务器发送对应的请求
    public ClickCall():void{

    }

    //设置当前的文字以及图片
    public SetWordAndSprite():void{
        
    }
}