"ui";
// dialogs.alert("请在接下来的页面里授予悬浮窗权限")
// floaty.requestPermission()
var color = "#009688";
let ViewIdListRegisterListener = require('./ViewIdListRegisterListener')
let storage = storages.create('CONFIG')
var 本机编号 = storage.get("本机编号", "")
var color = "#009688";
importClass(android.text.TextWatcher)

// var storage= storages.create("支付宝工具")

ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="支付宝工具" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <frame>
                    <vertical>
                        <horizontal>
                            <text text="服务器IP:" textColor="black" textSize="16sp" />
                            <input id="服务器IP" w="180" digits="1234567890."></input>
                            <text text="端口:" textColor="black" textSize="16sp" />
                            <input id="端口" text="" w="80" digits="1234567890" ></input>
                        </horizontal>
                        <horizontal>
                            <text text="本机编号:" textColor="black" textSize="16sp" />
                            <text id="本机编号" text={本机编号} w="40" textColor="black" textSize="16sp" />
                        </horizontal>
                        {/* <horizontal>
                            <text text="我扮演的是谁:" textColor="black" textSize="16sp" />
                            <input id="我扮演的是谁" text={storage.get("我扮演的是谁","")} w="40" textColor="black" textSize="16sp" />
                        </horizontal> */}
                        <horizontal>
                            <text text="数额设置(元):    " textColor="black" textSize="16sp" />
                            <text text="下限:" textColor="black" textSize="16sp"></text>
                            <input id="数额下限" text={storage.get("数额下限",1)} w="50" />
                            <text text="上限:" textColor="black" textSize="16sp"></text>
                            <input id="数额上限" text={storage.get("数额上限", 10)} w="50" />
                        </horizontal>
                        <horizontal>
                            <text text="延时设置(秒):    " textColor="black" textSize="16sp" />
                            <text text="下限:" textColor="black" textSize="16sp"></text>
                            <input id="延时下限" text={storage.get("延时下限", 5)} w="50" />
                            <text text="上限:" textColor="black" textSize="16sp"></text>
                            <input id="延时上限" text={storage.get("延时上限", 10)} w="50" />
                        </horizontal>
                        <Switch id="autoService" text="无障碍服务" checked="{{auto.service != null}}" padding="8 8 8 8" textSize="15sp" />

                        <button style="Widget.AppCompat.Button.Colored" text="开始运行" id="start"/>     
                    </vertical>
                </frame>
                <frame>
                    {/* <text text="第二页内容" textColor="red" textSize="16sp" /> */}
                </frame>
                <frame>
                    {/* <text text="第三页内容" textColor="green" textSize="16sp" /> */}
                </frame>
            </viewpager>
        </vertical>
        <vertical layout_gravity="left" bg="#ffffff" w="280">
            <img w="280" h="200" scaleType="fitXY" src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg" />
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}" />
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" />
                </horizontal>
            </list>
        </vertical>
    </drawer>
);


//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    menu.add("设置");
    menu.add("日志");
    menu.add("关于");
});
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "设置":
            app.startActivity("settings")
            break;
        case "日志":
            app.startActivity("console")
            break;
        case "关于":
            alert("关于", "支付宝工具");
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["功能一", "功能二", "功能三"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);

//让工具栏左上角可以打开侧拉菜单
ui.toolbar.setupWithDrawer(ui.drawer);

ui.menu.setDataSource([
    {
        title: "选项一",
        icon: "@drawable/ic_android_black_48dp"
    },
    {
        title: "选项二",
        icon: "@drawable/ic_settings_black_48dp"
    },
    {
        title: "选项三",
        icon: "@drawable/ic_favorite_black_48dp"
    },
    {
        title: "退出",
        icon: "@drawable/ic_exit_to_app_black_48dp"
    }
]);

ui.menu.on("item_click", item => {
    switch (item.title) {
        case "退出":
            ui.finish();
            break;
    }
})



let 需要备份和还原的控件id列表集合 = [
    ["服务器IP"], ["端口"], ["数额下限"], ["数额上限"], ["延时下限"], ["延时上限"]
]
需要备份和还原的控件id列表集合.map((viewIdList) => {
    let inputViewIdListRegisterListener = new ViewIdListRegisterListener(viewIdList, storage)
    inputViewIdListRegisterListener.registerlistener()
    inputViewIdListRegisterListener.restore()
})



function 查找引擎(引擎名) {
    array = engines.all()
    for (let index = 0; index < array.length; index++) {
        let element = array[index];
        log(element.getSource())
        let str = String(element.getSource())
        if (str.indexOf(引擎名) != -1) {
            return element
        }
    }
    return null
}

var 上次点击时间 = 0
function 禁止连点(){
    if (new Date().getTime() - 上次点击时间 < 5 * 1000) {
        toast("不要连续点击,加载呢")
        return true
    }else{
        上次点击时间 = new Date().getTime()
    }
}

ui.start.on("click",function(){
    if (禁止连点()) {
        return
    }
    engines.execScriptFile("floatss.js")
    if (!查找引擎("websocket.js")) {
        engines.execScriptFile("websocket.js")
    }
    // threads.start(loadFloat)
    // loadFloat()
})

events.on("ui", (bh) => {
    let bh_obj = JSON.parse(bh)
    log(bh_obj)
    ui.run(() => {
        ui.本机编号.setText(String(bh_obj.bianhao))
    })
})
