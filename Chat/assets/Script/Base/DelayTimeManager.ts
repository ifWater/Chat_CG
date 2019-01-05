interface Record {
    callFun: Function;
    call: any;
    time: number;
    callCount: number;
}

export default class DelayTimeManager {
    private static RecordList: Array<Record> = [];


    public static AddDelayOnce(time: number, callFun: Function, call: any): void {
        let data: Record = {} as Record;
        data.call = call;
        data.callFun = callFun;
        data.time = time;
        data.callCount = 1;
        this.RecordList.push(data);
    }

    public static RemoveDelay(callFun: Function, call: any):void {
        let removeIdx = 0;
        for (let idx = 0;idx < this.RecordList.length;idx++) {
            if (this.RecordList[idx].call == call && this.RecordList[idx].callFun == callFun) {
                removeIdx = idx;
            }
        }
        this.RecordList.splice(removeIdx, 1);
    }

    public static Update(dt: number): void {
        let removeList: Array<number> = [];
        for (let idx = 0; idx < this.RecordList.length; idx++) {
            this.RecordList[idx].time -= dt;
            if (this.RecordList[idx].time < 0) {
                this.RecordList[idx].callFun.apply(this.RecordList[idx].call);
                this.RecordList[idx].callCount -= 1;
            }
            if (this.RecordList[idx].callCount == 0) {
                removeList.push(idx);
            }
        }
        for (let i = 0; i < removeList.length; i++) {
            this.RecordList.splice(removeList[i], 1);
        }
    }
}