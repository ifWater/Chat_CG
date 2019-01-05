export default class RightChatPrefab extends fgui.GComponent{
    private _headIcon:fgui.GLoader;
    private _txt:fgui.GTextField;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._headIcon = this.getChild("n2").asCom.getChild("n0").asLoader;
        this._txt = this.getChild("n1").asTextField;
    }

    public SetHeadIcon(url:string):void{
        if(!url){
            console.log("传入图片url错误",url);
            return;
        }
        this._headIcon.url = url;
    }

    public SetTxt(str:string):void{
        if(!str){
            console.log("传入字符串错误",str);
            return;
        }
        this._txt.text = str;
    }
}