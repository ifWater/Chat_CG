import BaseWindow from '../Base/BaseWindow';
import RightChatPrefab from './RightChatPrefab';
import LeftChatPrefab from './LeftChatPrefab';
import LeftSpriteChatPrefab from './LeftSpriteChatPrefab';
import LeftListChatPrefab from './LeftListChatPrefab';
import QuestionState from './QuestionState';
import EventManager from '../Base/EventManager';
import{EventEnum,EventDataThird,EventDataTwo} from '../Base/EventEnum';
import MessageManager from '../Base/MessageManager';
import WindowManager from '../Base/WindowManager';
import EndWnd from '../EndWnd/EndWnd';
import ShotSpritePrefab from './ShotSpritePrefab';
import Tools from '../Base/Tools';
import ChooseWin from '../ChooseWin/ChooseWin';
import ShareWnd from '../EndWnd/ShareWnd';
import ConfigMgr from '../Base/ConfigMgr';
import SDKManager from '../Base/SDKManager';
import FullScreenWordPrefab from './FullScreenWordPrefab';
import FullScreenChoosePrefab from './FullScreenChoosePrefab';

interface MessageType{
    Word:string;
    Sprite:string;
    WordChoose:string;
    UpHead:string;
    AudioChoose:string;
    VideoChoose:string;
    SpriteChoose:string;
    PlayerWord:string;
    QuestionState:string;
    QuestionReturnBtn:string;
    ScreenShotSprite: string;
    NeedInput: string;
}

enum ChatType{
    FullScreenType = 1,
    TalkType = 2,
}

export default class ChatWnd extends BaseWindow{
    private _inputTxt:fgui.GTextInput;
    private _chatList:fgui.GList;
    private _view:fgui.GComponent;
    private _MessageType:MessageType = {} as MessageType;
    private _returnBtn:fgui.GLoader;
    private _inputBox:fgui.GGroup;

    //聊天输入框
    private _talkInputTxt:fgui.GTextInput;
    private _talkSendBtn:fgui.GButton;
    private _talkGroup:fgui.GGroup;
    private _talkList:fgui.GList;
    //全屏输入框
    private _FullInputTxt:fgui.GTextInput;
    private _FullSendBtn:fgui.GLoader;
    private _FullGroup:fgui.GGroup;
    private _FullList:fgui.GList;
    //全屏图片
    private _FullimageBg:fgui.GLoader;

    private _Message:Array<any> = [];
    //服务器定制内容类型ID
    private _categoryContentID:string;

    //记录当前和上一个
    private _recordNowItem:any;
    private _recordLastItem:any;
    //记录返回按钮
    private _recordBtn:fgui.GObject;

    //记录将要输出的文本
    private _recordWillSendTxt:string;

    //记录上次列表长度
    private _recordLastNum: number = 0;

    //记录是否需要玩家进行输入
    private _recordIsNeedPlayerInout: boolean = false;

    //记录当前服务器的头像
    private _recordServerIcon:string;

    //记录第一次需要发送的请求
    private _recordFirstSendData:any = null;

    //记录当前的聊天模式
    private _recordChatType:number = 0;


    private _playerHeadIcon:string = null;
    
