import BaseWindow from '../Base/BaseWindow';
import RightChatPrefab from './RightChatPrefab';
import LeftChatPrefab from './LeftChatPrefab';
import LeftSpriteChatPrefab from './LeftSpriteChatPrefab';
import LeftListChatPrefab from './LeftListChatPrefab';
import QuestionState from './QuestionState';
import FaceBookSDK from '../Base/FaceBookSDK';
import EventManager from '../Base/EventManager';
import{EventEnum,EventFunc,EventDataTwo,EventDataOne} from '../Base/EventEnum';
import MessageManager from '../Base/MessageManager';
import WindowManager from '../Base/WindowManager';
import EndWnd from '../EndWnd/EndWnd';

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
    ScreenShotSprite:string;
}

export default class ChatWnd extends BaseWindow{
    private _addBtn:fgui.GButton;
    private _sendBtn:fgui.GButton;
    private _inputTxt:fgui.GTextInput;
    private _chatList:fgui.GList;
    private _view:fgui.GComponent;
    private _MessageType:MessageType = {} as MessageType;

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
    private _recordLastNum:number = 0;

    private _serverData:any;
    private _chooseRes:Array<string>;

    private _playerHeadIcon:string = null;
    private _isReturn:boolean = false;
    
    OnLoadToExtension(){
        fgui.UIObjectFactory.setExtension("ui://Chat/RightChat",RightChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftChat",LeftChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftSpriteChat",LeftSpriteChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftListChat",LeftListChatPrefab)
        fgui.UIObjectFactory.setExtension("ui://Chat/QuestionState",QuestionState);
    }

    OnCreate(){
        this._view = this.GetView();

        this._addBtn = this._view.getChild("n11").asButton;
        this._sendBtn = this._view.getChild("n3").asButton;
        this._inputTxt = this._view.getChild("n4").asTextInput;
        this._chatList = this._view.getChild("n5").asList;
        this._inputTxt.on(fgui.Event.TEXT_CHANGE,this.InputTxtChangeCall,this);
        this._sendBtn.onClick(this.SendTxtCall,this);
        
        this._chatList.itemProvider = this.ReturnChatPrefab.bind(this);
        this._chatList.itemRenderer = this.RenderChatListCall.bind(this);
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
    }

    OnOpen(param:any){
        this._categoryContentID = param.CategoryContentID;
        
        this._chooseRes = [];
        //向服务器请求聊天数据
        this.ReqChatData(param);
        EventManager.AddEventListener(EventEnum.ChooseSome,this.PushChooseResCall,this);
        EventManager.AddEventListener(EventEnum.ScreenShotOver,this.ShowScreenShot,this);
    }

    OnClose(){
        this._chatList.removeChildrenToPool();
        EventManager.RemoveEventListener(EventEnum.ChooseSome,this.PushChooseResCall,this);
    }

    //截图完毕,在聊天框展示小图片
    public ShowScreenShot(data:EventDataOne<cc.RenderTexture>){

    }

    //输入文本的改变
    public InputTxtChangeCall():void{
        this._recordWillSendTxt = this._inputTxt.text;
    }

    //发送输入的文本
    public SendTxtCall():void{
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

    //模拟服务器发送文字
    public SimulateSendServerWord():void{
        let simulateData:object = {};
        simulateData["QuestionItem"] = {};        
        simulateData["QuestionItem"]["Type"] = this._MessageType.Word;
        simulateData["QuestionItem"]["Content"] = {};
        simulateData["QuestionItem"]["Content"]["Text"] = this._recordWillSendTxt;
        this._Message.push(simulateData);
        this._recordLastNum = this._chatList.numItems;
        this._chatList.numItems += 1;
    }

    //模拟服务器

    //向服务器请求数据
    public ReqChatData(param:any):void{
        let reqData:object = {};
        reqData["UserID"] = FaceBookSDK.GetInstance().GetPlayerID();
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
        
        //判断是否继续请求
        if((data.QuestionItem.Type == this._MessageType.Word)||(data.QuestionItem.Type == this._MessageType.Sprite)){
            if(data.QuestionItem.NextOrder != "-1"){
                let nextParam:object = {};
                nextParam["NextOrder"] = data.QuestionItem.NextOrder;
                nextParam["CategoryContentID"] = this._categoryContentID;
                this.ReqChatData(nextParam);
            }
        }
    }

    //请求数据失败
    public ReqDataDef():void{
        console.log("失败了???");
    }

    public PushChooseResCall(data:EventDataTwo<string,string>):void{
        let str:string = data.param;
        this._chooseRes.push(str);

        //模拟玩家发送
        let simulateData:object = {};
        simulateData["QuestionItem"] = {};
        simulateData["QuestionItem"]["Type"] = this._MessageType.PlayerWord;
        simulateData["QuestionItem"]["Content"] = {};
        simulateData["QuestionItem"]["Content"]["Text"] = data.param2;
        this._Message.push(simulateData);
        this._recordLastNum = this._chatList.numItems;
        this._chatList.numItems += 1;

        if(this._recordNowItem.QuestionItem.Content.Choices[data.param].NextOrder != "-1"){
            let nextParam:object = {};
            nextParam["NextOrder"] = this._recordNowItem.QuestionItem.Content.Choices[data.param].NextOrder;
            nextParam["CategoryContentID"] = this._categoryContentID;
            this.ReqChatData(nextParam);
        }
        else{
            //将数组解析为结果
            let resStr:string = this._chooseRes.join();
            //向服务器发送结果
            let reqData:object = {};
            reqData["UserID"] = FaceBookSDK.GetInstance().GetPlayerID();
            reqData["CategoryContentID"] = this._categoryContentID;
            reqData["InputStr"] = resStr;
            let url = "/quce_server/user/GetResult";
            MessageManager.GetInstance().SendMessage(reqData,url,this,this.ReqTheResSuccess,this.ReqTheResDef);
        }
       
    }

    //获取答题结果成功
    public ReqTheResSuccess(param:any):void{
        let data:any = param.data;
        WindowManager.GetInstance().OpenWindow("EndWnd","EndWnd",new EndWnd(),data,0);

    }
    //获取答题结果失败
    public ReqTheResDef():void{
        console.log("获取结果失败?");
    }

    //获取玩家icon
    public GetPlayHeadIcon():string{
        if(this._playerHeadIcon == null){
            this._playerHeadIcon = FaceBookSDK.GetInstance().GetPlayerIcon();
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
                let playerIcon:string = FaceBookSDK.GetInstance().GetPlayerIcon();
                prefab.SetHeadIcon(playerIcon);
                prefab.SetTxt(_message.QuestionItem.Content.Text);
                break;
            }
            case this._MessageType.Word:{
                let prefab:LeftChatPrefab = obj as LeftChatPrefab;
                prefab.SetHeadIcon(_message.AvaterURL);
                prefab.SetTxt(_message.QuestionItem.Content.Text);
                break;
            }
            case this._MessageType.WordChoose:{
                let prefab:LeftListChatPrefab = obj as LeftListChatPrefab;
                prefab.SetHeadIcon(_message.AvaterURL);
                prefab.SetQuestion(_message.QuestionItem.Content.QuestionDescription);
                prefab.SetQuestionList(_message.QuestionItem.Content.Choice);
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
            case this._MessageType.ScreenShotSprite:{
                let prefab:fgui.GButton = obj as fgui.GButton;
                prefab.onClick(this.ClickJoinShareWnd,this);
                break;
            }
        }
        this._chatList.scrollToView(idx);
    }

    //点击弹出分享界面
    public ClickJoinShareWnd():void{

    }

    //点击回退上一题
    public ClickReturnLastCall():void{
        this._chooseRes.pop();
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
                url = "ui://Chat/RightChat";
                break;
            }
            case this._MessageType.Word:{
                url = "ui://Chat/LeftChat";
                break;
            }
            case this._MessageType.WordChoose:{
                url = "ui://Chat/LeftListChat";
                break;
            }
            case this._MessageType.Sprite:{
                url = "ui://Chat/LeftSpriteChat";
                break;
            }
            case this._MessageType.QuestionState:{
                url = "ui://Chat/QuestionState";
                break;
            }
            case this._MessageType.QuestionReturnBtn:{
                url = "ui://Chat/returnLast";
            }
        }
        return url;
    }
}