export default class FullScreenWordPrefab extends fgui.GComponent{
    private _txt:fgui.GTextField;

    public constructor(){
        super();
    }

    protected onConstruct(): void{
        this._txt = this.getChild("n0").asTextField;
    }

    public SetTxt(str:string):void{
        if(!str){
            console.log("传入字符串错误",str);
            return;
        }
        this._txt.text = str;
    } 
}