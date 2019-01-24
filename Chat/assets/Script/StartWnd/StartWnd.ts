import BaseWindow from '../Base/BaseWindow';
import MessageMangager from '../Base/MessageManager';
import Tools from '../Base/Tools';
import WindowManager from '../Base/WindowManager';
import ChooseWin from '../ChooseWin/ChooseWin';
import ConfigMgr from '../Base/ConfigMgr';
import FaceBookSDK from '../Base/FaceBookSDK';
import SDKManager from '../Base/SDKManager';
import ChatWnd from '../ChatWin/ChatWnd';
import ViewList from '../ChooseWin/ViewList';
import EventManager from '../Base/EventManager';
import { EventEnum } from '../Base/EventEnum';
export default class StartWnd extends BaseWindow{
    private _view:fgui.GComponent;

    //记录是否通过他人分享进入，如如此，则直接进入测试内容
    public static _IsJumpToShareWnd:boolean = false;
    OnLoadToExtension() {
        
    }

    OnCreate(){
        this._view = this.GetView();
    }
    
    OnOpen(){
        EventManager.AddEventListener(EventEnum.ReqJoinToChooseWnd,this.OpenChooseWnd,this);
        //开始登陆
        let reqData:object = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        reqData["UserName"] = SDKManager.GetInstance().GetPlayerName();
        //判断是否通过分享进来
        let _data = SDKManager.GetInstance().GetShareLoadData();
        if(_data){
            if(_data.ShareType){
                if(_data.ShareType == 0){
                    reqData["EnterChannel"] = 1;
                }
                else{
                    reqData["EnterChannel"] = 2;
                }
            }
            else{
                reqData["EnterChannel"] = 2;    
            }
        }
        else{
            reqData["EnterChannel"] = 0;
        }
        let url = "";
        if(ConfigMgr.IsTest){
            url = "/quce_test_server/user/Login";
        }
        else{
            url = "/quce_server/user/Login";
        }
        MessageMangager.GetInstance().SendMessage(reqData,url,this,this.LoginSuccess,this.LoginDef);
    }

    OnClose(){
        EventManager.RemoveEventListener(EventEnum.ReqJoinToChooseWnd,this.OpenChooseWnd,this);
    }


    //拉取服务器信息成功
    public GetDataSuccess(data:any):void{
        let resData = data.data;
        WindowManager.GetInstance().OpenWindow<ChooseWin>("Package1","MainUI", ChooseWin,resData);
    }

    //拉取服务器信息失败
    public GetDataDef():void{
    }

    //登陆成功
    public LoginSuccess():void{
        //登陆成功后开始判断是否是通过分享进入（控制打开不同的窗口）
        let _data = SDKManager.GetInstance().GetShareLoadData();
        if(_data){
            WindowManager.GetInstance().LoadUIPackage("Package1");
            StartWnd._IsJumpToShareWnd = true;
            this.AutoJumpToSome();
        }
        else{
            console.log("非通过分享进入！");
            StartWnd._IsJumpToShareWnd = false;
            this.OpenChooseWnd();
        }
    }
    //登陆失败
    public LoginDef():void{
        console.log("登陆失败");
    }
    //打开选择界面的窗口
    public OpenChooseWnd():void{
        //拉取列表信息
        let reqData:object = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        reqData["Offset"] = 0;
        let url = "";
        if(ConfigMgr.IsTest){
            url = "/quce_test_server/user/GetCategory";
        }
        else{
            url = "/quce_server/user/GetCategory";
        }
        MessageMangager.GetInstance().SendMessage(reqData,url,this,this.GetDataSuccess,this.GetDataDef);
    }

//---------------------------------------------------------------------
    //自动跳转到对应的测试题目内容中
    private AutoJumpToSome():void{
        //打开等待界面
        
        //
        let _shareData:any = SDKManager.GetInstance().GetShareLoadData();
        SDKManager.GetInstance().SetShareData(_shareData);
        //向服务器请求增加点击条目
        let reqData:object = {};
        reqData["ID"] = _shareData.ID;
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        let url = "";
        if(ConfigMgr.IsTest){
            url = "/quce_test_server/user/ClickCategoryContent";
        }
        else{
            url = "/quce_server/user/ClickCategoryContent";
        }
        MessageMangager.GetInstance().SendMessage(reqData,url,this,this.AutoJumpToWnd);
    }
    //根据获取的分享参数进行跳转
    private AutoJumpToWnd():void{
        let _shareData:any = SDKManager.GetInstance().GetShareLoadData();
        let openData:object = {};
        openData["NextOrder"] = _shareData.StartOrder;
        openData["CategoryContentID"] = _shareData.ID;
        openData["ShowMethod"] = _shareData.ShowMethod;
        openData["BgImageURL"] = _shareData.BgImageURL;
        openData["BgAudioURL"] = _shareData.BgAudioURL;
        openData["ViewTitle"] = _shareData.ViewTitle;
        openData["Title"] = _shareData.Title;
        //关闭等待界面
        
        //
        //打开聊天界面
        WindowManager.GetInstance().OpenWindow<ChatWnd>("Chat","ChatWnd",ChatWnd,openData);
    }
//--------------------------------------------------------------------------------------
}

