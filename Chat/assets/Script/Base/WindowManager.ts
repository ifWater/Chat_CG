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
    LockWnd = 0,    //固定窗口
    PopupWnd = 1,   //弹窗
    TipWnd = 2,     //提示窗口
    GuidWnd = 3,    //引导窗口
    ShotScreen = 4, //截屏窗口
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
        for(let i = 0;i < 5;i++){
            let newCom:fgui.GComponent = new fgui.GComponent();
            newCom.setSize(cc.winSize.width,cc.winSize.height);
            // newCom.opaque = true;
            fgui.GRoot.inst.addChild(newCom);
            this._WndCom.push(newCom);
        }
    }

    public OpenWindow<T>(packageName:string,windowName:string,T,
                    param:any = null,WndType:number = 0):void{
        this.LoadPackage<T>(packageName,windowName,T,param,WndType);
    }

    private _OpenWindow<T>(packageName:string,windowName:string,T,param:any = null,WndType:number = 0):void{
        let nowWin:WindowRecord = <WindowRecord>{};
        nowWin.windowName = windowName;
        let isCreate: BaseWindow = this.IsHaveThisWinndow<T>(windowName, T);
        if(isCreate == undefined){
            nowWin.windowScript = new T() as BaseWindow;            
            isCreate = nowWin.windowScript;
            nowWin.windowScript.OnLoadToExtension();
            let WndLayer = nowWin.windowScript.GetWndLayer();
            let _view:fgui.GComponent = fgui.UIPackage.createObject(packageName,windowName).asCom;
            nowWin.view = _view;
            if(WndType == 0){
                this._WndCom[WndLayer].addChild(_view);
            }
            else if(WndType == 1){
                this.PopLastWnd();
                this._WndCom[WndLayer].addChild(_view);                
            }
            nowWin.windowScript.SetView(_view);

            if(WndLayer != WindowLayer.ShotScreen){
                nowWin.windowScript.SetFullScreen();
            }
            nowWin.windowScript.OnCreate();
            this._WindowList.push(nowWin);
        }
        else{
            if(WndType == 1){
                this.PopLastWnd();
            }
            isCreate.GetView().visible = true;
        }
        if(param != null){
            isCreate.OnOpen(param);        
        }
        else{
            isCreate.OnOpen();
        }

    }

    //关闭上一层的窗口
    public PopLastWnd():void{
        let ViewList:Array<WindowRecord> = [];
        for(let i = 0;i<this._WindowList.length;i++){
            if(this._WindowList[i].view.visible){
                ViewList.push(this._WindowList[i]);
            }
        }
        
        // console.log(this._WindowList)
        ViewList[ViewList.length-1].windowScript.OnClose();
        ViewList[ViewList.length-1].view.visible = false;
    }

    public OpenChildWindow<T>(wnd:BaseWindow,packageName:string,windowName:string,T,
        param:any = null,WndType:number = 0):void{
            this.OpenWindow<T>(packageName,windowName,T,param,WndType)
            let newWnd = this.IsHaveThisWinndow<T>(windowName,T);
            wnd.SetChildWnd(newWnd);
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
            // windowScript.OnClose();
            isCreate.OnClose();
            isCreate.GetView().visible = false;
            let childs = isCreate.GetChildWnd();
            if(childs&&childs.length > 0){
                for(let data of childs){
                    this._CloseWindow(data);
                }
            }
        }
        else{
            console.log("未记录此窗口,无法关闭!",nowWin);
        }
    }

    private _CloseWindow(windowScript:any):void{
        for(let i = 0;i<this._WindowList.length;i++){
            let windowName = windowScript.GetView().name;
            if(this._WindowList[i].windowName == windowName && this._WindowList[i].windowScript == windowScript){
                this._WindowList[i].windowScript.OnClose();
                this._WindowList[i].windowScript.GetView().visible = false;
                break;
            }
        }
    }

    public CloseNameWindow<T>(windowName:string,T):void{
        for(let i = 0;i<this._WindowList.length;i++){
            if(this._WindowList[i].windowName == windowName && this._WindowList[i].windowScript instanceof T){
                this._WindowList[i].windowScript.OnClose();
                this._WindowList[i].windowScript.GetView().visible = false;
            }
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

    private LoadPackage<T>(name:string,windowName:string,T,param:any = null,WndType:number = 0):void{
        let isLoad:number = this._loadAllPackage.indexOf(name);
        if(isLoad == -1){
            fgui.UIPackage.loadPackage("FairyGui/"+name,()=>{
                this.LoadOverCall<T>(name,windowName,T,param,WndType);
            });
        }
        else{           
            this._OpenWindow<T>(name,windowName,T,param,WndType);
        }
    }

    private RemovePackage(name:string):void{
        
    }

    private LoadOverCall<T>(name:string,windowName:string,T,param:any = null,WndType:number = 0):void{
        this._loadAllPackage.push(name);
        this._OpenWindow<T>(name,windowName,T,param,WndType);
    }

    //提前加载UI包
    public LoadUIPackage(_name:string):void{
        fgui.UIPackage.loadPackage("FairyGui/"+_name,()=>{
            this._loadAllPackage.push(_name);
        });
    }
}
