import EventManager from '../Base/EventManager';
import{EventEnum,EventDataOne} from '../Base/EventEnum';


export default class SearchBtn extends fgui.GComponent{
    private _bgSprite:fgui.GLoader;
    private _txt:fgui.GTextField;
    private _word:string;

    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._bgSprite = this.getChild("n0").asLoader;
        this._txt = this.getChild("n1").asTextField;

        this.onClick(this.DispatchClick,this);
    }


    //设置当前的文字以及图片
    public SetWordAndSprite(word:string):void{
        this._txt.text = word;
        this._word = word;
        
        this._bgSprite.url = this.GetSpriteUrl();
    }

    public DispatchClick(){
        let data:EventDataOne<string> = {} as EventDataOne<string>;
        data.param = this._word;
        EventManager.DispatchEvent(EventEnum.ClickHotSearch,data);
    }

    private GetSpriteUrl():string{
        let randNum:number = Math.floor(Math.random()*5) + 1;
        let url:string = "ui://SearchWnd/6"// + randNum;
        return url;
    }
}