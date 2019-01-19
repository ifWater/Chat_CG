import BaseWindow from '../Base/BaseWindow';
import EventManager from '../Base/EventManager';
import{EventEnum} from '../Base/EventEnum';
import WindowManager from '../Base/WindowManager';

export default class WaitWnd extends BaseWindow{
    private _count:number = 0;      //  窗口引用计数

    OnLoadToExtension(){
        this.SetWndLayer(3);
    }

    OnCreate(){
        this.GetView().makeFullScreen();
    }

    OnOpen(){
        this.GetView().visible = false;
        this._count = 0;
        EventManager.AddEventListener(EventEnum.WaitModelOver,this.Hide,this);
        EventManager.AddEventListener(EventEnum.WaitModelStart,this.Show,this);

    }

    OnClose(){
        this.GetView().visible = false;
        this._count = 0;
        EventManager.RemoveEventListener(EventEnum.WaitModelOver,this.Hide,this);
        EventManager.RemoveEventListener(EventEnum.WaitModelStart,this.Show,this);
    }

    public CloseSelf():void{
        WindowManager.GetInstance().CloseWindow<WaitWnd>("WaitMsgWnd",this,WaitWnd);
    }

    public Hide():void{
        this._count -= 1;
        this.RefreshState();
    }

    public Show():void{
        this._count += 1;
        this.RefreshState();
    }

    public RefreshState():void{
        if(this._count > 0){
            this.GetView().visible = true;
        }
        else{
            this.GetView().visible = false;
        }
    }
}