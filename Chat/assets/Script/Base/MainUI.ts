import WindowManager from './WindowManager';
import StartWnd from '../StartWnd/StartWnd';
import WaitWnd from '../StartWnd/WaitWnd';
import DelayTimeManager from './DelayTimeManager';
import SearchEndWnd from '../SearchWnd/SearchEndWnd';
import RightChatPrefab from '../ChatWin/RightChatPrefab';
import LeftChatPrefab from '../ChatWin/LeftChatPrefab';
import LeftSpriteChatPrefab from '../ChatWin/LeftSpriteChatPrefab';
import LeftListChatPrefab from '../ChatWin/LeftListChatPrefab';
import QuestionState from '../ChatWin/QuestionState';
import ShotSpritePrefab from '../ChatWin/ShotSpritePrefab';
import FullScreenChoosePrefab from '../ChatWin/FullScreenChoosePrefab';
import FullScreenWordPrefab from '../ChatWin/FullScreenWordPrefab';
import SpriteChoosePrefab from '../ChatWin/SpriteChoosePrefab';
import FullScreenSpriteChoosePrefab from '../ChatWin/FullScreenSpriteChoosePrefab';
import FullScreenInputWordPrefab from '../ChatWin/FullScreenInputWordPrefab';
import ViewList from '../ChooseWin/ViewList';
import ChoosePrefab from '../ChooseWin/ChoosePrefab';
import ScrollPaneUp from '../ChooseWin/ScrollPaneUp';
import ViewBtn from '../ChooseWin/ViewBtn';
import SharePrefab from '../EndWnd/SharePrefab';
import SearchBtn from '../SearchWnd/SearchBtn';
import ChooseBoxPrefab from '../ChatWin/ChooseBoxPrefab';
import FSChooseBoxPrefab from '../ChatWin/FSChooseBoxPrefab';
import SDKManager from './SDKManager';
import OMG_ShareCom from '../ChatWin/OMG_ShareCom';

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log(cc.view.isAutoFullScreenEnabled())
        // cc.view.enableAutoFullScreen(false);
        // cc.view.resizeWithBrowserSize(true);
        // // console.log(cc.view.getResolutionPolicy());
        // cc.view.setRealPixelResolution(750,1334,cc.ResolutionPolicy.EXACT_FIT);
        // // cc.view.setViewportInPoints();
        // cc.view.setDesignResolutionSize(750,1334,cc.ResolutionPolicy.EXACT_FIT);
        // // cc.view.setResolutionPolicy(cc.ResolutionPolicy.EXACT_FIT);
        // cc.view.setFrameSize(750,1334);
        // // getVisibleOrigin
        // console.log("lalala",cc.view.getVisibleOrigin())
        // cc.view.setViewportInPoints(0,0,750,1334);
        // cc.view.setScissorInPoints(0,0,750,1334);
        // console.log(cc.Game.canvas)
        // console.log(cc.Game.container);
        // cc.
        // cc.view.set
        // console.log("=====>",cc.view.getFrameSize());
        // cc.view.setFrameSize(750,1334)
        // console.log("=====>",cc.view.getFrameSize());

        // console.log(cc.winSize);

        // console.log("222",cc.view.getCanvasSize())
        // if(cc.view.isAutoFullScreenEnabled()){
        //     console.log("设置失败");
        //     // cc.screen.
        // }
        fgui.addLoadHandler();
        fgui.GRoot.create();
        // console.log("--------------------------------",fgui.GRoot.inst.width,fgui.GRoot.inst.height)
        fgui.UIConfig.defaultFont = 'Arial';
        fgui.UIObjectFactory.setExtension("ui://Chat/RightChat",RightChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftChat",LeftChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftSpriteChat",LeftSpriteChatPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/LeftListChat",LeftListChatPrefab)
        fgui.UIObjectFactory.setExtension("ui://Chat/QuestionState",QuestionState);
        fgui.UIObjectFactory.setExtension("ui://Chat/ShotSprite", ShotSpritePrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/FullScreenWord",FullScreenWordPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/FullScreenChoosePrefab",FullScreenChoosePrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/SpriteChoosePrefab",SpriteChoosePrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/FSPrefabSpriteChoose",FullScreenSpriteChoosePrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/FSInputWordPrefab",FullScreenInputWordPrefab);
        fgui.UIObjectFactory.setExtension("ui://Package1/list",ViewList);
        fgui.UIObjectFactory.setExtension("ui://Package1/choosePrefab",ChoosePrefab);
        fgui.UIObjectFactory.setExtension("ui://Package1/pullUpScroll",ScrollPaneUp);
        fgui.UIObjectFactory.setExtension("ui://Package1/viewBtn",ViewBtn);
        fgui.UIObjectFactory.setExtension("ui://EndWnd/ShareCom",SharePrefab);
        fgui.UIObjectFactory.setExtension("ui://EndWnd/viewBtn",ViewBtn);
        fgui.UIObjectFactory.setExtension("ui://SearchWnd/SearchBtn",SearchBtn);
        fgui.UIObjectFactory.setExtension("ui://Chat/ChooseBox",ChooseBoxPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/FSChooseBoxPrefab",FSChooseBoxPrefab);
        fgui.UIObjectFactory.setExtension("ui://Chat/OMG_ShareCom",OMG_ShareCom);
        fgui.UIObjectFactory.setExtension("ui://Chat/viewBtnNew",ViewBtn);
    }
    
    start () {
        // WindowManager.GetInstance().OpenWindow<WaitWnd>("StartWnd","WaitMsgWnd",WaitWnd);
        WindowManager.GetInstance().OpenWindow<StartWnd>("StartWnd","WaitWnd",StartWnd);
        console.log("分享数据",SDKManager.GetInstance().GetShareLoadData());
    }

    update(dt) {
        DelayTimeManager.Update(dt);
    }
}
