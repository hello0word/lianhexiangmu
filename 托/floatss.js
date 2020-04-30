
auto.waitFor()
var window = floaty.window(
    <frame>
        <button id="action" text="开始运行" w="auto" h="40" bg="#77ffffff" />
    </frame>
);

setInterval(() => { }, 1000);

var execution = null;

//记录按键被按下时的触摸坐标
var x = 0,
    y = 0;
//记录按键被按下时的悬浮窗位置
var windowX, windowY;
//记录按键被按下的时间以便判断长按等动作
var downTime;

window.action.setOnTouchListener(function (view, event) {
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
            //如果按下的时间超过1.5秒判断为长按，退出脚本
            if (new Date().getTime() - downTime > 1500) {
                exit();
            }
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                onClick();
            }
            return true;
    }
    return true;
});
function onClick() {
    if (window.action.getText() == '开始运行') {
        window.action.setText('等待加载中，别动');
        // threads.start(function () {
        //     var url = "https://jpandroidserverpro26404.tk/src/%E8%81%94%E5%8A%A8%E9%A1%B9%E7%9B%AE/TUO/run.js"
        //     var res = http.get(url);
        //     if (res.statusCode == 200) {
        //         toast("从网络加载成功");
        //         var dd = res.body.string()
        //         let name = url.split("/")
        //         name = name[name.length - 1]
        //         execution = engines.execScript(name, dd);
        //         ui.run(function () { window.action.setText('停止运行'); })


        //     } else {
        //         toast("从网络加载失败:" + res.statusMessage);
        //     }
        // })

        execution = engines.execScriptFile("old.js");
        //window.action.setText('停止运行');
        ui.run(function () { window.action.setText('停止运行'); })
    } else {
        if (execution) {
            execution.getEngine().forceStop();
        }
        window.action.setText('开始运行');
    }
}