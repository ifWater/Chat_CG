import BaseWindow from './BaseWindow';
interface WindowRecord{
    windowName:string;
    windowScript:BaseWindow;
    view:fgui.GComponent;
}
export enum WindowType{
    DEFAULT = 0,    //默认
    MUTEX = 1,  //互斥
    Popup = 2,//弹窗
}
export enum WindowLayer{
    LockWnd = 0,
    PopupWnd = 1,
    TipWnd = 2,
    GuidWnd = 3,
}
export default class WindowManager{
    private static _instance:WindowManager;
    //记录加载的包
    private _loadAllPackage:Array<string> = [];
    //记录窗口
    private _WindowList:Array<WindowRecord> = [];

    public static GetInstance():WindowManager{
        if(this._instance == undefined){
            this._instance = new WindowManager();
            this._instance.InitWndMgr();
        }
        return this._instance;
    }

    private _WndCom:Array<fgui.GComponent> = [];
    private InitWndMgr():void{
        for(let i = 0;i < 4;i++){
            let newCom:fgui.GComponent = new fgui.GComponent();
            newCom.setSize(cc.winSize.width,cc.winSize.height);
            // newCom.opaque = true;
            fgui.GRoot.inst.addChild(newCom);
            this._WndCom.push(newCom);
        }
    }

    public OpenWindow<T>(packageName:string,windowName:string,T,
                    param:any = null,WndType:number = 0,WndLayer:number = 0):void{
        this.LoadPackage<T>(packageName,windowName,T,param,WndType,WndLayer);
    }

    private _OpenWindow<T>(packageName:string,windowName:string,T,param:any = null,WndType:number = 0,WndLayer:number = 0):void{
        let nowWin:WindowRecord = <WindowRecord>{};
        nowWin.windowName = windowName;
        let isCreate:BaseWindow = this.IsHaveThisWinndow<T>(windowName,T);
        if(isCreate == undefined){
            nowWin.windowScript = new T() as BaseWindow;            
            isCreate = nowWin.windowScript;
            nowWin.windowScript.OnLoadToExtension();
            let _view:fgui.GComponent = fgui.UIPackage.createObject(packageName,windowName).asCom;
            nowWin.view = _view;
            if(WndType == 0){
                this._WndCom[WndLayer].addChild(_view);
            }
            else if(WndType == 1){
                this.CloseAllWindow();
                this._WndCom[WndLayer].addChild(_view);                
            }
            nowWin.windowScript.SetView(_view);
            nowWin.windowScript.OnCreate();
            this._WindowList.push(nowWin);
        }
        else{
            isCreate.GetView().visible = true;
        }
        if(param != null){
            isCreate.OnOpen(param);        
        }
        else{
            isCreate.OnOpen();
        }

    }

    public OpenChildWindow():void{

    }

    public CloseAllWindow():void{
        for(let i = 0;i<this._WindowList.length;i++){
            if(this._WindowList[i].view.visible){
                this._WindowList[i].windowScript.OnClose();
                this._WindowList[i].view.visible = false;
            }
        }
    }

    public CloseWindow<T>(windowName:string,windowScript:any,T):void{
        let nowWin:WindowRecord = <WindowRecord>{};
        nowWin.windowName = windowName;
        nowWin.windowScript = windowScript;
        let isCreate:BaseWindow = this.IsHaveThisWinndow<T>(windowName,T);
        if(isCreate){
            windowScript.OnClose();
            isCreate.GetView().visible = false;
        }
        else{
            console.log("未记录此窗口,无法关闭!",nowWin);
        }
    }
    
    private IsHaveThisWinndow<T>(windowName:string,T):BaseWindow{
        let isHave:BaseWindow;
        for(let i = 0;i<this._WindowList.length;i++){
            if(this._WindowList[i].windowName == windowName && this._WindowList[i].windowScript instanceof T){
                isHave = this._WindowList[i].windowScript;
                break;
            }
        }
        return isHave;
    }

    private LoadPackage<T>(name:string,windowName:string,T,param:any = null,WndType:number = 0,WndLayer:number = 0):void{
        let isLoad:number = this._loadAllPackage.indexOf(name);
        if(isLoad == -1){
            fgui.UIPackage.loadPackage("FairyGui/"+name,()=>{
                this.LoadOverCall<T>(name,windowName,T,param,WndType,WndLayer);
            });
        }
        else{           
            this._OpenWindow<T>(name,windowName,T,param,WndType,WndLayer);
        }
    }

    private RemovePackage(name:string):void{
        
    }

    private LoadOverCall<T>(name:string,windowName:string,T,param:any = null,WndType:number = 0,WndLayer:number = 0):void{
        this._loadAllPackage.push(name);
        this._OpenWindow<T>(name,windowName,T,param,WndType,WndLayer);
    }
}
