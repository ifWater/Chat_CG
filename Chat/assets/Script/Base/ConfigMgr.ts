import{EventEnum,EventFunc,EventData,EventDataOne,EventDataTwo,EventDataThird} from './EventEnum';
import EventManager from './EventManager';
//-----------------服务器数据类型------------
interface ChooseListData{
    typeName:string;
    data:Array<ListData>;
}

interface ListData{
    imgUrl:string;
    uid:string;
}


export default class ConfigMgr{
    //-------------------------基本固定配置信息------------------
    public static AllListData:Array<ChooseListData> = [];
    //----------------------需手动填入必须配置信息-----------------------------------
    private readonly configMap:string[] = ["fraction","price"];              //配置表名
    private readonly ID:string = "ID";
    //-----------------------网络地址------------------------------------
    public static readonly ServerIP:string = "http://10.0.0.13:12345";
    // public static readonly ServerIP:string = "https://cutepard.com";
    //---------------------------------------------------------
    private _loadFileTag:boolean[] = [];
    private static _instance:ConfigMgr;
    private configData:object = {};
    public static GetInstance():ConfigMgr{
        if(this._instance === undefined){
            this._instance = new ConfigMgr();
        }
        return this._instance;
    }
    public LoadJsonRes():void{
        for(let i = 0;i<this.configMap.length;i++){
            this._loadFileTag[i] = false;
        }
        for(let key in this.configMap){
            let url:string = "Config/" + this.configMap[key];
            cc.loader.loadRes(url,(err,data)=>{
                if(err){
                    console.log("JSON文件,读取错误:",url,err);
                    return;
                }
                let allData = data.json;
                let name:string = this.configMap[key];
                if(this.configData[name] === undefined){
                    this.configData[name] = {};
                    for(let k in allData){
                        this.configData[name][allData[k][this.ID]] = allData[k];
                    }
                    console.log("配置表:"+name+"加载完成!");
                    this._loadFileTag[key] = true;
                    let tag:boolean = false;
                    for(let i = 0;i<this._loadFileTag.length;i++){
                        tag = this._loadFileTag[i];
                    }
                    if(tag){
                        EventManager.DispatchEvent(EventEnum.LoadJsonOver);
                    }
                }
                else{
                    console.log("KEY值重复?",name);
                }
            });
        }
    }
    public GetAllData(configName:string):object{
        if(this.configData[configName] === undefined){
            console.log("该配置表:"+configName+"不存在!");
            return null;
        }
        return this.configData[configName];
    }
    public GetDataString(configName:string,id:string,key:string):string{
        if(this.configData[configName] === undefined){
            console.log("该配置表:"+configName+"不存在!");
            return "error";
        }
        if(this.configData[configName][id] === undefined){
            console.log("配置表中字段:"+id+"不存在!");
            return "error";
        }
        if(!this.configData[configName][id][key]){
            console.log("配置表中值:"+key+"不存在!");
            return "error";
        }
        return this.configData[configName][id][key];
    }

    //------------------------------------自定义、
    private _recordInput:string = "IfWater";
    public SetRecordInput(txt:string):void{
        this._recordInput = txt;
    }
    public GetRecordInput():string{
        return this._recordInput;
    }
}