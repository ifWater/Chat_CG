import WindowManager from './WindowManager';
import StartWnd from '../StartWnd/StartWnd';
import WaitWnd from '../StartWnd/WaitWnd';
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainUI extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        fgui.addLoadHandler();
        fgui.GRoot.create();
    }
    
    start () {
        // WindowManager.GetInstance().OpenWindow("Package1","MainUI", new ChooseWin());
        // WindowManager.GetInstance().OpenWindow("Chat","ChatWnd",new ChatWnd());
        console.log("lla")
        // this.scheduleOnce(this.Create,0.5);
        WindowManager.GetInstance().OpenWindow<StartWnd>("StartWnd","StartWnd",StartWnd);
        WindowManager.GetInstance().OpenWindow<WaitWnd>("StartWnd","WaitWnd",WaitWnd,null,0,3);
    }

    public Create(){
        WindowManager.GetInstance().OpenWindow<StartWnd>("StartWnd","StartWnd",StartWnd);
        this.scheduleOnce(()=>{
            WindowManager.GetInstance().OpenWindow<WaitWnd>("StartWnd","WaitWnd",WaitWnd,null,0,3);
        },0.5);
        
    }

    // update (dt) {}
}
