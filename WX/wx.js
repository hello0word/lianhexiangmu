auto.waitFor()
let 全局任务队列=[]

var window = floaty.window(
    <frame gravity="center">
        <button id="停止运行">停止运行</button>
    </frame>
);
window.停止运行.setOnTouchListener(function (view, event) {
    switch (event.getAction()) {
        case event.ACTION_DOWN:
            x = event.getRawX();
            y = event.getRawY();
            windowX = window.getX();
            windowY = window.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //移动手指时调整悬浮窗位置
            window.setPosition(windowX + (event.getRawX() - x),
                windowY + (event.getRawY() - y));
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                exit()
            }
            return true;
    }
    return true;
});

function 查找微信用户(用户名) {
    function 搜索方法() {
        if (textStartsWith("微信").indexInParent(0).className("TextView").exists()) {
            log("在首页")
            let 搜索按钮 = textStartsWith("微信").indexInParent(0).className("TextView").findOne(1000)
            if (搜索按钮) {
                log("找到搜索按钮")
                搜索按钮 = 搜索按钮.parent().child(1).child(0).bounds()
                if (搜索按钮.centerX() > 100 && 搜索按钮.centerY()) {
                    log("将点击:X:" + 搜索按钮.centerX())
                    log("将点击:y:" + 搜索按钮.centerY())
                    log(click(搜索按钮.centerX(), 搜索按钮.centerY()))
                    sleep(400)
                }else{
                    return false
                }
                
            }else{
                log("没找到搜索按钮")
                return 
            }
            
        }else{
            log("没在微信首页")
        }
        let 联系人 = 用户名
        let edit = className("EditText").packageName("com.tencent.mm").findOne(2000)
        if (edit) {
            edit.click()
            edit.setText(联系人)
            sleep(400)
        }else{
            log("找不到搜索页的编辑框")
            return 
        }
        试着刷新()
        let 目标 = className("TextView").text(联系人).findOne(1500)
        if (目标) {
            目标.parent().parent().parent().parent().click()
            return true
        }
        return false
    }
    function 试着刷新() {
        log("刷新")
        var i = app.intent({
            action: "MAIN",
            packageName: "com.tencent.mm",
            className: "com.tencent.mm.ui.LauncherUI",
            // type: "image/png",
            // data: "file:///sdcard/1.png"
            flags: ["activity_new_task"]
        });
        context.startActivity(i);
    }
    if (desc("聊天信息").exists()) {
        log("在聊天界面")
        let 当前昵称 = desc("返回").findOne(1)
        if (当前昵称 != null && 当前昵称.parent().parent().child(1).child(0).text() == 用户名) {
            return true
        }
        let 返回=  desc("返回").findOne(1000)
        // back()
        if (返回) {
            返回.parent().click()
            log("返回")
            sleep(200)
        }else{
            log("找不到返回按钮")
            return 
        }
        
    }
    试着刷新()

    return 搜索方法()


}




events.on("task",function(task){
    toastLog("wx收到任务")
    全局任务队列.push(JSON.parse(task))
})

function 发送信息(任务, 是否发送) {

    let str = 任务.message
    if (!查找微信用户(任务.target)) {
        toastLog("找不到微信用户")
        device.vibrate(1000)
        sleep(1000)
        // setClip(str)
        return false
    }
    sleep(700)
    let 输入框 = className("EditText").packageName("com.tencent.mm").find()
    log("本次输入:" + str)
    if (输入框) {
        输入框.setText(str)
    } else {
        toastLog("找不到输入框")
    }
    if (是否发送) {
        let send = clickable().text("发送").packageName("com.tencent.mm").findOne(1500)
        if (send) {
            send.click()
            return true
        } else {
            toastLog("没找到发送按钮")
            return false

        }
    }
}
function 任务对象(from, target, message) {
    this.from = from
    this.target = target// 需要发送给的微信用户
    this.message = message
    this.time = new Date().getTime()
}

function main(){
    
        if (全局任务队列.length > 0) {
            let 任务对象 = 全局任务队列[0]
            // log(任务对象)
            
             if(发送信息(任务对象, true)){
                 全局任务队列.shift()//删掉任务
             }
        }
        sleep(50)
        // log("运行中")
    
}

function test(){

}
setInterval(()=>{
    main()
    // log("活动中")
},500)