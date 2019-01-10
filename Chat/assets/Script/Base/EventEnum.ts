export {EventEnum,EventFunc,EventData,EventDataOne,EventDataTwo,EventDataThird}
//事件枚举
enum EventEnum{
    "LoadJsonOver",//加载Json配置文件完毕
    "ChooseSome",   //选择某个答案
    "ScreenShotOver",   //截图完毕
    "WaitModelOver",        //模式等待结束
    "ClickHotSearch",       //点击搜索关键词
    "ReqAgainTest",         //请求重玩本关
    "ImageLoadOver",        //圖片加載完畢
}

interface EventFunc{
    listener:Function;
    thisObj:any;
}

interface EventData{

}

interface EventDataOne<T> extends EventData{
    param:T;
}

interface EventDataTwo<T,K> extends EventData{
    param:T;
    param2:K;
}

interface EventDataThird<T,K,J> extends EventData{
    param:T;
    param2:K;
    param3:J;
}