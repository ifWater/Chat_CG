export default class QuestionState extends fgui.GComponent{
    private _title:fgui.GTextField;
    
    public constructor(){
        super();
    }

    protected onConstruct():void{
        this._title = this.getChild("n0").asTextField;
    }

    public SetTitle(nowNum:number,maxNum:number):void{
        let str = '第${nowNum}题/第${maxNum}题';
        this._title.text = str;
    }
}