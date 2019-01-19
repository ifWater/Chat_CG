import ConfigMgr from '../Base/ConfigMgr';
import Tools from '../Base/Tools';

export default class ViewBtn extends fgui.GButton{
    private _numTxt:fgui.GTextField;
    private _sprite:fgui.GLoader;
    private _lastNum:number;
    private _uuid:string;
    private _startNum:string;
    private _chatType:number;
    private _bgImageUrl:string;
    private _bgAudio:string;
    private _titleTxt:fgui.GTextField;

    private _hot:fgui.GGroup;
    private _new:fgui.GGroup;

    //记录问题的文本
    private _questionTxt:string;
    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._numTxt = this.getChild("n4").asTextField;
        this._sprite = this.getChild("n0").asLoader;
        this._titleTxt = this.getChild("n6").asTextField;
        this._hot = this.getChild("n12").asGroup;
        this._new = this.getChild("n9").asGroup;
    }

    public SetNumTxt(txt:string):void{
        this._numTxt.text = this.CountValue(parseFloat(txt));
        this._lastNum = parseInt(txt);
    }

    public AddNumTxt(num:number):void{
        this._lastNum = this._lastNum + num
        this._numTxt.text = this.CountValue(this._lastNum);
    }

    public SetLeftRightTag(tag:number):void{
        //默认
        if(tag == 0){
            this._hot.visible = false;
            this._new.visible = false;
        }
        //new
        else if(tag == 1){
            this._hot.visible = false;
            this._new.visible = true;
        }
        //hot
        else if(tag == 2){
            this._hot.visible = true;
            this._new.visible = false;
        }
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
        this._sprite.texture = null;
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

    //设置题目类型
    public SetChatType(type:number):void{
        this._chatType = type;
    }

    //获取题目类型
    public GetChatType():number{
        return this._chatType;
    }

    //设置全屏下的背景图片地址
    public SetFullScreenBgImgUrl(url:string):void{
        this._bgImageUrl = url;
    }

    //获取图片地址
    public GetFullScreenBgImgUrl():string{
        return this._bgImageUrl;
    }

    //设置背景音乐的地址
    public SetAudioUrl(url:string):void{
        this._bgAudio = url;
    }

    //获取背景音乐的地址
    public GetAudioUrl():string{
        return this._bgAudio;
    }

    //设置封面的标题
    public SetTitleTxt(str:string):void{
        this._titleTxt.text = str;
    }


    //设置问题的文本
    public SetQuestionTxt(str:string):void{
        this._questionTxt = str;
    }

    //获取封面的标题
    public GetQuestionTxt():string{
        return this._questionTxt;
    }
}