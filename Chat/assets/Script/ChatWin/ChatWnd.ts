import BaseWindow from '../Base/BaseWindow';
import RightChatPrefab from './RightChatPrefab';
import LeftChatPrefab from './LeftChatPrefab';
import LeftSpriteChatPrefab from './LeftSpriteChatPrefab';
import LeftListChatPrefab from './LeftListChatPrefab';
import QuestionState from './QuestionState';
import EventManager from '../Base/EventManager';
import{EventEnum,EventDataThird,EventDataTwo, EventDataOne} from '../Base/EventEnum';
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
import SpriteChoosePrefab from './SpriteChoosePrefab';
import FullScreenSpriteChoosePrefab from './FullScreenSpriteChoosePrefab';
import FullScreenInputWordPrefab from './FullScreenInputWordPrefab';
import DelayTimeManager from '../Base/DelayTimeManager';
import FSChooseBoxPrefab from './FSChooseBoxPrefab';
import ChooseBoxPrefab from './ChooseBoxPrefab';

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
    ChooseBox:string;
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
    private _FullList:fgui.GList;
    //全屏图片
    private _FullimageBg:fgui.GLoader;
    private _FullimgBg2:fgui.GImage;

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

    //为实现（正在为你生成结果）记录时间
    private _recordInitResTime:number = 3;
    //记录服务器下发时间与绘制所使用的时间
    private _recordUseTime:number = 0;
    //记录收到的绘制数据
    private _recordPaintData:any = null;
    //记录动效组件
    private _recordWaitEff:fgui.GGroup;
    //记录动效特效
    private _WaitEff:fgui.Transition;
    //记录动效组件（点）
    private _WaitEff2:fgui.Transition;
    //在加载结果特效界面卡住时，给与用户一个返回的按钮
    private ReturnChatMainWnd:fgui.GLoader;



    //--------选项框模式---------------
    private _chooseBoxWnd:fgui.GGroup;       //选项框组
    private _chooseBoxWndBgBtn:fgui.GLoader;    //选项框背景
    private _chooseBoxList:fgui.GList;          //选项框列表
    private _recordCBData:Array<any> = [];      //记录服务器下发的数据
    private _recordChooseBoxWnd:FSChooseBoxPrefab = null;   //记录当前的选项框对象
    //--------------------------------
    private _playerHeadIcon:string = null;
    
    OnLoadToExtension(){
        
    }

    OnCreate(){
        this._view = this.GetView();

        this._talkSendBtn = this._view.getChild("n3").asButton;
        this._talkInputTxt = this._view.getChild("n4").asTextInput;
        this._talkList = this._view.getChild("n5").asList;
        this._returnBtn = this._view.getChild("n7").asLoader;
        this._talkGroup = this._view.getChild("n13").asGroup;
        this._FullimageBg = this._view.getChild("n14").asLoader;
        this._FullimgBg2 = this._view.getChild("n19").asImage;
        this._FullList = this._view.getChild("n18").asList;
        this._recordWaitEff = this._view.getChild("n23").asGroup;
        this._WaitEff = this._view.getTransition("t1");
        this._WaitEff2 = this._view.getTransition("t2");
        this.ReturnChatMainWnd = this._view.getChild("n26").asLoader;
        this._chooseBoxWnd = this._view.getChild("n28").asGroup;
        this._chooseBoxWndBgBtn = this._view.getChild("n27").asLoader;
        this._chooseBoxList = this._view.getChild("n29").asList;


        this._chooseBoxWndBgBtn.onClick(this.CloseChooseBoxWnd,this);
        this._chooseBoxList.itemRenderer = this.ChooseBoxRenderListCall.bind(this);
        this._chooseBoxList.on(fgui.Event.CLICK_ITEM,this.BoxClickCall,this);
        
        this._talkInputTxt.on(fgui.Event.TEXT_CHANGE,this.InputTxtChangeCall,this);
        this._talkSendBtn.onClick(this.SendTxtCall,this);

        this._returnBtn.onClick(this.ReturnChooseWnd,this);
        this.ReturnChatMainWnd.onClick(this.ReturnChooseWnd,this);

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
        this._MessageType.ChooseBox = "question_chooseBox_choice";
    }

    OnOpen(param:any){
        //进行模式切换
        this.ResetData();
        this._recordWaitEff.visible = false;
        this._recordInitResTime = 3;
        this._recordUseTime = 0;
        this._recordPaintData = null;
        this._FullimageBg.texture = null;
        this._Message = [];
        this.SwitchUI(param.ShowMethod,param.BgImageURL);
        this._chatList.numItems = 0;
        this._chatList.scrollPane.touchEffect = true;
        this._recordIsNeedPlayerInout = false;
        this._categoryContentID = param.CategoryContentID;
        this._recordFirstSendData = param;
        //向服务器请求聊天数据
        this.ReqChatData(param);
        EventManager.AddEventListener(EventEnum.OpenChooseBox,this.OpenChooseBoxWnd,this);
        EventManager.AddEventListener(EventEnum.ChooseSome,this.PushChooseResCall,this);
        EventManager.AddEventListener(EventEnum.ScreenShotOver,this.ShowScreenShot,this);
        EventManager.AddEventListener(EventEnum.ReqAgainTest,this.AgainTest,this);
        EventManager.AddEventListener(EventEnum.ReqNextData,this.ClickReqNextData,this);
        EventManager.AddEventListener(EventEnum.FSInputTo,this.ListenSendTxtCall,this);
    }

    OnClose(){
        this.ResetData();
        this._WaitEff.stop(true,false);
        this._WaitEff2.stop(true,false);
        this._recordWaitEff.visible = false;
        this._recordInitResTime = 3;
        this._recordUseTime = 0;
        this._recordPaintData = null;
        this._chatList.scrollPane.touchEffect = true;
        this._recordIsNeedPlayerInout = false;
        this._chatList.numItems = 0;
        this._Message = [];
        this._FullimageBg.texture = null;
        EventManager.RemoveEventListener(EventEnum.ChooseSome,this.PushChooseResCall,this);
        EventManager.RemoveEventListener(EventEnum.ScreenShotOver,this.ShowScreenShot,this);
        EventManager.RemoveEventListener(EventEnum.ReqAgainTest,this.AgainTest,this);
        EventManager.RemoveEventListener(EventEnum.ReqNextData,this.ClickReqNextData,this);
        EventManager.RemoveEventListener(EventEnum.FSInputTo,this.ListenSendTxtCall,this);
        EventManager.RemoveEventListener(EventEnum.OpenChooseBox,this.OpenChooseBoxWnd,this);        
        DelayTimeManager.RemoveDelay(this.ShowRes,this);
    }

    public ResetData():void{
        this._chooseBoxList.numItems = 0;
        this._chooseBoxWnd.visible = false;
        this._recordCBData = [];
    }