    OnLoadToExtension(){
        fgui.UIObjectFactory.setExtension("ui://Chat/RightChat",RightChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftChat",LeftChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftSpriteChat",LeftSpriteChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftListChat",LeftListChatPrefab)
        fgui.UIObjectFactory.setExtension("ui://Chat/QuestionState",QuestionState);
        fgui.UIObjectFactory.setExtension("ui://Chat/ShotSprite", ShotSpritePrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/FullScreenWord",FullScreenWordPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/FullScreenChoosePrefab",FullScreenChoosePrefab);
    }

    OnCreate(){
        this._view = this.GetView();

        this._talkSendBtn = this._view.getChild("n3").asButton;
        this._talkInputTxt = this._view.getChild("n4").asTextInput;
        this._talkList = this._view.getChild("n5").asList;
        this._returnBtn = this._view.getChild("n7").asLoader;
        this._talkGroup = this._view.getChild("n13").asGroup;
        this._FullimageBg = this._view.getChild("n14").asLoader;
        this._FullInputTxt = this._view.getChild("n15").asTextInput;
        this._FullSendBtn = this._view.getChild("n16").asLoader;
        this._FullGroup = this._view.getChild("n17").asGroup;
        this._FullList = this._view.getChild("n18").asList;

        this._talkInputTxt.on(fgui.Event.TEXT_CHANGE,this.InputTxtChangeCall,this);
        this._talkSendBtn.onClick(this.SendTxtCall,this);
        this._FullInputTxt.on(fgui.Event.TEXT_CHANGE,this.InputTxtChangeCall,this);
        this._FullSendBtn.onClick(this.SendTxtCall,this);

        this._returnBtn.onClick(this.ReturnChooseWnd,this);

        this._FullList.itemProvider = this.ReturnChatPrefab.bind(this);
        this._FullList.itemRenderer = this.RenderChatListCall.bind(this);
        
        this._talkList.itemProvider = this.ReturnChatPrefab.bind(this);
        this._talkList.itemRenderer = this.RenderChatListCall.bind(this);
        this._MessageType.Word = "question_text_desc";
        this._MessageType.AudioChoose = "question_audio_choice";
        this._MessageType.Sprite = "question_image_desc";
        this._MessageType.SpriteChoose = "question_image_choice";
        this._MessageType.UpHead = "question_upload_avater";
        this._MessageType.VideoChoose = "question_video_choice";
        this._MessageType.WordChoose = "question_text_choice";
        this._MessageType.PlayerWord = "PlayerWord";
        this._MessageType.QuestionState = "QuestionState";
        this._MessageType.QuestionReturnBtn = "ReturnBtn";
        this._MessageType.ScreenShotSprite = "ScreenShot";
        this._MessageType.NeedInput = "question_user_input_name";
    }

    OnOpen(param:any){
        //进行模式切换
        this.SwitchUI(param.ShowMethod,param.BgImageURL);
        
        this._recordIsNeedPlayerInout = false;
        this._categoryContentID = param.CategoryContentID;
        this._recordFirstSendData = param;
        //隐藏输入框
        this._FullGroup.visible = false;
        this._talkGroup.visible = false;
        //向服务器请求聊天数据
        this.ReqChatData(param);
        EventManager.AddEventListener(EventEnum.ChooseSome,this.PushChooseResCall,this);
        EventManager.AddEventListener(EventEnum.ScreenShotOver,this.ShowScreenShot,this);
        EventManager.AddEventListener(EventEnum.ReqAgainTest,this.AgainTest,this);
    }

    OnClose(){
        this._recordIsNeedPlayerInout = false;
        this._chatList.numItems = 0;
        this._Message = [];
        this._FullimageBg.texture = null;
        EventManager.RemoveEventListener(EventEnum.ChooseSome,this.PushChooseResCall,this);
        EventManager.RemoveEventListener(EventEnum.ScreenShotOver,this.ShowScreenShot,this);
        EventManager.RemoveEventListener(EventEnum.ReqAgainTest,this.AgainTest,this);
    }

    //根据服务器下发的聊天模式进行切换界面
    public SwitchUI(_type:number,url:string){
        this._recordChatType = _type;
        this._FullList.visible = false;
        this._talkList.visible = false;
        switch(_type){
            case ChatType.FullScreenType:{
                this._chatList = this._FullList;
                this._inputTxt = this._FullInputTxt;
                this._inputBox = this._FullGroup;
                Tools.ChangeURL(ConfigMgr.ServerIP + url,this._FullimageBg);
                this._FullimageBg.visible = true;
                break;
            }
            case ChatType.TalkType:{
                this._chatList = this._talkList;
                this._inputTxt = this._talkInputTxt;
                this._inputBox = this._talkGroup;
                this._FullimageBg.visible = false;
                break;
            }
        }
        this._chatList.visible = true;
    }

    //再测一次
    public AgainTest():void{
        this._chatList.numItems = 0;
        this._Message = [];
        this.ReqChatData(this._recordFirstSendData);
    }

    //返回到选择界面
    public ReturnChooseWnd():void{
        WindowManager.GetInstance().CloseWindow<ChatWnd>("ChatWnd",this,ChatWnd);
    }

    //截图完毕,在聊天框展示小图片
    //全屏模式直接出结果图
    public ShowScreenShot(data:any){
        if(this._recordChatType == ChatType.TalkType){
            this.SimulatSendSprite(data.param,data.param2,data.param3);
            this.SimulateSendServerWord("Click above image for details");
        }
        else if(this._recordChatType == ChatType.FullScreenType){
            let _recordNowResData:object = {};
            _recordNowResData["Tex"] = data.param;
            _recordNowResData["Height"] = data.param3;
            _recordNowResData["Width"] = data.param2;
            WindowManager.GetInstance().OpenWindow<ShareWnd>("EndWnd","ShareWnd",ShareWnd,_recordNowResData);
        }
    }

    //模拟服务器发送图片
    public SimulatSendSprite(_tex:cc.RenderTexture,_width:number,_height:number): void {
        let simulateData: object = {};
        simulateData["QuestionItem"] = {};
        simulateData["AvaterURL"] = this._recordServerIcon;
        simulateData["QuestionItem"]["Type"] = this._MessageType.ScreenShotSprite;
        simulateData["QuestionItem"]["Content"] = {};
        simulateData["QuestionItem"]["Content"]["Tex"] = _tex;
        simulateData["QuestionItem"]["Content"]["Width"] = _width;
        simulateData["QuestionItem"]["Content"]["Height"] = _height;
        this._Message.push(simulateData);
        this._recordLastNum = this._chatList.numItems;
        this._chatList.numItems += 1;
    }

    //输入文本的改变
    public InputTxtChangeCall():void{
        this._recordWillSendTxt = this._inputTxt.text;
    }

    //发送输入的文本
    public SendTxtCall():void{
        if(this._recordWillSendTxt == "" || this._recordWillSendTxt == undefined){
            return;
        }
        if(this._recordChatType == ChatType.TalkType){
            //玩家发送
            let simulateData:object = {};
            simulateData["QuestionItem"] = {};
            simulateData["QuestionItem"]["Type"] = this._MessageType.PlayerWord;
            simulateData["QuestionItem"]["Content"] = {};
            simulateData["QuestionItem"]["Content"]["Text"] = this._recordWillSendTxt;
            this._Message.push(simulateData);
            this._recordLastNum = this._chatList.numItems;
            this._chatList.numItems += 1;
        }
        if (this._recordIsNeedPlayerInout) {
            this._recordIsNeedPlayerInout = false;
            ConfigMgr.GetInstance().SetRecordInput(this._inputTxt.text);
            let reqData: object = {};
            reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
            reqData["CategoryContentID"] = this._categoryContentID;
            reqData["InputStr"] = this._recordWillSendTxt;
            let url = "/quce_server/user/GetResult";
            MessageManager.GetInstance().SendMessage(reqData, url, this, this.ReqTheResSuccess, this.ReqTheResDef);
        }
        this._inputTxt.text = "";
    }

    

    //模拟服务器发送文字
    public SimulateSendServerWord(txt:string):void{
        let simulateData:object = {};
        simulateData["AvaterURL"] = this._recordServerIcon;
        simulateData["QuestionItem"] = {};        
        simulateData["QuestionItem"]["Type"] = this._MessageType.Word;
        simulateData["QuestionItem"]["Content"] = {};
        simulateData["QuestionItem"]["Content"]["Text"] = txt;
        this._Message.push(simulateData);
        this._recordLastNum = this._chatList.numItems;
        this._chatList.numItems += 1;
    }

    //模拟服务器发送文字

    //向服务器请求数据
    public ReqChatData(param:any):void{
        let reqData:object = {};
        reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
        reqData["NextOrder"] = param.NextOrder;
        reqData["CategoryContentID"] = param.CategoryContentID;
        let url = "/quce_server/user/QuizChatStep";

        MessageManager.GetInstance().SendMessage(reqData,url,this,this.ReqDataSuccess,this.ReqDataDef);
    }

    //请求数据成功
    public ReqDataSuccess(param:any):void{
        let data = param.data;
        this._recordLastItem = this._recordNowItem;
        this._recordNowItem = data;
        this._Message.push(data);
        this._recordLastNum = this._chatList.numItems;
        this._chatList.numItems += 1;
        this._recordServerIcon = data.AvaterURL;
        //判断是否继续请求
        if ((data.QuestionItem.Type == this._MessageType.Word) || (data.QuestionItem.Type == this._MessageType.Sprite)) {
            if(data.QuestionItem.NextOrder != "-1"){
                let nextParam:object = {};
                nextParam["NextOrder"] = data.QuestionItem.NextOrder;
                nextParam["CategoryContentID"] = this._categoryContentID;
                this.ReqChatData(nextParam);
            }
        }
        if (data.QuestionItem.Type == this._MessageType.NeedInput) {
            if(this._recordChatType == ChatType.TalkType){
                //播放动画
                this._view.getTransition("t0").play();
                this._inputBox.visible = true;
                //自动设置玩家名字
            }
            else if(this._recordChatType == ChatType.FullScreenType){
                //TODO
            }
            this._inputTxt.text = SDKManager.GetInstance().GetPlayerName();
            this._recordWillSendTxt = this._inputTxt.text;
            ConfigMgr.GetInstance().SetRecordInput(this._inputTxt.text);
            this._recordIsNeedPlayerInout = true;
        }
    }

    //请求数据失败
    public ReqDataDef():void{
        console.log("失败了???");
    }

    public PushChooseResCall(data:EventDataTwo<number,string>):void{
        let chooseStr:string = this._recordNowItem.QuestionItem.Content.Choice[data.param].ChoiceIdentify;
        let orderStr:string = this._recordNowItem.QuestionItem.Order;
        let str:string = orderStr + "," + chooseStr;
        // this._chooseRes.push(str);

        if(this._recordChatType == ChatType.TalkType){
            //模拟玩家发送
            let simulateData:object = {};
            simulateData["QuestionItem"] = {};
            simulateData["QuestionItem"]["Type"] = this._MessageType.PlayerWord;
            simulateData["QuestionItem"]["Content"] = {};
            simulateData["QuestionItem"]["Content"]["Text"] = data.param2;
            this._Message.push(simulateData);
            this._recordLastNum = this._chatList.numItems;
            this._chatList.numItems += 1;
        }


        if(this._recordNowItem.QuestionItem.Content.Choice[data.param].NextOrder != "-1"){
            let nextParam:object = {};
            nextParam["NextOrder"] = this._recordNowItem.QuestionItem.Content.Choice[data.param].NextOrder;
            nextParam["CategoryContentID"] = this._categoryContentID;
            this.ReqChatData(nextParam);
        }
        else{
            //将数组解析为结果
            let resStr:string = str;
            //向服务器发送结果
            let reqData:object = {};
            reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
            reqData["CategoryContentID"] = this._categoryContentID;
            reqData["InputStr"] = resStr;
            let url = "/quce_server/user/GetResult";
            MessageManager.GetInstance().SendMessage(reqData,url,this,this.ReqTheResSuccess,this.ReqTheResDef);
        }
    }

    //获取答题结果成功
    public ReqTheResSuccess(param:any):void{
        if(this._recordChatType == ChatType.TalkType){
            //模拟服务器发送文字
            this.SimulateSendServerWord("Analyzing your result...");
        }
        let data: any = param.data;
        WindowManager.GetInstance().OpenWindow<EndWnd>("EndWnd", "EndWnd", EndWnd, data, 0);

    }
    //获取答题结果失败
    public ReqTheResDef():void{
        console.log("获取结果失败?");
    }

    //获取玩家icon
    public GetPlayHeadIcon():string{
        if(this._playerHeadIcon == null){
            this._playerHeadIcon = SDKManager.GetInstance().GetPlayerIcon();
        }
        return this._playerHeadIcon;
    }


    //聊天界面List渲染回调
    private RenderChatListCall(idx:number,obj:fgui.GObject):void{
        if(idx < this._recordLastNum){
            return;
        }
        let _message = this._Message[idx];
        switch(_message.QuestionItem.Type){
            case this._MessageType.PlayerWord:{
                let prefab:RightChatPrefab = obj as RightChatPrefab;
                let playerIcon:string = SDKManager.GetInstance().GetPlayerIcon();
                prefab.SetHeadIcon(playerIcon);
                prefab.SetTxt(_message.QuestionItem.Content.Text);
                break;
            }
            case this._MessageType.Word:{
                if(this._recordChatType == ChatType.TalkType){
                    let prefab:LeftChatPrefab = obj as LeftChatPrefab;
                    prefab.SetHeadIcon(_message.AvaterURL);
                    prefab.SetTxt(_message.QuestionItem.Content.Text);
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    let prefab:FullScreenWordPrefab = obj as FullScreenWordPrefab;
                    prefab.SetTxt(_message.QuestionItem.Content.Text);
                }
                break;
            }
            case this._MessageType.WordChoose:{
                if(this._recordChatType == ChatType.TalkType){
                    let prefab:LeftListChatPrefab = obj as LeftListChatPrefab;
                    prefab.SetHeadIcon(_message.AvaterURL);
                    prefab.SetQuestion(_message.QuestionItem.Content.QuestionDescription);
                    prefab.SetQuestionList(_message.QuestionItem.Content.Choice);
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    let prefab:FullScreenChoosePrefab = obj as FullScreenChoosePrefab;
                    prefab.SetQuestion(_message.QuestionItem.Content.QuestionDescription);
                    prefab.SetQuestionList(_message.QuestionItem.Content.Choice);
                }
                break;
            }
            case this._MessageType.Sprite:{
                let prefab:LeftSpriteChatPrefab = obj as LeftSpriteChatPrefab;
                prefab.SetHeadIcon(_message.AvaterURL);
                let height:number = parseInt(_message.QuestionItem.Content.Height);
                let width:number = parseInt(_message.QuestionItem.Content.Width);
                prefab.SetShowIcon(_message.QuestionItem.Content.ImgURL,height,width);
                break;
            }
            case this._MessageType.QuestionState:{
                let prefab:QuestionState = obj as QuestionState;
                // prefab.SetTitle();
                break;
            }
            case this._MessageType.QuestionReturnBtn:{
                let prefab:fgui.GButton = obj as fgui.GButton;
                prefab.onClick(this.ClickReturnLastCall,this);
                break;
            }
            case this._MessageType.ScreenShotSprite: {
                let prefab: ShotSpritePrefab = obj as ShotSpritePrefab;
                prefab.SetHeadIcon(_message.AvaterURL);
                let height = _message.QuestionItem.Content.Height;
                let width = _message.QuestionItem.Content.Width;
                prefab.SetShowIcon(_message.QuestionItem.Content.Tex,height,width);
                break;
            }
            case this._MessageType.NeedInput: {
                if(this._recordChatType == ChatType.TalkType){
                    let prefab: LeftChatPrefab = obj as LeftChatPrefab;
                    prefab.SetHeadIcon(_message.AvaterURL);
                    prefab.SetTxt(_message.QuestionItem.Content.Text);
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    let prefab:FullScreenWordPrefab = obj as FullScreenWordPrefab;
                    prefab.SetTxt(_message.QuestionItem.Content.Text);
                }
                break;
            }
        }
        this._chatList.scrollToView(idx,true);
    }

    //点击回退上一题
    public ClickReturnLastCall():void{
        // this._chooseRes.pop();
        this._recordBtn.visible = false;


        let nextParam:object = {};
        nextParam["NextOrder"] = this._recordLastItem.QuestionItem.NextOrder;
        nextParam["CategoryContentID"] = this._categoryContentID;
        this.ReqChatData(nextParam);
    }

    //返回prefab的种类
    private ReturnChatPrefab(idx:number):string{
        let messageType = this._Message[idx];
        let url:string;
        switch(messageType.QuestionItem.Type){
            case this._MessageType.PlayerWord:{
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/RightChat";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    console.log("不应出现的类型！");
                }
                break;
            }
            case this._MessageType.Word:{
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/LeftChat";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    url = "ui://Chat/FullScreenWord";
                }
                break;
            }
            case this._MessageType.WordChoose:{
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/LeftListChat";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    url = "ui://Chat/FullScreenChoosePrefab";
                }
                break;
            }
            case this._MessageType.Sprite:{
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/LeftSpriteChat";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    
                }
                break;
            }
            case this._MessageType.QuestionState:{
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/QuestionState";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    console.log("不应出现的类型！");                    
                }
                break;
            }
            case this._MessageType.QuestionReturnBtn:{
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/returnLast";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    console.log("不应出现的类型！");                    
                }
            }
            case this._MessageType.ScreenShotSprite: {
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/ShotSprite";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    
                }
                break;
            }
            case this._MessageType.NeedInput: {
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/LeftChat";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                     
                }
                break;
            }
            default:{
                console.log("类型无法匹配！",messageType.QuestionItem.Type);
            }
        }
        return url;
    }
}