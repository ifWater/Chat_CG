//工具类
// const {ccclass, property} = cc._decorator;
export default class Tools{
    //图片转Base64
    public static TextureToBase64(_texture:cc.Texture2D):string{
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = _texture.width;  //宽高看需求
        canvas.height = _texture.height;

        let texture = _texture; //这里改成你要转的图片的texture2d
        let image = texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL('image/png');
    }
    //截图
    public static GetNowScenceBase64(cullingMask:number = 0xffffffff):string{
            let node = new cc.Node();
            node.parent = cc.director.getScene();
            let camera = node.addComponent(cc.Camera);
            let viewWidth = cc.view.getVisibleSize().width*2;
            let viewHeight = cc.view.getVisibleSize().height*2;
            node.setPosition(viewWidth/2,viewHeight/2);
            // console.log(viewHeight,viewWidth)
            // 设置你想要的截图内容的 cullingMask
            camera.cullingMask = cullingMask;
            // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
            let texture = new cc.RenderTexture();
            // let gl = cc.game._renderContext;
            // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
            texture.initWithSize(viewWidth, viewHeight);
            camera.targetTexture = texture;
            // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
            let rootNode:cc.Node = cc.find("Canvas");
            camera.render(rootNode);

            // 这样我们就能从 RenderTexture 中获取到数据了
            let data = texture.readPixels();
            let width = texture.width;
            let height = texture.height;
            // 接下来就可以对这些数据进行操作了
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;


            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = srow*width*4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = data[start+i];
                }

                ctx.putImageData(imageData, 0, row);
            }
            // console.log(canvas.toDataURL("image/jpeg"))
            return canvas.toDataURL("image/jpeg");
    }
    //给定长宽的截图
    public static GetWHBase64(cullingMask:number = 0xffffffff,cullWidth:number,cullHeight:number):string{
            let node = new cc.Node();
            node.parent = cc.director.getScene();
            let camera = node.addComponent(cc.Camera);
            let viewWidth = cc.view.getVisibleSize().width*2;
            let viewHeight = cc.view.getVisibleSize().height*2;
            node.setPosition(viewWidth/2,viewHeight/2);
            // console.log(viewHeight,viewWidth)
            // 设置你想要的截图内容的 cullingMask
            camera.cullingMask = cullingMask;
            // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
            let texture = new cc.RenderTexture();
            // let gl = cc.game._renderContext;
            // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
            texture.initWithSize(cullWidth, cullHeight);
            camera.targetTexture = texture;
            // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
            let rootNode:cc.Node = cc.find("Canvas");
            camera.render(rootNode);

            // 这样我们就能从 RenderTexture 中获取到数据了
            let data = texture.readPixels();
            let width = texture.width;
            let height = texture.height;
            // 接下来就可以对这些数据进行操作了
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;


            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let imageData = ctx.createImageData(width, 1);
                let start = srow*width*4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = data[start+i];
                }

                ctx.putImageData(imageData, 0, row);
            }
            // console.log(canvas.toDataURL("image/jpeg"))
            return canvas.toDataURL("image/jpeg");
    }

    public static GetWHTexture(cullingMask:number = 0xffffffff,cullWidth:number,cullHeight:number):cc.RenderTexture{
        let node = new cc.Node();
        node.parent = cc.director.getScene();
        let camera = node.addComponent(cc.Camera);
        let viewWidth = cc.view.getVisibleSize().width*2;
        let viewHeight = cc.view.getVisibleSize().height*2;
        node.setPosition(viewWidth/2,viewHeight/2);
        // console.log(viewHeight,viewWidth)
        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = cullingMask;
        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        // let gl = cc.game._renderContext;
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        texture.initWithSize(cullWidth, cullHeight);
        camera.targetTexture = texture;
        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        let rootNode:cc.Node = cc.find("Canvas");
        camera.render(rootNode);
        return texture;
    }

    //将Texture转换为Base64
    public static GetBase64ByTexture(tex:cc.RenderTexture):string{
        let data = tex.readPixels();
        let width = tex.width;
        let height = tex.height;
        // 接下来就可以对这些数据进行操作了
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;


        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow*width*4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start+i];
            }

            ctx.putImageData(imageData, 0, row);
        }
        // console.log(canvas.toDataURL("image/jpeg"))
        return canvas.toDataURL("image/jpeg");
    }

    //文字弹窗
    public static OpenWordTips(obj:cc.Node):void{
        if(obj.active){
            return;
        }
        obj.active = true;
        let show = cc.fadeIn(0.5);
        let hide = cc.fadeOut(0.5);
        let move = cc.moveBy(1,cc.v2(0,110));
        let reset = cc.place(cc.v2(0,35));
        let finished = cc.callFunc(()=>{
             obj.active = false;
        }, this);
        let Act = cc.sequence(reset,show,move,hide,reset,finished);
        obj.runAction(Act);
    }
    //根据url创建图片(canvas原生创建)并加载到对应的组件上面
    public CreateImage(spriteCom:cc.Sprite,url:string):void{
        let image = new Image();
        image.crossOrigin = 'anonymous';
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