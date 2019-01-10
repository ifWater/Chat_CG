import BaseWindow from '../Base/BaseWindow';
import EventManager from '../Base/EventManager';
import{EventEnum} from '../Base/EventEnum';
import WindowManager from '../Base/WindowManager';

export default class WaitWnd extends BaseWindow{


    OnLoadToExtension(){

    }

    OnCreate(){
        this.GetView().makeFullScreen();
    }

    OnOpen(){
        console.log("==========>",cc.view.getViewportRect());
        EventManager.AddEventListener(EventEnum.WaitModelOver,this.CloseSelf,this);
    }

    OnClose(){
        EventManager.RemoveEventListener(EventEnum.WaitModelOver,this.CloseSelf,this);
    }

    public CloseSelf():void{
        WindowManager.GetInstance().CloseWindow<WaitWnd>("WaitWnd",this,WaitWnd);
    }

}