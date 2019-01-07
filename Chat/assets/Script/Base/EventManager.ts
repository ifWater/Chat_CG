import{EventEnum,EventFunc,EventData,EventDataOne,EventDataTwo,EventDataThird} from './EventEnum';
export default class EventManager{
    private static eventDic:Array<EventFunc>[] = [];
    //派发事件
    public static DispatchEvent(type:EventEnum,data?:EventData){
        let allEvent:Array<EventFunc> = this.eventDic[type];
        let listener:Function;
        let thisObj:any;
        if(allEvent){
            for(let i = 0;i < allEvent.length;i++){
                let msg:EventFunc = allEvent[i];
                listener = msg.listener;
                thisObj = msg.thisObj;
                if(data){
                    listener.apply(thisObj,[data]);
                }
                else{
                    listener.apply(thisObj);
                }
            }
        }
        else{
            console.log("事件ID不存在!,",type);
        }
    }
    //添加监听事件
    public static AddEventListener(type:EventEnum,call:Function,thisObj:any){
        let allEvent:Array<EventFunc> = this.eventDic[type];
        if(allEvent){
            for(let i = 0;i < allEvent.length;i++){
                let msg:EventFunc = allEvent[i];
                if(msg.listener == call&&msg.thisObj == thisObj){
                    console.log("事件重复注册!",type);
                    return;
                }
            }
        }
        else{
            this.eventDic[type] = [];
        }
        let msgTemp:EventFunc = <EventFunc>{};
        msgTemp.listener = call;
        msgTemp.thisObj = thisObj;
        this.eventDic[type].push(msgTemp);
    }
    //移除事件
    public static RemoveEventListener(type:EventEnum,call:Function,thisObj:any){
        let allEvent:Array<EventFunc> = this.eventDic[type];
        if(allEvent!=null){
            for(let i = 0;i<allEvent.length;i++){
                if(allEvent[i].listener == call&&allEvent[i].thisObj == thisObj){
                    this.eventDic[type].splice(i,1);
                }
            }
        }
    }
    //移除该对象所有事件
    public static RemoveAllEventListener(thisObj:any){
        for(let i = 0;i<this.eventDic.length;i++){
            for(let j = 0;j<this.eventDic[i].length;j++){
                if(this.eventDic[i][j].thisObj == thisObj){
                    this.eventDic[i].splice(j,1);
                }
            }
        }
    }
}