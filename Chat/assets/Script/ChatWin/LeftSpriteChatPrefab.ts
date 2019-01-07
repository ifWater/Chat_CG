import ConfigMgr from '../Base/ConfigMgr';

export default class LeftSpriteChatPrefab extends fgui.GComponent{
    private _headIcon:fgui.GLoader;
    private _showIcon:fgui.GLoader;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._headIcon = this.getChild("n4").asCom.getChild("n0").asLoader;
        this._showIcon = this.getChild("n1").asLoader;
    }

    public SetHeadIcon(url:string):void{
        if(!url){
            console.log("传入图片url错误",url);
            return;
        }
        this._headIcon.url = ConfigMgr.ServerIP + url;
    }

    public SetShowIcon(url:string,_height:number,_width:number):void{
        this._showIcon.url = url;
        this._showIcon.height = _height;
        this._showIcon.width = _width;
    }
}