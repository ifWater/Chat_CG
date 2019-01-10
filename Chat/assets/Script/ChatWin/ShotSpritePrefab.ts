import ConfigMgr from '../Base/ConfigMgr';
import WindowManager from '../Base/WindowManager';
import ShareWnd from '../EndWnd/ShareWnd';
import Tools from '../Base/Tools';

export default class ShotSpritePrefab extends fgui.GComponent {
    private _headIcon: fgui.GLoader;
    private _showIcon: fgui.GLoader;
    private _bgGrayBtn:fgui.GLoader;

    private _recordNowResData:object = {};

    public constructor() {
        super();
    }

    protected onConstruct(): void {
        this._headIcon = this.getChild("n4").asCom.getChild("n0").asLoader;
        this._showIcon = this.getChild("n1").asLoader;
        this._bgGrayBtn = this.getChild("n5").asLoader;
        this._bgGrayBtn.onClick(this.ClickCall,this);
    }

    public SetHeadIcon(url: string): void {
        if (!url) {
            console.log("图片错误", url);
            return;
        }
        Tools.ChangeURL(ConfigMgr.ServerIP + url,this._headIcon);        
        // this._headIcon.url = ConfigMgr.ServerIP + url;
    }

    public SetShowIcon(_tex: cc.RenderTexture, _height: number, _width: number): void {
        this._recordNowResData["Tex"] = _tex;
        this._recordNowResData["Height"] = _height;
        this._recordNowResData["Width"] = _width;
        
        this._showIcon.texture = new cc.SpriteFrame(_tex);
        this._showIcon.height = 460;
        this._showIcon.width = 345;
        this._showIcon.setPivot(0.5,0.5);
        this._showIcon.setScale(-1,1);
        this._showIcon.rotation = 180;
    }

    //点击弹出分享界面
    public ClickCall(): void {
        WindowManager.GetInstance().OpenWindow<ShareWnd>("EndWnd","ShareWnd",ShareWnd,this._recordNowResData);
    }
}