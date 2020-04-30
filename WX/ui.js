//ui
"ui";
let ViewIdListRegisterListener = require('./ViewIdListRegisterListener')
let storage = storages.create('CONFIG')
var 本机编号 = storage.get("本机编号", "")
var color = "#009688";
importClass(android.text.TextWatcher)

ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="WX" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <frame>
                    <vertical>
                        <horizontal>
                            <text text="服务器IP:" textColor="black" textSize="16sp" />
                            <input id="服务器IP" w="180"></input>
                            <text text="端口:" textColor="black" textSize="16sp" />
                            <input id="端口" text="" w="80" ></input>
                        </horizontal>
                        <horizontal>
                            <text text="本机编号:" textColor="black" textSize="16sp" />
                            <text id="本机编号" text={本机编号} w="40" textColor="black" textSize="16sp" />
                        </horizontal>
                        <Switch id="autoService" text="无障碍服务" checked="{{auto.service != null}}" padding="8 8 8 8" textSize="15sp" />
                        <button id="开始运行" text="开始运行"></button>
                    </vertical>

                </frame>
                <frame>
                    <text text="第二页内容" textColor="red" textSize="16sp" />
                </frame>
                <frame>
                    <text text="第三页内容" textColor="green" textSize="16sp" />
                </frame>
            </viewpager>
        </vertical>
        <vertical layout_gravity="left" bg="#ffffff" w="280">
            {/* <img w="280" h="200" scaleType="fitXY" src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg" /> */}
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}" />
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" />
                </horizontal>
            </list>
        </vertical>
    </drawer>
);

ui.autoService.on("check", function (checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});

// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function () {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
});
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
            alert("关于", "Auto.js界面模板 v1.0.0");
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["设置", "标签二", "标签三"]);
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
    ["服务器IP"], ["端口"]
]
需要备份和还原的控件id列表集合.map((viewIdList) => {
    let inputViewIdListRegisterListener = new ViewIdListRegisterListener(viewIdList, storage)
    inputViewIdListRegisterListener.registerlistener()
    inputViewIdListRegisterListener.restore()
})

var 上次点击时间 = 0
function 禁止连点() {
    if (new Date().getTime() - 上次点击时间 < 5 * 1000) {
        toast("不要连续点击,加载呢")
        return true
    } else {
        上次点击时间 = new Date().getTime()
    }
}

//加载功能悬浮窗
ui.开始运行.on("click", (view) => {
    log("开始运行")
    if (auto.service == null) {
        toast("请先开启无障碍服务！");
        return;
    }
    if (禁止连点()) {
        return
    }
    engines.execScriptFile("wx.js")
    if (!查找引擎("websocket.js")) {
        engines.execScriptFile("websocket.js")
    }
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
events.on("ui", (bh) => {
    let bh_obj = JSON.parse(bh)
    log(bh_obj)
    ui.run(() => {
        ui.本机编号.setText(String(bh_obj.bianhao))
    })
})