//--------------------------------------------------------------------
//-----------星座类选项框模式

    //关闭选项框
    public CloseChooseBoxWnd():void{
        this._chooseBoxList.numItems = 0;
        this._chooseBoxWnd.visible = false;
        this._recordCBData = [];
        this._recordChooseBoxWnd.ResetNowClick();
    }

    //打开选项框
    public OpenChooseBoxWnd(_data:EventDataOne<FSChooseBoxPrefab>):void{
        this._chooseBoxWnd.visible = true;
        this._recordChooseBoxWnd = _data.param;
        this._recordCBData = _data.param.GetServerData();
        this._chooseBoxList.numItems = this._recordCBData.length;
        this._chooseBoxList.ensureBoundsCorrect();
        for(let i = 0;i < this._chooseBoxList.numItems;i++){
            let prefab:ChooseBoxPrefab = this._chooseBoxList.getChildAt(i) as ChooseBoxPrefab;
            if(this._chooseBoxList.isChildInView(prefab)){
                prefab.PlayEff(i*0.2);
            }
        }
    }


    //选项框的列表渲染回调
    public ChooseBoxRenderListCall(idx:number,obj:fgui.GObject):void{
        let prefab:ChooseBoxPrefab = obj as ChooseBoxPrefab;
        prefab.SetBgSprite(idx);
        prefab.SetDescriptTxt(this._recordCBData[idx].DescriptionText);
    }

    //选项的点击回调
    public BoxClickCall(obj:fgui.GObject):void{
        let clickItem:ChooseBoxPrefab = obj as ChooseBoxPrefab;
        let idx = this._chooseBoxList.getChildIndex(clickItem);
        this._recordChooseBoxWnd.SetNowChooseData(idx,this._recordCBData[idx].DescriptionText);
        this.CloseChooseBoxWnd();
    }
