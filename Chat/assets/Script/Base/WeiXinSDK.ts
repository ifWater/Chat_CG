export class WinXinSDK{
    private WX:any = window["wx"];
    private static _instance:WinXinSDK;
    private showOldTime:number = 0;
    private showNewTime:number = 0;
    private _userData:UserInfo;
    
    public static GetInstance():WinXinSDK{
        if(this._instance ==null){
            this._instance = new WinXinSDK();
        }
        return this._instance;
    }
    //分享
    public Share(_title:string,_imageUrl:string):void{
        this.WX.shareAppMessage({
                title:_title,
                imageUrl:_imageUrl
            });
    }
    //打开右上角的分享
    public OpenRightShare(_title:string,_imageUrl:string):void{
        this.WX.showShareMenu({
                withShareTicket: true,
                success:(res)=>{
                    this.WX.onShareAppMessage(()=>{
                        return{
                            title:_title,
                            imageUrl:_imageUrl
                        }
                    });
                }
            });
    }
    //需要通关延时来判断分享是否成功的分享
    public ShareHaveCall(_title:string,_imageUrl:string,needTime:number,successCall:Function,defaultCall:Function):void{
        this.WX.onHide(()=>{
            this.showOldTime = new Date().getTime();
        });
        this.WX.onShow(()=>{
            this.showNewTime = new Date().getTime();
        });
        this.WX.shareAppMessage({
            title:_title,
            imageUrl:_imageUrl
        });
        if(this.showNewTime - this.showOldTime < needTime){
            //分享成功
            successCall();
        }
        else{
            defaultCall();
        }
    }

    //向开放域发送消息
    public SendMessage(msg:string):void{
        this.WX.postMessage({ message: msg });
    }

    //判断是否授权获取用户信息,若未授权则拉起授权
    public Authorization(){
        this.WX.getSetting({
            success(res){
                if(res.authSetting['scope.userInfo']){
                      
                }
                else{
                    const button = this.WX.createUserInfoButton({
                        type: 'text',
                        text: '获取用户信息',
                        style: {
                            left: 0,
                            top:0,
                            width: cc.view.getCanvasSize().width*2,
                            height: cc.view.getCanvasSize().height*2,
                            textAlign: 'center',
                            fontSize: 1,
                            borderRadius: 1
                        }
                    });
                    button.onTap((res) => {
                        button.destroy();
                    });
                }
            },
            fail(res){
                const button = this.WX.createUserInfoButton({
                    type: 'text',
                    text: '获取用户信息',
                    style: {
                        left: 0,
                        top:0,
                        width: cc.view.getCanvasSize().width*2,
                        height: cc.view.getCanvasSize().height*2,
                        textAlign: 'center',
                        fontSize: 1,
                        borderRadius: 1
                    }
                });
                button.onTap((res) => {
                    button.destroy();
                })
            },
        });
    }

    //获取用户信息
    public GetUserInfo():UserInfo{
        if(this._userData){
            return this._userData;
        }
        else{
            let userData:UserInfo = <UserInfo>{};
            this.WX.getUserInfo({
                success:(res)=>{
                    userData = res.userInfo;
                },
                fail(res){
                    console.log("获取用户数据失败");
                }
            });
            this._userData = userData;
            return this._userData;
        }
    }

    //获取微信上存储的值
    public GetStorage(key:string,defautValue?:string):string{
        try{
            const value = this.WX.getStorageSync(key);
            if(!value){
                return defautValue;
            }
            return value;
        }
        catch(e){
            console.log("获取存储值错误!",key);
            return defautValue;
        }
    }

    //回存数据到微信中
    public SetStorage(key:string,value:string):void{
        try{
            this.WX.setStorageSync(key,value);
        }catch(e){
            console.log("无法回存玩家数据!",e);
        }
    }

    //设置开放域数据,用于排行榜
    public SetCloudStorage(data:KVData[]):void{
        this.WX.setUserCloudStorage({
            KVDataList:data,
            success:(res)=>{
                console.log("设置开放域成功");
            },
            fail:(res)=>{
                console.log("设置开放域失败",res);
            }
        });
    }

    //创建图片
    public CreateImage(spriteCom:cc.Sprite,url:string):void{
        let image = this.WX.createImage();
        image.src = url;
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            spriteCom.spriteFrame = new cc.SpriteFrame(texture);
            spriteCom.enabled = true;
        }
    }
}

interface KVData{
    key:string;
    value:string;
}

interface UserInfo{
    nickName:string;
    avatarUrl:string;
    gender:number;
    country:string;
    province:string;
    city:string;
    language:string;
}