export default abstract class BaseState{
    //自动离开的时间，如果为-1，则不退出
    private OutTime:number = -1;
    //进入状态
    public abstract EnterState():void;
    //刷新状态
    public abstract RefreshState():void;
    //离开状态
    public abstract LeaveState():void;
    //设置指向的下一个状态
    public abstract NextState():void;
    
    protected SetOutTime(_time:number):void{
        this.OutTime = _time;
    }
    public GetOutTime():number{
        return this.OutTime;
    }
}