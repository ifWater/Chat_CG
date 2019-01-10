import ConfigMgr from '../Base/ConfigMgr';
import Tools from '../Base/Tools';

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
        this._numTxt.text = this.CountValue(parseFloat(txt));
        this._lastNum = parseInt(txt);
    }

    public AddNumTxt(num:number):void{
        this._lastNum = this._lastNum + num
        this._numTxt.text = this.CountValue(this._lastNum);
    }

    private CountValue(num:number):string{
        let _num = num;
        let _resStr = "";
        if(_num < 1000){
            _resStr = String(_num) + " Views";
        }
        else if(_num < 10000){
            _resStr = (_num/1000).toFixed(2) + "K Views";
        }
        else if(_num < 100000){
            _resStr = (_num/1000).toFixed(1) + "K Views";
        }
        else if(_num < 1000000){
            _resStr = Math.floor(_num/1000) + "K Views";
        }
        else if(_num < 10000000){
            _resStr = (_num/1000000).toFixed(2) + "M Views";
        }
        else if(_num < 100000000){
            _resStr = (_num/1000000).toFixed(1) + "M Views";
        }
        else{
            _resStr = Math.floor(_num/1000000) + "M Views";
        }
        return _resStr;
    }

    public SetImage(url:string):void{
        // console.log(ConfigMgr.ServerIP + url)
        Tools.ChangeURL(ConfigMgr.ServerIP + url,this._sprite);

        // this._sprite.url = ConfigMgr.ServerIP + url;
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