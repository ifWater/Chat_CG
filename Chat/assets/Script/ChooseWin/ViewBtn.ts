import ConfigMgr from '../Base/ConfigMgr';

export default class ViewBtn extends fgui.GButton{
    private _numTxt:fgui.GTextField;
    private _sprite:fgui.GLoader;
    private _lastNum:number;
    private _uuid:string;
    private _startNum:string;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._numTxt = this.getChild("n4").asTextField;
        this._sprite = this.getChild("n0").asLoader;
    }

    public SetNumTxt(txt:string):void{
        this._numTxt.text = txt;
        this._lastNum = parseInt(txt);
    }

    public AddNumTxt(num:number):void{
        this._lastNum = this._lastNum + num
        this._numTxt.text = String(this._lastNum);
    }

    public SetImage(url:string):void{
        // console.log(ConfigMgr.ServerIP + url)
        this._sprite.url = ConfigMgr.ServerIP + url;
    }

    public SetUUID(ID:string):void{
        // console.log(ID);
        this._uuid = ID;
    }

    public GetUUID():string{
        return this._uuid;
    }

    public SetStartNum(num:string){
        this._startNum = num;
    }

    public GetStartNum():string{
        return this._startNum;
    }
}