//---------------------------------------------------------------------

    //根据服务器下发的聊天模式进行切换界面
    public SwitchUI(_type:number,url:string){
        //隐藏输入框
        this._talkGroup.visible = false;
        this._recordChatType = _type;
        this._FullList.visible = false;
        this._talkList.visible = false;
        switch(_type){
            case ChatType.FullScreenType:{
                this._chatList = this._FullList;
                Tools.ChangeURL(ConfigMgr.ServerIP + url,this._FullimageBg);
                this._FullimageBg.visible = true;
                this._FullimgBg2.visible = true;
                break;
            }
            case ChatType.TalkType:{
                this._chatList = this._talkList;
                this._inputTxt = this._talkInputTxt;
                this._inputBox = this._talkGroup;
                this._FullimageBg.visible = false;
                this._FullimgBg2.visible = false;
                break;
            }
        }
        this._chatList.visible = true;
    }

    //全屏模式下监听事件去发送文本
    public ListenSendTxtCall(data:EventDataOne<string>):void{
        let _txt = data.param;
        if(_txt == "" || _txt == undefined){
            return;
        }
        if(this._recordIsNeedPlayerInout){
            this._recordIsNeedPlayerInout = false;
            ConfigMgr.GetInstance().SetRecordInput(_txt);
            let reqData: object = {};
            reqData["UserID"] = SDKManager.GetInstance().GetPlayerID();
            reqData["CategoryContentID"] = this._categoryContentID;
            reqData["InputStr"] = _txt;
            let url = "/quce_server/user/GetResult";
            this._recordUseTime = new Date().getTime();
            this._recordWaitEff.visible = true;
            this._WaitEff.play(()=>{
                this._WaitEff2.play(()=>{},-1);
            });
            MessageManager.GetInstance().SendMessage(reqData, url, this, this.ReqTheResSuccess, this.ReqTheResDef);
        }
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
        this._recordPaintData = data;
        this._recordUseTime = (new Date().getTime() - this._recordUseTime)/1000;
        if(CC_DEBUG){
            console.log("使用时间为",this._recordUseTime);
        }
        //实际消耗时间大于规定秒数，立马弹出结果
        if(this._recordUseTime > this._recordInitResTime){
            this.ShowRes();
        }
        //消耗时间小于1秒，则（相减）再等待一定时间
        else{
            let waitTime = this._recordInitResTime - this._recordUseTime;
            if(CC_DEBUG){
                console.log("需要等待时间：",waitTime);
            }
            DelayTimeManager.AddDelayOnce(waitTime,this.ShowRes,this);
        }
    }

    //弹出结果界面
    public ShowRes():void{
        this._recordWaitEff.visible = false;
        this._WaitEff.stop(true,false);
        this._WaitEff2.stop(true,false);
        let data:any = this._recordPaintData;
        if(this._recordChatType == ChatType.TalkType){
            this.SimulatSendSprite(data.param,data.param2,data.param3);
            this.SimulateSendServerWord("Click above image for details");
        }
        else if(this._recordChatType == ChatType.FullScreenType){
            let _recordNowResData:object = {};
            _recordNowResData["Tex"] = data.param;
            _recordNowResData["Height"] = data.param3;
            _recordNowResData["Width"] = data.param2;
            _recordNowResData["CategoryContentID"] = this._categoryContentID;
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
            this._recordUseTime = new Date().getTime();
            this._recordWaitEff.visible = true;
            this._WaitEff.play(()=>{
                this._WaitEff2.play(()=>{},-1);
            });
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
            if(data.QuestionItem.NextOrder != "-1" && this._recordChatType == ChatType.TalkType){
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
                //自动设置玩家名字
                this._inputBox.visible = true;
                this._inputTxt.text = SDKManager.GetInstance().GetPlayerName();
                this._recordWillSendTxt = this._inputTxt.text;
                ConfigMgr.GetInstance().SetRecordInput(this._inputTxt.text);
            }
            else if(this._recordChatType == ChatType.FullScreenType){
                //TODO
            }
            this._recordIsNeedPlayerInout = true;
        }

        if(data.QuestionItem.NextOrder == "-1"){
            this._chatList.scrollPane.touchEffect = false;
        }

    }

    //全屏模式下点击请求下一条数据
    public ClickReqNextData():void{
        let nextParam:object = {};
        nextParam["NextOrder"] = this._recordNowItem.QuestionItem.NextOrder;
        nextParam["CategoryContentID"] = this._categoryContentID;
        this.ReqChatData(nextParam);
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
            this._recordUseTime = new Date().getTime();
            this._recordWaitEff.visible = true;
            this._WaitEff.play(()=>{
                this._WaitEff2.play(()=>{},-1);
            });
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
        if(this._recordChatType == ChatType.FullScreenType){
            let a = obj as fgui.GComponent;
            a.width = this._chatList.width;
            a.height = this._chatList.height;
        }
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
                    let prefab:FullScreenInputWordPrefab = obj as FullScreenInputWordPrefab;
                    prefab.SetTxt(_message.QuestionItem.Content.Text);
                    prefab.SetQuestionAllTxt(this._recordFirstSendData.Title);
                }
                break;
            }
            case this._MessageType.SpriteChoose:{
                if(this._recordChatType == ChatType.TalkType){
                    let prefab:SpriteChoosePrefab = obj as SpriteChoosePrefab;
                    prefab.SetHeadIcon(_message.AvaterURL);
                    let width = _message.QuestionItem.Content.ImgWidth;
                    let height = _message.QuestionItem.Content.ImgHeight;
                    prefab.SetQuestionSprite(_message.QuestionItem.Content.ImgURL,width,height);
                    prefab.SetQuestionList(_message.QuestionItem.Content.Choice);
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    let prefab:FullScreenSpriteChoosePrefab = obj as FullScreenSpriteChoosePrefab;
                    let width = _message.QuestionItem.Content.ImgWidth;
                    let height = _message.QuestionItem.Content.ImgHeight;
                    prefab.SetQuestionSprite(_message.QuestionItem.Content.ImgURL,width,height);
                    prefab.SetQuestionList(_message.QuestionItem.Content.Choice);
                }
                break;
            }
            case this._MessageType.ChooseBox:{
                if(this._recordChatType == ChatType.TalkType){
                    console.log("暂不支持的类型");
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    let prefab:FSChooseBoxPrefab = obj as FSChooseBoxPrefab;
                    prefab.SetDescriptTxt(_message.QuestionItem.Content.QuestionDescription);
                    prefab.SetQuestionData(_message.QuestionItem.Content.Choice);
                    prefab.SetQuestionAllTxt(this._recordFirstSendData.Title);
                }
                break;
            }
            default:{
                console.log("检查类型，类型错误！",_message.QuestionItem.Type);
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
                    console.log("不应该出现的类型");
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
                    console.log("不应该出现的类型");
                }
                break;
            }
            case this._MessageType.NeedInput: {
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/LeftChat";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    url = "ui://Chat/FSInputWordPrefab";
                }
                break;
            }
            case this._MessageType.SpriteChoose:{
                if(this._recordChatType == ChatType.TalkType){
                    url = "ui://Chat/SpriteChoosePrefab";
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    url = "ui://Chat/FSPrefabSpriteChoose";
                }
                break;
            }
            case this._MessageType.ChooseBox:{
                if(this._recordChatType == ChatType.TalkType){
                    console.log("不应该出现的类型");
                }
                else if(this._recordChatType == ChatType.FullScreenType){
                    url = "ui://Chat/FSChooseBoxPrefab";
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