import BaseWindow from '../Base/BaseWindow';
import MessageMangager from '../Base/MessageManager';
import Tools from '../Base/Tools';
import WindowManager from '../Base/WindowManager';
import ChooseWin from '../ChooseWin/ChooseWin';
import ConfigMgr from '../Base/ConfigMgr';
import FaceBookSDK from '../Base/FaceBookSDK';
export default class StartWnd extends BaseWindow{
    private _startBtn:fgui.GLoader;
    private _view:fgui.GComponent;
    private _isLogin:boolean = false;
    private _isCanClick:boolean = true;
    OnLoadToExtension() {
        
    }

    OnCreate(){
        this._view = this.GetView();
        this._startBtn = this._view.getChild("n1").asLoader;
        this._startBtn.onClick(this.StartBtn,this);
    }

    OnOpen(){
        //开始登陆
        let reqData:object = {};
        reqData["UserID"] = FaceBookSDK.GetInstance().GetPlayerID();
        let url = "/quce_server/user/Login";
        MessageMangager.GetInstance().SendMessage(reqData,url,this,this.LoginSuccess,this.LoginDef);
    }

    OnClose(){

    }

    public StartBtn():void{
        console.log("aaaa")
        if(this._isLogin == false){
            this.GetDataDef();
        }
        if(this._isCanClick){
            this._isCanClick = false;
            //拉取列表信息
            let reqData:object = {};
            reqData["UserID"] = FaceBookSDK.GetInstance().GetPlayerID();
            reqData["Offset"] = 0;
            let url = "/quce_server/user/GetCategory";
            MessageMangager.GetInstance().SendMessage(reqData,url,this,this.GetDataSuccess,this.GetDataDef);
        }
    }

    //拉取服务器信息成功
    public GetDataSuccess(data:any):void{
        let resData = data.data;
        WindowManager.GetInstance().OpenWindow("Package1","MainUI", new ChooseWin(),resData,1);
        this._isCanClick = true;
    }

    //拉取服务器信息失败
    public GetDataDef():void{
        this._isCanClick = true;
    }

    //登陆成功
    public LoginSuccess():void{
        console.log("登陆成功");
        this._isLogin = true;
    }
    //登陆失败
    public LoginDef():void{
        console.log("登陆失败");
    }

}

