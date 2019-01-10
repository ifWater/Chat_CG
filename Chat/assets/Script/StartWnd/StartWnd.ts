import BaseWindow from '../Base/BaseWindow';
import MessageMangager from '../Base/MessageManager';
import Tools from '../Base/Tools';
import WindowManager from '../Base/WindowManager';
import ChooseWin from '../ChooseWin/ChooseWin';
import ConfigMgr from '../Base/ConfigMgr';
import FaceBookSDK from '../Base/FaceBookSDK';
import SDKManager from '../Base/SDKManager';
export default class StartWnd extends BaseWindow{
    private _view:fgui.GComponent;
    OnLoadToExtension() {
        
    }

    OnCreate(){
        this._view = this.GetView();
    }
    
    OnOpen(){
        //开始登陆
        let reqData:object = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        let url = "/quce_server/user/Login";
        MessageMangager.GetInstance().SendMessage(reqData,url,this,this.LoginSuccess,this.LoginDef);
    }

    OnClose(){

    }


    //拉取服务器信息成功
    public GetDataSuccess(data:any):void{
        let resData = data.data;
        WindowManager.GetInstance().OpenWindow<ChooseWin>("Package1","MainUI", ChooseWin,resData,1);
    }

    //拉取服务器信息失败
    public GetDataDef():void{
    }

    //登陆成功
    public LoginSuccess():void{
        //拉取列表信息
        let reqData:object = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        reqData["Offset"] = 0;
        let url = "/quce_server/user/GetCategory";
        MessageMangager.GetInstance().SendMessage(reqData,url,this,this.GetDataSuccess,this.GetDataDef);
    }
    //登陆失败
    public LoginDef():void{
        console.log("登陆失败");
    }

}

