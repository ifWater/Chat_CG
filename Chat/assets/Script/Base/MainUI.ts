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
        fgui.addLoadHandler();
        fgui.GRoot.create();
    }
    
    start () {
        WindowManager.GetInstance().OpenWindow<StartWnd>("StartWnd","StartWnd",StartWnd);
    }

    update(dt) {
        DelayTimeManager.Update(dt);
    }
}
