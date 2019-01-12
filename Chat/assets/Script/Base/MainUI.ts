import WindowManager from './WindowManager';
import StartWnd from '../StartWnd/StartWnd';
import WaitWnd from '../StartWnd/WaitWnd';
import DelayTimeManager from './DelayTimeManager';
import SearchEndWnd from '../SearchWnd/SearchEndWnd';

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
    }
    
    start () {
        WindowManager.GetInstance().OpenWindow<StartWnd>("StartWnd","WaitWnd",StartWnd);
    }

    update(dt) {
        DelayTimeManager.Update(dt);
    }
}
