//悬浮窗

// console.show()
var storage = storages.create("ZFBTOOL")

const 龙标记 = "🐲"
const 虎标记 = "🐯"
const 合标记 = "🈴"
const 输入框默认消息 = "这里可以编辑"
var WX端编号 = storage.get("WX端编号", "")
var 聊天页黑名单 = ["天天领守护金", "招商银行信用卡", "蚂蚁财富", "天天领心愿卡", "服务提醒", "天天领守护金", "飞猪旅行", "支付宝账户安全险", "我的小程序", "守护宝", "蚂蚁森林", "好医保", "饿了么", "支付宝商家服务", "社区生活", "蚂蚁庄园", "支付宝市民中心", "借呗", "全民保", "达人消息", "芝麻信用"]

Array.prototype.distinct = function () {
    var arr = this,
        result = [],
        i,
        j,
        len = arr.length;
    for (i = 0; i < len; i++) {
        for (j = i + 1; j < len; j++) {
            if (arr[i] === arr[j]) {
                j = ++i;
            }
        }
        result.push(arr[i]);
    }
    return result;
}
var G_当前余额 = 0
var G_当前用户 = ""

//获取悬浮窗引擎
function 获取悬浮窗引擎() {
    var array = engines.all()
    for (let index = 0; index < array.length; index++) {
        var element = array[index];
        if (String(element).indexOf("main.js") != -1) {
            return element
        }
    }
}
var textSize_s = "15sp"
var www = "auto"
var hhh = "30"
var padding_sss = "0 0 0 0"


var window = floaty.window(
    <horizontal>
        {/* <input id="发送的文本" text={输入框默认消息} w="auto" h="auto" bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} /> */}

        <vertical >
            <button id="当前用户" text={"昵称:" + "----"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={"13sp"} padding={padding_sss} />
            {/* <horizontal> */}

            <button id="识别余额" text={"余额:" + G_当前余额} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
            <button id="所有信息" text={"所有信息"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />

            {/* </horizontal> */}
            {/* <horizontal> */}
            <button id="加余额" text={"加余额"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
            <button id="减余额" text={"减余额"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />

            {/* </horizontal> */}
            {/* <horizontal> */}
            <button id="清空数据" text={"清空数据"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
            <button id="清空走势" text={"清空走势"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />

            {/* </horizontal> */}
            {/* <horizontal> */}
            <button id="固定文字" text={"固定文字"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
            <button id="发送流水" text={"发送流水"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
            <button id="全自动开关" text={"全自动:开"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
            <button id="使用微信发送" text={"使用微信发送"} w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
            {/* </horizontal> */}

        </vertical>
    </horizontal>

);
var window2 = floaty.window(
    <vertical w="auto" minWidth="150">
        <horizontal>
            <button id="走势按钮" text="走势" w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
            <button id="纠错按钮" text="纠错" w={www} h={hhh} bg="#E0FFFF" textColor="#4B0082" textSize={textSize_s} padding={padding_sss} />
        </horizontal>
        <input id="发送的文本" text={输入框默认消息} w="auto" h="auto" bg="#E0FFFF" textColor="#4B0082" textSize="13sp" padding={padding_sss} />
        <text id="上次点击的账单" text="上次信息" w="auto" h="auto" bg="#E0FFFF" textColor="#4B0082" textSize="13sp" padding={padding_sss}></text>
    </vertical>

);

window2.发送的文本.on("key", function (keyCode, event) {
    if (event.getAction() == 1 && keyCode == keys.back) {
        log("关闭")
        window2.走势按钮.setText("走势")
        window2.disableFocus();
        event.consumed = true;
    }
});

window2.发送的文本.on("touch_down", () => {
    log('按下')
    window2.走势按钮.setText("取消编辑")
    window2.requestFocus();
    window2.发送的文本.requestFocus();
});

window2.走势按钮.setOnTouchListener(function (view, event) {
    switch (event.getAction()) {
        case event.ACTION_DOWN:
            x = event.getRawX();
            y = event.getRawY();
            windowX = window2.getX();
            windowY = window2.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //移动手指时调整悬浮窗位置
            window2.setPosition(windowX + (event.getRawX() - x),
                windowY + (event.getRawY() - y));
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                let 按钮内容 = window2.走势按钮.text()
                if (按钮内容 == "取消编辑") {
                    window2.disableFocus();
                    window2.走势按钮.setText("走势")
                }
            }
            return true;
    }
    return true;
});
window2.纠错按钮.setOnTouchListener(function (view, event) {
    switch (event.getAction()) {
        case event.ACTION_DOWN:
            x = event.getRawX();
            y = event.getRawY();
            windowX = window2.getX();
            windowY = window2.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //移动手指时调整悬浮窗位置
            window2.setPosition(windowX + (event.getRawX() - x),
                windowY + (event.getRawY() - y));
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                main_threads.setTimeout(() => {
                    一键纠错()
                }, 10)
            }
            return true;
    }
    return true;
});


window.setPosition(700, 150)
window2.setPosition(200, 150)
// window.setAdjustEnabled(true)
window.当前用户.setOnTouchListener(function (view, event) {
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
                // 加余额();
            }
            return true;
    }
    return true;
});
window.识别余额.setOnTouchListener(function (view, event) {
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
                设置余额();
            }
            return true;
    }
    return true;
});
window.加余额.setOnTouchListener(function (view, event) {
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
                加余额();
            }
            return true;
    }
    return true;
});

window.减余额.setOnTouchListener(function (view, event) {
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
                减余额();
            }
            return true;
    }
    return true;
});


window.所有信息.setOnTouchListener(function (view, event) {
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
                所有信息();
            }
            return true;
    }
    return true;
});
window.清空数据.setOnTouchListener(function (view, event) {
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
                清空数据();
            }
            return true;
    }
    return true;
});
window.固定文字.setOnTouchListener(function (view, event) {
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
                固定文字();
            }
            return true;
    }
    return true;
});
window.清空走势.setOnTouchListener(function (view, event) {
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
                清空走势();
            }
            return true;
    }
    return true;
});
window.发送流水.setOnTouchListener(function (view, event) {
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
                发送流水();
            }
            return true;
    }
    return true;
});
window.全自动开关.setOnTouchListener(function (view, event) {
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
                let 当前文本 = window.全自动开关.getText()
                if (当前文本 == "全自动:关") {
                    ui.run(() => {
                        window.全自动开关.setText("全自动:开")
                    })
                    toast("全自动已开启")
                    全自动开启 = true
                } else {
                    ui.run(() => {
                        window.全自动开关.setText("全自动:关")
                    })
                    toast("全自动已关闭")
                    全自动开启 = false
                }
                // log()
            }
            return true;
    }
    return true;
});
window.使用微信发送.setOnTouchListener(function (view, event) {
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
                使用微信发送()
                window.disableFocus();

            }
            return true;
    }
    return true;
});

function 清空走势() {
    log(arguments.callee.name)
    let value = dialogs.confirm("确定清空?")
    if (value) {
        storage.put("所有用户走势", [])
        log("已清空")
        将走势刷新()
    }
}
function 固定文字() {
    log(arguments.callee.name)
    dialogs.rawInput("请输入固定文字", "", (value) => {
        if (value != -1) {
            storage.put("固定文字", value)
        } else {
            toast("取消")
        }

    });
}

function 详情(内容) {
    let 当前时间 = new Date()
    return "" + (当前时间.getMonth() + 1) + "-" + 当前时间.getDate() + "  " + 当前时间.getHours() + ":" + 当前时间.getMinutes() + "  " + 内容// 使用时间戳

    // this.创建时间 = "" + (当前时间.getMonth() + 1) + "-" + 当前时间.getDate() + "  " + 当前时间.getHours() + ":" + 当前时间.getMinutes() + ":" + 当前时间.getSeconds()// 使用时间戳
    // this.内容 = 内容
}


function 所有走势() {

    this.所有走势数据 = storage.get("所有用户走势", [])
    function 用户(用户名) {
        this.用户名 = 用户名
        this.用户走势 = []
    }

    /**
     * 返回用户序号
     */
    this.查找指定用户 = function (用户名) {
        this.所有走势数据 = storage.get("所有用户走势", [])
        for (let index = 0; index < this.所有走势数据.length; index++) {
            let element = this.所有走势数据[index];
            if (element.用户名 == 用户名) {
                return index
            }
        }
        let ret = this.所有走势数据.push(new 用户(用户名)) - 1
        storage.put("所有用户走势", this.所有走势数据)
        return ret

    }
    this.添加走势 = function (用户名, 新数据) {
        this.所有走势数据 = storage.get("所有用户走势", [])
        let index = this.查找指定用户(用户名)
        this.所有走势数据[index].用户走势.push(新数据)
        storage.put("所有用户走势", this.所有走势数据)
    }
    this.获取用户走势 = function (用户名) {
        this.所有走势数据 = storage.get("所有用户走势", [])
        let index = this.查找指定用户(用户名)
        let 当前走势数据 = this.所有走势数据[index].用户走势
        if (当前走势数据.length > 20) {
            log("大于20个")
            当前走势数据 = 当前走势数据.slice(当前走势数据.length - 20)
            this.所有走势数据[index].用户走势 = 当前走势数据
            storage.put("所有用户走势", this.所有走势数据)
        }
        return 当前走势数据
    }
}

function 所有流水() {

    this.所有流水数据 = storage.get("所有用户流水", [])
    function 用户(用户名) {
        this.用户名 = 用户名
        this.用户流水 = []
    }

    /**
     * 返回用户序号
     */
    this.查找指定用户 = function (用户名) {
        this.所有流水数据 = storage.get("所有用户流水", [])
        for (let index = 0; index < this.所有流水数据.length; index++) {
            let element = this.所有流水数据[index];
            if (element.用户名 == 用户名) {
                return index
            }
        }
        let ret = this.所有流水数据.push(new 用户(用户名)) - 1
        storage.put("所有用户流水", this.所有流水数据)
        return ret

    }
    this.添加流水 = function (用户名, 新数据) {
        log("添加流水")
        log(用户名)
        log(新数据)
        this.所有流水数据 = storage.get("所有用户流水", [])
        let index = this.查找指定用户(用户名)
        this.所有流水数据[index].用户流水.push(新数据)
        storage.put("所有用户流水", this.所有流水数据)
    }
    this.获取用户流水 = function (用户名) {
        this.所有流水数据 = storage.get("所有用户流水", [])
        let index = this.查找指定用户(用户名)
        let 当前流水数据 = this.所有流水数据[index].用户流水
        log("获取流水数据")
        log(用户名)
        log(当前流水数据)
        return 当前流水数据
    }
    this.删除流水 = function (用户名) {
        this.所有流水数据 = storage.get("所有用户流水", [])
        let index = this.查找指定用户(用户名)
        this.所有流水数据[index].用户流水 = []
        storage.put("所有用户流水", this.所有流水数据)
    }
    this.删除所有用户流水 = function () {
        storage.put("所有用户流水", [])
    }
}

//type 文字
function 支付宝消息(type, data) {
    this.type = type
    this.data = data
    this.yd = false
}

function 用户(用户名) {
    this.用户名 = 用户名
    this.累计盈亏 = 0//
    this.详情数据 = []//详情数组
    this.支付宝聊天页列表 = []
    this.余额 = 0

}
function 全部数据管理器() {
    this.所有数据 = storage.get("所有信息", [])
    this.清空数据 = function () {
        storage.put("所有信息", [])
    }

    this.设置余额 = function (值) {
        this.所有数据 = storage.get("所有信息", [])
        let index = this.查找指定用户(G_当前用户)
        this.所有数据[index].余额 = Number(值)
        G_当前余额 = this.所有数据[index].余额
        log("设置当前余额")
        storage.put("所有信息", this.所有数据)
    }
    this.获取余额 = function () {
        this.所有数据 = storage.get("所有信息", [])
        let index = this.查找指定用户(G_当前用户)
        if (!this.所有数据[index].余额) {
            this.所有数据[index].余额 = 0
        }
        G_当前余额 = this.所有数据[index].余额
        storage.put("所有信息", this.所有数据)
    }
    this.加余额 = function (值) {
        this.所有数据 = storage.get("所有信息", [])
        let index = this.查找指定用户(G_当前用户)
        let 本次详情 = 详情("增加:" + 值)
        this.所有数据[index].详情数据.push(本次详情)
        this.所有数据[index].余额 = this.所有数据[index].余额 + Number(值)
        G_当前余额 = this.所有数据[index].余额
        this.所有数据[index].累计盈亏 -= Number(值)
        storage.put("所有信息", this.所有数据)
    }
    this.减余额 = function (值) {
        this.所有数据 = storage.get("所有信息", [])

        let index = this.查找指定用户(G_当前用户)
        let 本次详情 = 详情("减少:" + 值)
        this.所有数据[index].详情数据.push(本次详情)
        this.所有数据[index].余额 = this.所有数据[index].余额 - Number(值)
        G_当前余额 = this.所有数据[index].余额
        this.所有数据[index].累计盈亏 += Number(值)
        storage.put("所有信息", this.所有数据)
    }
    this.查找指定用户 = function (用户名) {
        this.所有数据 = storage.get("所有信息", [])
        log(this.所有数据 instanceof Array)
        for (let index = 0; index < this.所有数据.length; index++) {
            let element = this.所有数据[index];
            if (element.用户名 == 用户名) {
                return index
            }
        }
        let ret = this.所有数据.push(new 用户(用户名)) - 1
        storage.put("所有信息", this.所有数据)
        return ret

    }
    this.显示所有信息 = function () {
        this.所有数据 = storage.get("所有信息", [])
        let all_info_str = ""
        for (let index = 0; index < this.所有数据.length; index++) {
            let element = this.所有数据[index];
            all_info_str += element.用户名 + ":总盈亏 " + element.累计盈亏 + "\n"
            for (let index2 = 0; index2 < element.详情数据.length; index2++) {
                let element2 = element.详情数据[index2];
                all_info_str += element2 + "\n"
            }
            all_info_str += "\n"
        }
        return all_info_str

    }
    this.添加消息 = function (type, data) {
        this.所有数据 = storage.get("所有信息", [])
        let index = this.查找指定用户(G_当前用户)
        let 本次消息 = 支付宝消息(type, data)
        if (!this.所有数据[index].支付宝聊天页列表) {
            this.所有数据[index].支付宝聊天页列表 = []
        }
        this.所有数据[index].支付宝聊天页列表.push(本次消息)
        storage.put("所有信息", this.所有数据)
    }
    this.检查消息是否已处理 = function (type, data) {
        this.所有数据 = storage.get("所有信息", [])
        let index = this.查找指定用户(G_当前用户)
        let 本次消息 = 支付宝消息(type, data)
        if (!this.所有数据[index].支付宝聊天页列表) {
            this.所有数据[index].支付宝聊天页列表 = []
        }
        let array = this.所有数据[index].支付宝聊天页列表
        for (let index = 0; index < array.length; index++) {
            let element = array[index];
            if (本次消息.type == element.type && 本次消息.data == element.data) {

            }
        }
        this.所有数据[index].支付宝聊天页列表.push(本次消息)
        storage.put("所有信息", this.所有数据)
    }
}
function isObjectValueEqual(a, b) {

    //取对象a和b的属性名

    var aProps = Object.getOwnPropertyNames(a);

    var bProps = Object.getOwnPropertyNames(b);

    //判断属性名的length是否一致

    if (aProps.length != bProps.length) {

        return false;

    }

    //循环取出属性名，再判断属性值是否一致

    for (var i = 0; i < aProps.length; i++) {

        var propName = aProps[i];

        if (a[propName] != b[propName]) {

            return false;

        }

    }

    return true;

}
//将这个订单解析为包含金额和备注的信息存储到不可删除自管理长度的对象内部去
function 自管理数据管理器() {
    /**
     * 返回金额/备注   次数
     */
    this.获取用户最后点击的订单金额和备注 = function (用户名) {
        let 所有用户的已点击消息 = storage.get("所有用户的已点击消息", new Object())
        if (!所有用户的已点击消息[用户名]) {//该用户没有信息
            return "没有记录"
        }
        //存在数据则必然有一个数据
        var jishu = 1
        //所有用户的已点击消息[用户名] 是数组
        //统计最后一个有几个相同的
        var 最后指针 = 所有用户的已点击消息[用户名].length - 1
        if (所有用户的已点击消息[用户名].length > 1) {
            for (let index = 所有用户的已点击消息[用户名].length - 2; index >= 0; index--) {
                let element = 所有用户的已点击消息[用户名][index];
                if (element.金额 == 所有用户的已点击消息[用户名][最后指针].金额 && element.备注 == 所有用户的已点击消息[用户名][最后指针].备注) {
                    jishu += 1
                } else {
                    break
                }
            }
        }
        return new String(所有用户的已点击消息[用户名][最后指针].金额).concat("/").concat(所有用户的已点击消息[用户名][最后指针].备注).concat("   ").concat(jishu).toString()
    }
    this.添加用户点击的订单金额和备注 = function (用户名, 金额, 备注) {
        log("添加新的金额备注到自管理" + "--" + 用户名 + "--" + 金额 + "--" + 备注)
        let 所有用户的已点击消息 = storage.get("所有用户的已点击消息", new Object())
        if (!所有用户的已点击消息[用户名]) {//该用户没有信息
            所有用户的已点击消息[用户名] = []
        }
        if (所有用户的已点击消息[用户名].length > 20) {
            所有用户的已点击消息[用户名].shift()
        }
        所有用户的已点击消息[用户名].push({ 金额: String(金额), 备注: String(备注) })
        storage.put("所有用户的已点击消息", 所有用户的已点击消息)
        //存在数据则必然有一个数据
        最后一次点击的信息 = 全部自管理数据.获取用户最后点击的订单金额和备注(G_当前用户)
    }
    /**
     * 返回传入列表里匹配到的最后一个的指针
     */
    this.比对位置 = function (用户名, 聊天页面金额和备注的列表) {
        let 所有用户的已点击消息 = storage.get("所有用户的已点击消息", new Object())
        if (!所有用户的已点击消息[用户名]) {//该用户没有信息
            log("该用户没有已记录信息")
            return -1//没有信息时直接返回0告诉传入的第一个就可以
        }
        var array = 所有用户的已点击消息[用户名]
        log("当前用户所有已记录的聊天列表:")
        log(array)
        log("传入的列表:")
        log(聊天页面金额和备注的列表)
        var 匹配位置 = -1
        for (a_pianyi = array.length - 聊天页面金额和备注的列表.length; a_pianyi < array.length; a_pianyi++) {
            let ok = true
            let b_pianyi = 0
            for (; b_pianyi < 聊天页面金额和备注的列表.length && a_pianyi + b_pianyi < array.length; b_pianyi++) {
                if (! isObjectValueEqual(array[a_pianyi + b_pianyi], 聊天页面金额和备注的列表[b_pianyi])) {
                    ok = false
                    break
                }
            }
            if (ok) {
                log("array偏移:" + a_pianyi)
                log("聊天页面金额和备注的列表偏移:" + (b_pianyi - 1))
                匹配位置 = b_pianyi - 1
                break
            }
        }
        /*
        for (let 已记录列表指针位置 = array.length - 1; 已记录列表指针位置 >= 0; 已记录列表指针位置--) {
            let element = array[已记录列表指针位置];
            if (聊天页面金额和备注的列表[0].金额 == element.金额 && 聊天页面金额和备注的列表[0].备注 == element.备注) {
                let 匹配成功 = true
                for (let 传入列表指针位置 = 0; 传入列表指针位置 < 聊天页面金额和备注的列表.length && 已记录列表指针位置 + 传入列表指针位置 < array.length; 传入列表指针位置++) {
                    let element2 = 聊天页面金额和备注的列表[传入列表指针位置];
                    if (array[已记录列表指针位置 + 传入列表指针位置].金额 != element2.金额 || array[已记录列表指针位置 + 传入列表指针位置].备注 != element2.备注) {
                        匹配成功 = false
                        break
                    }
                }
                if (匹配成功) {
                    匹配位置 = array.length - 已记录列表指针位置 - 1
                    break
                }
            }
        }
        */
        return 匹配位置
    }
    this.清除指定用户数据 = function (用户名) {
        let 所有用户的已点击消息 = storage.get("所有用户的已点击消息", new Object())
        所有用户的已点击消息[用户名] = undefined
        storage.put("所有用户的已点击消息", 所有用户的已点击消息)
    }
    this.获取用户列表 = function (用户名) {
        let 所有用户的已点击消息 = storage.get("所有用户的已点击消息", new Object())

        return 所有用户的已点击消息[用户名]
    }
    this.用户列表位置交换 = function (用户名, x1, x2) {
        let 所有用户的已点击消息 = storage.get("所有用户的已点击消息", new Object())
        let bak = 所有用户的已点击消息[用户名][x1]
        所有用户的已点击消息[用户名][x1] = 所有用户的已点击消息[用户名][x2]
        所有用户的已点击消息[用户名][x2] = bak
        storage.put("所有用户的已点击消息", 所有用户的已点击消息)
    }

}

function 切换目标窗口(APP) {
    for (let index = 0; index < 30; index++) {
        let array = auto.windows
        for (let index = 0; index < array.length; index++) {
            let windows = array[index];
            if (APP == "微信" && windows.title == "微信") {
                auto.setWindowFilter(function (windows) {
                    return windows.title == "微信"
                })
                toastLog("已成功切换到微信")
                return true
            } else if (APP == "支付宝") {
                if (windows.title == "支付宝") {
                    auto.setWindowFilter(function (windows) {
                        return windows.title == "支付宝"
                    })
                    // log("已成功切换到支付宝")
                    return true
                } else if (windows.title == "朋友") {
                    auto.setWindowFilter(function (windows) {
                        return windows.title == "朋友"
                    })
                    // log("已成功切换到支付宝")
                    return true
                }
            }
        }
        sleep(50)
    }

    toastLog("切换失败:无" + APP + "窗口")
}

function 查找微信用户(用户名) {
    function 滑动方法() {
        if (!text('发现').findOne(1000)) {
            log(auto.root)
            toastLog("界面错误")
            return false
        }
        let 上滑完成 = false, 下滑完成 = false
        while (true) {
            if (text(用户名).className("android.view.View").exists()) {
                click(用户名)

                return true
            }
            let 聊天列表 = className("android.widget.ListView").indexInParent(1).scrollable().findOne(100)
            if (!聊天列表) {
                试着刷新()
                continue
            }
            if (!聊天列表.scrollUp()) {
                上滑完成 = true
            }
            if (聊天列表.childCount() > 0 && 聊天列表.child(0) != null && 聊天列表.child(0).className() == "android.widget.RelativeLayout") {
                上滑完成 = true

            }
            if (上滑完成 && !聊天列表.scrollDown()) {
                下滑完成 = true
            }
            if (下滑完成) {
                log(用户名 + "未找到")
                return false
            }
            sleep(100)
        }
    }
    function 搜索方法() {
        if (text('发现').exists()) {
            let 搜索按钮 = text("微信").indexInParent(0).className("TextView").depth(16).findOne().parent().child(1).child(0).bounds()
            log(click(搜索按钮.centerX(), 搜索按钮.centerY()))
            sleep(400)
        }
        let 联系人 = 用户名
        let edit = className("EditText").findOne()
        edit.click()
        edit.setText(联系人)
        sleep(400)
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
        if (当前昵称 != null && 当前昵称.parent().parent().child(1).child(0).text() == G_当前用户) {
            return true
        }
        desc("返回").findOne().parent().click()
        // back()
        log("返回")
        sleep(200)
    }
    试着刷新()

    return 搜索方法()


}
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
function 推送消息给websocket(TAG, 消息) {
    let yq = 查找引擎("websocket.js")
    if (yq) {
        yq.emit(TAG, 消息)
    } else {
        toastLog("websocket引擎不存在")
    }

}
function 发送(str, 是否发送) {
    // lock.lock()
    // 消息发送完成 = false
    // log("消息发送完成false")
    // 切换目标窗口("微信")
    // lock.unlock()
    // 发送信息(str, 是否发送)
    // 消息发送完成 = true

    function 显示消息到悬浮窗(str) {
        ui.run(() => {
            window2.发送的文本.setText(str)
            log("恢复绿色")
            window2.走势按钮.attr("bg", "#E0FFFF")
        })
    }
    //需要立即发送的则不显示到悬浮窗
    if (是否发送) {
        立即发送(str)
        
    } else {
        显示消息到悬浮窗(str)
    }
    function 发送信息(str, 是否发送) {

        if (!查找微信用户(G_当前用户)) {
            toastLog("找不到微信用户,请手动填写信息")
            setClip(str)
            return
        }
        sleep(700)
        let 输入框 = className("EditText").find()
        log("本次输入:" + str)
        if (输入框) {
            输入框.setText(str)
        } else {
            toastLog("找不到输入框")
        }
        // lock.lock()
        // 消息发送完成 = true
        // lock.unlock()
        if (是否发送) {
            let send = clickable().text("发送").findOne(1500)
            send ? send.click() : toastLog("没找到发送按钮")
        } else {
            log("不发送")
        }
    }


}


function 设置余额() {
    log(arguments.callee.name)
    dialogs.input("请输入设置的余额", "", (value) => {
        if (value != -1 && Number.isSafeInteger(value)) {
            log(value)
            全部数据.设置余额(value)
            ui.run(() => {
                window.识别余额.setText("余额:" + G_当前余额)
                window.当前用户.setText("昵称:" + G_当前用户)
            })
            let str = "￥" + G_当前余额
            
            发送(str, true)
            
        } else {
            toast("取消")
        }
    })
}
function 加余额() {
    log(arguments.callee.name)
    dialogs.input("请输入增加的值", "", (value) => {
        if (value != -1) {
            if (!Number.isInteger(value)) {
                return
            }
            全部数据.加余额(parseInt(value))

            let str = "￥" + (G_当前余额)
            
            发送(str, true)
            
        } else {
            toast("取消")
        }
    })
}


function 减余额() {
    log(arguments.callee.name)
    dialogs.input("请输入减少的值", "", (value) => {
        log(value)
        if (value != -1) {
            if (!Number.isInteger(value)) {
                return
            }
            全部数据.减余额(parseInt(value))
            let str = "￥" + (G_当前余额)
            
            发送(str, true)
            
        } else {
            toast("取消")
        }
    })
}

function 所有信息() {
    log(arguments.callee.name)
    let str = 全部数据.显示所有信息()
    let ss = className("EditText").findOne(100)
    ss ? ss.setText(str) : toast("无输入框")
}

function 清空数据() {
    log(arguments.callee.name)
    let value = dialogs.confirm("确定清空?")
    if (value) {
        全部数据.清空数据()
        全部流水.删除所有用户流水()
    } else {
        toast("取消操作")
    }
}



function 立即发送(str) {
    let 本次发送 = { code: "task", data: { WX: { WX端编号: WX端编号, msg: { 用户: G_当前用户, 消息: str } }, SERVER: G_订单详情 } }
    // 消息发送完成 = true
    log("本次发送:")
    log(本次发送)
    log(JSON.stringify(本次发送))
    推送消息给websocket("msg", JSON.stringify(本次发送))
}
function 使用微信发送() {
    // lock.lock()
    // 消息发送完成 = false
    // log("消息发送完成false")
    // 切换目标窗口("微信")
    let str = window2.发送的文本.text()
    if (str == 输入框默认消息) {
        return
    }
    if (全自动开启) {
        main_threads.setTimeout(() => {
            发送后处理()
        }, 10 )
    }
    解析信息(str)
    立即发送(str)

    ui.run(() => {
        window2.走势按钮.attr("bg", "#00FF00")
    })

    // lock.unlock()
    function 解析信息(信息) {
        let 余额开始位置 = 信息.indexOf("￥")
        // let 余额结束位置 = 信息.indexOf("￥")
        if (余额开始位置 != -1) {
            let 余额 = 信息.substr(余额开始位置 + 1)
            log(余额)
            全部数据.设置余额(余额)
        }
        let 流水信息标记 = 信息.indexOf("总盈亏")
        if (流水信息标记 != -1) {
            log("这是走势信息")
            将走势刷新()
        }

    }
    function 读取信息() {

        if (!查找微信用户(G_当前用户)) {
            toastLog("找不到微信用户")
            // setClip(str)
            return
        }
        // sleep(500)
        let 输入框 = className("EditText").findOne(500)
        if (输入框) {
            let 信息 = 输入框.text()
            log("本次读取的内容:" + 信息)
            let 余额开始位置 = 信息.indexOf("余额")
            let 余额结束位置 = 信息.indexOf("￥")
            let 余额 = 信息.substr(余额开始位置 + 2, 余额结束位置 - 余额开始位置 - 2)
            log(余额)
            全部数据.设置余额(余额)
        } else {
            toastLog("找不到输入框")
        }

        let send = clickable().text("发送").findOne(1500)
        send ? send.click() : toastLog("没找到发送按钮")
        return


    }
}

function 返回到朋友页() {
    for (let index = 0; index < 3; index++) {
        let 返回 = desc("返回").clickable().findOne(250)
        if (返回) {
            返回.click()
            sleep(150)
        }
    }
}

function 发送后处理() {
    log(arguments.callee.name)
    // let 返回 = desc("返回").clickable().findOne()
    // 返回.click()

    sleep(200)

    let bs = desc("返回").findOne(200)
    if (bs) {
        log("有返回")
        bs.click()
        sleep(50)
    }
    //判断是否回到了朋友页面
    if (text("朋友").packageName("com.eg.android.AlipayGphone").findOne(200)) {
        log("已回到朋友页面")
        return
    }

    let 查看转账记录 = desc("查看转账记录").findOne(1000)
    if (查看转账记录) {
        log("有查看转账记录")
        查看转账记录.click()
    } else {
        log("无查看转账记录")
        toastLog('处理错误,请手动回到朋友页面')
        return false
    }
    let 顺序位置 = 获取当前列表并比对()
    if (顺序位置) {
        log('比对成功')
        log(顺序位置.列表)
        //分割列表 
        let array = 顺序位置.列表.slice(顺序位置.pipei + 1)
        log(array)
        for (let index = 0; index < array.length; index++) {
            let element = array[index];
            全部自管理数据.添加用户点击的订单金额和备注(G_当前用户, element.金额, element.备注)
        }
    } else {
        log("顺序位置.顺序位置2错误")
    }
    返回到朋友页()
}

function 一键纠错() {
    desc("查看转账记录").findOne().click()
    id("bill_object_listView").waitFor()
    if (text("近期无记录").findOne(300)) {
        toastLog("近期无记录")
        return false
    }
    className("android.widget.LinearLayout").row(1).waitFor()
    let returninfo = 获取收款列表()
    let array = returninfo.所有列表
    array = array.reverse()
    log("以下信息将被直接添加到末尾")
    log(array)
    for (let index = 0; index < array.length; index++) {
        let element = array[index];
        全部自管理数据.添加用户点击的订单金额和备注(G_当前用户, element.金额, element.备注)
    }
    返回到朋友页()
}


// var 聊天列表页处理线程 = null;
function 解析符合条件的子元素(聊天列表根元素) {
    let 符合条件的子元素 = []
    let 所有子元素 = 聊天列表根元素.children()
    for (let index = 0; index < 所有子元素.length; index++) {
        let element = 所有子元素[index];
        // log(element.className())
        let element_bak = element
        if (element && element.childCount() == 1) {
            element = element.child(0)
            // log(element.childCount())
            if (element && element.childCount() == 3 && element.child(0).className() == "android.widget.FrameLayout" && element.child(1).className() == "android.widget.RelativeLayout" && element.child(2).className() == "android.widget.LinearLayout") {
                let 标题名字 = element.findOne(id("item_name"))
                if (标题名字) {
                    标题名字 = 标题名字.text()
                } else {
                    continue
                }
                // log(标题名字)
                if (标题名字 && 聊天页黑名单.indexOf(标题名字) == -1) {
                    if (element.findOne(id("msgText"))) {
                        log(标题名字 + ":有消息")
                        符合条件的子元素.push(element_bak)
                        break;
                    } else {
                        // log(标题名字 + ":没有消息")
                    }
                } else {
                    // log("黑名单内")
                }

            } else {
                // log('该元素不符合条件')
            }
        } else {
            // log("该元素子元素不是1")
        }
    }
    return 符合条件的子元素
}
function 解析消息列表() {
    var 第一页列表 = []
    var 页数 = 1
    let 消息列表 = id("chat_msg_list").packageName("com.eg.android.AlipayGphone").findOne(1)
    if (!消息列表) {
        return
    }
    //向下翻页到底
    while (消息列表.scrollDown()) {
        sleep(200)
    }
    获取页(1)
    log("翻页前列表")
    log(第一页列表)
    if (第一页列表[第一页列表.length - 1].金额 == 第一页列表[第一页列表.length - 2].金额 && 第一页列表[第一页列表.length - 1].金额 == 第一页列表[第一页列表.length - 3].金额 && 第一页列表[第一页列表.length - 1].备注 == 第一页列表[第一页列表.length - 2].备注 && 第一页列表[第一页列表.length - 1].备注 == 第一页列表[第一页列表.length - 3].备注) {
        //转储原数据
        let bak = 第一页列表.concat()
        第一页列表 = []
        消息列表.scrollUp()
        sleep(300)
        获取页()
        消息列表.scrollDown()
        // sleep(200)
        // 获取页(2)
        第一页列表.pop()//移除上一页的最后一个元素
        第一页列表 = 第一页列表.concat(bak)
        // 第一页列表 = bak
        页数 = 2
    }



    function 获取页() {
        消息列表 = id("chat_msg_list").packageName("com.eg.android.AlipayGphone").findOne(1)
        let 子消息个数 = 消息列表.childCount()
        for (let index = 0; index < 子消息个数; index++) {
            let element = 消息列表.child(index);
            let money_text = element.findOne(id("biz_title"))
            let one_msg = {}
            if (money_text) {
                money_text = money_text.text()
                money_text = money_text.substr(4, money_text.length - 8)
                // log("金额")
                // log(money_text)
                one_msg.金额 = money_text
            } else {
                log("无金额")
            }
            let remarks = element.findOne(id("biz_mid_title"))
            if (remarks) {
                // log("备注")
                // log(remarks.text())
                one_msg.备注 = remarks.text()
            } else {
                log("无备注")
            }

            第一页列表.push(one_msg)

        }
    }

    //分析
    log("最终第一页列表")
    log(第一页列表)
    return { 页数: 页数, 列表: 第一页列表 }
}


function loop_serch() {

    if (descMatches(/^2020\d+/).findOne(1)) {
        log("desc模式,请升级ZFB")
        exit()
        return descMatches(/^2020\d+/).findOne(1).desc()
    } else if (textMatches(/^2020\d+/).findOne(1)) {
        let 订单号锚点 = textMatches(/^2020\d+/).findOne(1)
        let 订单号 = 订单号锚点.text()
        log("订单号:" + 订单号)
        let 订单号后5位 = 订单号.substr(订单号.length - 5, 5)
        log("订单号后5位:" + 订单号后5位)
        let 收款理由锚点 = text("收款理由").findOne(1)
        let 收款理由 = 收款理由锚点.parent().child(收款理由锚点.indexInParent() + 1).child(0).text()
        log("收款理由:" + 收款理由)
        let 对方账户 = 收款理由锚点.parent().child(收款理由锚点.indexInParent() + 3).child(0).text()
        let 收款人 = 收款理由锚点.parent().child(0).text()
        let 创建时间 = 收款理由锚点.parent().child(收款理由锚点.indexInParent() + 5).child(0).text()
        log("收款人:" + 收款人)
        let 收款金额 = 收款理由锚点.parent().child(1).text()
        收款金额 = 收款金额.substr(1, 收款金额.length - 4)
        收款金额 = 收款金额.replace(",", "")
        log("收款金额:" + 收款金额)
        return {
            订单号: 订单号,
            订单号后5位: 订单号后5位,
            收款理由: 收款理由,
            收款金额: 收款金额,
            收款人: 收款人,
            对方账户: 对方账户,
            创建时间: 创建时间
        }
    }

}






function 查找订单号等数据() {

    let 订单详情 = loop_serch()
    if (! /^([0-9]{1,5}|龙|虎|合)$/.test(订单详情.收款理由)) {
        toastLog("无效收款")
        return "无效收款"
    }
    //将订单详情发送到服务器
    G_订单详情 = 订单详情
    if (parseInt(订单详情.收款金额) > G_当前余额) {
        return "超额无效，请补充余额"
    }
    //排除掉重复的字符串
    let 筛选数组 = 订单详情.收款理由.split("")
    if (筛选数组.distinct().length < 订单详情.收款理由.length) {
        log("有重复的")
        return "无效收款"
    }
    // log(订单详情)

    let last_5_arr = 订单详情.订单号后5位.split("")
    // 解析龙虎合
    let 龙虎合标记 = ""
    if (last_5_arr[0] > last_5_arr[4]) {
        龙虎合标记 = "虎"
    } else if (last_5_arr[0] < last_5_arr[4]) {
        龙虎合标记 = "龙"
    } else {
        龙虎合标记 = "合"
    }
    //解析余额
    function 次数查找(str, serch_str) {
        if (serch_str.length == 1) {
            var index = str.indexOf(serch_str); // 字符出现的位置
            var num = 0; // 这个字符出现的次数
            while (index !== -1) {
                num++; // 每出现一次 次数加一
                index = str.indexOf(serch_str, index + serch_str.length); // 从字符串出现的位置的下一位置开始继续查找
            }
            return num
        } else {
            var 待查找的字符数组 = serch_str.split("")
            let 计数器 = 0
            for (let index = 0; index < 待查找的字符数组.length; index++) {
                let element = 待查找的字符数组[index];
                if (str.indexOf(element) != -1) {
                    计数器 += 1
                }
            }
            if (计数器 == 待查找的字符数组.length) {
                return true
            } else {
                return false
            }
        }





    }

    


    let 出现次数 = 次数查找(订单详情.订单号后5位, 订单详情.收款理由)
    log("出现次数:" + 出现次数)
    let 倍数 = -1
    log("理由长度:" + 订单详情.收款理由.length)
    var 是龙虎合收款理由 = 0
    //解析倍数
    if (订单详情.收款理由.length == 1) {
        //处理龙虎合
        if (订单详情.收款理由 == "龙" || 订单详情.收款理由 == "虎" || 订单详情.收款理由 == "合") {
            是龙虎合收款理由 = 1
            if (龙虎合标记 == 订单详情.收款理由) {
                if (龙虎合标记 == "合") {
                    倍数 = 7
                } else {
                    倍数 = 1

                }
            } else {
                log("未匹配到")
            }
        } else {
            log("不是龙虎合")
        }
        if (出现次数 == 1) {
            倍数 = 1
        } else if (出现次数 == 2) {
            倍数 = 2
        } else if (出现次数 == 3) {
            倍数 = 4
        } else if (出现次数 == 4) {
            倍数 = 9
        } else if (出现次数 == 5) {
            倍数 = 15
        }

    } else if (订单详情.收款理由.length == 2) {
        if (出现次数) {
            倍数 = 3
        }
    } else if (订单详情.收款理由.length == 3) {
        if (出现次数) {
            倍数 = 16
        }
    } else if (订单详情.收款理由.length == 4) {
        if (出现次数) {
            倍数 = 49
        }
    }

    log("倍数 = " + 倍数)
    log("计算前余额:" + G_当前余额)
    余额 = parseInt(G_当前余额) + parseInt(订单详情.收款金额) * 倍数
    log("余额：" + 余额)
    // let 最终字符串 = 订单详情.订单号后5位 + 龙虎合标记 + "-----余额" + 余额
    // log(最终字符串)


    //处理走势
    var 所有订单号 = storage.get("所有订单号", [])
    if (所有订单号.length > 5000) {
        所有订单号 = 所有订单号.slice(所有订单号.length - 5000)
        storage.put("所有订单号", 所有订单号)
    }
    if (所有订单号.indexOf(订单详情.订单号) == -1) {
        toastLog("该订单未被记录")
        let 龙虎合图标 = ""
        if (龙虎合标记 == "龙") {
            龙虎合图标 = 龙标记
        } else if (龙虎合标记 == "虎") {
            龙虎合图标 = 虎标记

        } else if (龙虎合标记 == "合") {
            龙虎合图标 = 合标记
        }
        全部走势.添加走势(G_当前用户, 订单详情.订单号后5位 + 龙虎合图标)
        全部流水.添加流水(G_当前用户, [是龙虎合收款理由, parseInt(订单详情.收款金额)])
        所有订单号.push(订单详情.订单号)
        storage.put("所有订单号", 所有订单号)
    } else {
        toastLog("该订单已被记录")
    }

    


    let 最终字符串 = storage.get("固定文字", "")
    let 当前用户所有走势 = 全部走势.获取用户走势(G_当前用户)
    for (let index = 0; index < 当前用户所有走势.length; index++) {
        let element = 当前用户所有走势[index];
        if (index % 3 == 0) {
            最终字符串 += "\n"
        }
        最终字符串 += element + " "
    }
    最终字符串 += "\n"
    最终字符串 += "￥" + 余额

    return 最终字符串


}

function 将走势刷新() {
    let 最终字符串 = storage.get("固定文字", "")
    let 当前用户所有走势 = 全部走势.获取用户走势(G_当前用户)
    for (let index = 0; index < 当前用户所有走势.length; index++) {
        let element = 当前用户所有走势[index];
        if (index % 3 == 0) {
            最终字符串 += "\n"
        }
        最终字符串 += element + " "
    }
    最终字符串 += "\n"
    最终字符串 += "￥" + G_当前余额
    ui.run(() => {
        window2.发送的文本.setText(最终字符串)
        window2.走势按钮.attr("bg", "#E0FFFF")

    })
}

function 组合流水() {
    log(arguments.callee.name)
    let 当前用户流水 = 全部流水.获取用户流水(G_当前用户)
    let 数字收款总水 = 0, 龙虎收款总水 = 0, 收款平均值 = 0, 总计收款 = 0, 收款次数 = 当前用户流水.length
    for (let index = 0; index < 当前用户流水.length; index++) {
        let 每个流水 = 当前用户流水[index];
        总计收款 += 每个流水[1]
        if (每个流水[0] == 0) {//数字
            数字收款总水 += 每个流水[1]
        } else {//龙湖
            龙虎收款总水 += 每个流水[1]
        }
    }
    if (收款次数 == 0) {
        收款平均值 = 0
    } else {
        收款平均值 = parseInt(总计收款 / 收款次数)
    }
    let index = 全部数据.查找指定用户(G_当前用户)
    let 所有数据 = storage.get("所有信息", [])
    let 盈亏信息 = 所有数据[index].累计盈亏
    let 最终字符串 = "用户名:" + G_当前用户 + "\n" + "数字收款总水:" + 数字收款总水 + "\n" + "龙虎收款总水:" + 龙虎收款总水 + "\n" + "收款次数:" + 收款次数 + "\n" + "收款平均值:" + 收款平均值 + "\n" + "总计收款:" + 总计收款 + "\n" + "总盈亏:" + 盈亏信息
    return 最终字符串

}

function 发送流水() {
    log(arguments.callee.name)
    let str = 组合流水()
    
    发送(str)
    
}

function 获取余额() {
    let 消息列表 = id("chat_msg_list").packageName("com.eg.android.AlipayGphone").findOne(1)
    if (!消息列表) {
        return
    }
    let 消息列表个数 = 消息列表.childCount()
    for (let index = 消息列表个数 - 1; index >= 0; index--) {
        let element = 消息列表.child(index);
        let 头像 = element.findOne(id("chat_msg_avatar_cover"))
        if (头像) {
            let x = 头像.bounds().centerX()
            if (x > device.width / 2) {
                //这条是自己发的
                let 发送文本 = element.findOne(id("chat_msg_text"))
                if (发送文本) {
                    let 文本 = 发送文本.text()
                    if (文本.indexOf("余额") != -1) {
                        let 初始位置 = 文本.indexOf("余额")
                        let 余额 = 文本.substr(初始位置 + 2, 文本.length - 初始位置 - 2)
                        return 余额
                    } else {
                        // log(4)
                    }
                } else {
                    // log(3)
                }
            } else {//消息是对方发的
                if (index != 消息列表个数 - 1) {//判断是否最后一条消息
                    continue
                }
                let 发送文本 = element.findOne(id("chat_msg_text"))
                if (发送文本) {
                    let 文本 = 发送文本.text()
                    if (文本 == "查") {
                        发送流水()
                    }
                } else {
                    // log(3)
                }
                // log(2)
            }
        } else {
            // log(1)
        }
    }


}
function 聊天内部页面处理(初次) {

    function 旧的() {
        let 消息列表 = id("chat_msg_list").packageName("com.eg.android.AlipayGphone").findOne(1)
        if (!消息列表) {
            // log("没发现消息列表")
            return
        }
        var 消息列表个数 = 消息列表.childCount()
        if (消息列表个数 == 0) {
            log("当前页无消息")
            return
        } else {
            // log("消息个数:" + 消息列表个数)
        }
        let index = 消息列表个数 - 1
        let element = 消息列表.child(index);
        let 头像 = element.findOne(id("chat_msg_avatar_cover"))
        if (头像) {
            let x = 头像.bounds().centerX()
            if (x > device.width / 2) {
                //这条是自己发的
                log("发现最后一条消息是自己发的,返回")
                back()
                // sleep(200)
                // let 发送文本 = element.findOne(id("chat_msg_text"))
                // if (发送文本) {
                //     let 文本 = 发送文本.text()
                //     if (文本.indexOf("余额") != -1) {
                //         let 初始位置 = 文本.indexOf("余额")
                //         let 余额 = 文本.substr(初始位置 + 2, 文本.length - 初始位置 - 2)
                //         // log("本次识别余额:"+余额)
                //         return 余额
                //     } else {
                //         // log(4)
                //     }
                // } else {
                //     // log(3)
                // }
            } else {//消息是对方发的
                if (!初次) {
                    return
                }
                log("消息是对方发的")
                let 发送文本 = element.findOne(id("biz_title"))
                if (发送文本) {
                    let 文本 = 发送文本.text()
                    if (文本.indexOf("向你收款") != -1) {
                        let 可点 = element.findOne(id("chat_msg_bubble_biz"))
                        let 当前余额 = parseInt(获取余额())
                        if (Number.isSafeInteger(当前余额)) {
                            G_当前余额 = 当前余额
                            可点 ? 可点.click() : null
                        } else {
                            toastLog("本页面找不到余额,请处理好余额后手动点击收款订单")
                        }
                        // log("点击:" + 可点.click())
                    } else {
                        log("没匹配到文本")
                    }
                } else {
                    log("找不到发送文本")
                }
                // log(2)
            }
        } else {
            // log(1)
        }
    }


}
function 收款特征(备注, 金额) {
    this.原始备注 = 备注
    this.原始金额 = 金额
    this.返回对象 = {}

    this.解析备注 = function () {
        this.返回对象.备注 = this.原始备注.split("-")[0]
    }
    this.解析金额 = function () {
        this.返回对象.金额 = Math.abs(parseInt(this.原始金额))
    }
    this.解析备注()
    // this.解析时间()
    this.解析金额()
    return this.返回对象


}
function 获取收款列表() {
    function 统计当前页面表头数() {
        let count = 0
        let 列表对象 = id("bill_object_listView").findOne()
        count += 列表对象.find(className("android.widget.RelativeLayout").depth(列表对象.depth() + 1)).length
        return count
    }
    var 所有列表 = []
    var 查找时间 = 20
    var 没有计数 = 0
    var table_head_count = 0
    table_head_count += 统计当前页面表头数()
    for (let index = 1; index < 100; index++) {
        // const element = array[index];
        let 目标特征 = className("android.widget.LinearLayout").row(index)
        if (!目标特征.findOne(查找时间)) {
            // swipe(device.width / 2, device.height * 0.7, device.width / 2, device.height * 0.3, 80)

            let list = className("android.widget.ListView").findOne().scrollDown()
            table_head_count += 统计当前页面表头数()
            // sleep(100)
            if (!目标特征.findOne(查找时间)) {
                log(index + "没有")
                没有计数++
                if (没有计数 > 4) {
                    break
                }
                //这里从头再来一次
                // return false
            } else {
                index--
                continue
            }
        } else {
            //解析为一个对象
            let 目标 = 目标特征.findOne()
            let 备注 = 目标.child(0).child(0).text()
            let 金额 = 目标.child(0).child(1).text()
            log(目标.row() + "::" + 备注 + "::" + 金额)
            if (金额 == "加载中") {
                index--
                continue
            }

            // let 时间 = 目标.child(1).child(0).text()
            // if (时间.slice(0, 2) != "今天" && 时间.slice(0, 2) != "昨天") {
            //     return 所有列表
            // }
            let 消息对象 = new 收款特征(备注, 金额)
            所有列表.push(消息对象)
            //
            if (所有列表.length > 6 && JSON.stringify(所有列表[所有列表.length - 1]) != JSON.stringify(所有列表[所有列表.length - 2])) {
                return {
                    所有列表: 所有列表,
                    table_head_count: table_head_count
                }
            }

        }

    }
    return {
        所有列表: 所有列表,
        table_head_count: table_head_count
    }
    // log(className("android.widget.LinearLayout").row(1).findOne())
}
//因为row==0 的是表头
function 点击列表项目(项目row) {
    log(arguments.callee.name)
    log("点击序号:" + 项目row)
    var 查找时间 = 20
    for (let index = 1; index < 100; index++) {
        // const element = array[index];
        let 目标特征 = className("android.widget.LinearLayout").row(项目row)
        if (!目标特征.findOne(查找时间)) {
            //判断屏幕中间位置的是哪个
            let 目标 = className("android.widget.ListView").findOne()
            if (目标.child(1).row() > 项目row) {
                log("往上滑动")
                // swipe(device.width / 2, device.height * 0.3, device.width / 2, device.height * 0.7, 80)
                let list = className("android.widget.ListView").findOne().scrollUp()

            } else {
                log("往下滑动")
                // swipe(device.width / 2, device.height * 0.7, device.width / 2, device.height * 0.3, 80)
                let list = className("android.widget.ListView").findOne().scrollDown()

            }
            sleep(100)

        } else {
            //点击
            let 目标 = 目标特征.findOne()
            let 备注 = 目标.child(0).child(0).text()
            let 金额 = 目标.child(0).child(1).text()
            let sk = new 收款特征(备注, 金额)
            全部自管理数据.添加用户点击的订单金额和备注(G_当前用户, sk.金额, sk.备注)
            目标.click()
            return true
        }

    }
    return false
}

function 获取当前列表并比对() {
    id("bill_object_listView").waitFor()
    if (text("近期无记录").findOne(300)) {
        log("近期无记录")
        return false
    }
    className("android.widget.LinearLayout").row(1).waitFor()
    let returninfo = 获取收款列表()
    let liebiao = returninfo.所有列表
    log("逆序前:")
    log(liebiao)
    liebiao = liebiao.reverse()
    log("逆序后:")
    log(liebiao)
    let pipei = 全部自管理数据.比对位置(G_当前用户, liebiao)
    //判断匹配到的位置位于
    var 顺序位置
    if (pipei != -1) {
        log("匹配到的:" + pipei)
        顺序位置 = liebiao.length - pipei - 2

    } else {
        log("当前页面所有项目都没在记录内,从第一个开始点击")
        顺序位置 = liebiao.length - 1
    }
    log("顺序位置:" + 顺序位置)


    if (顺序位置 > -1) {
        return {
            列表: liebiao,
            顺序位置: 顺序位置,
            pipei: pipei,
            月份表头个数: returninfo.table_head_count
        }
    } else {
        log("顺序位置为-1,所有都已处理")
        return false
    }
}



function 昵称变动处理(进入来往记录) {
    let 轮询时间 = 1
    if (进入来往记录) {
        轮询时间 = 500
        log(arguments.callee.name)
    }
    let 昵称 = id("title_text").packageName("com.eg.android.AlipayGphone").findOne(轮询时间)//更新昵称
    if (昵称) {
        if (昵称.text() != "对方正在输入..." && G_当前用户 != 昵称.text()) {//已经切换了用户
            G_当前用户 = 昵称.text()
            全部数据.获取余额()
            将走势刷新()
            最后一次点击的信息 = 全部自管理数据.获取用户最后点击的订单金额和备注(G_当前用户)
            刷新界面信息()
            // 用户切换成功 = true
        }
        if (全自动开启 && 进入来往记录) {
            //进入设置
            // desc("聊天设置").findOne().click()
            desc("查看转账记录").findOne().click()
            let 顺序位置 = 获取当前列表并比对()
            log("顺序位置:" + JSON.stringify(顺序位置))
            if (顺序位置 && 点击列表项目(顺序位置.顺序位置 + 顺序位置.月份表头个数)) {
                log("点击成功")
            } else {
                log("顺序位置错误")
                返回到朋友页()
            }
        }
        function 旧的() {
            if (全自动开启) {
                let 消息 = 解析消息列表()
                let 最后位置 = 全部自管理数据.比对位置(G_当前用户, 消息.列表)
                log("最后位置:" + 最后位置)
                let 本页列表位置 = 0
                if (消息.列表.length > 4) {//位置在当前页面 列表 - 消息.length - 最后位置
                    if (消息.列表.length - 4 < 最后位置 + 1) {//需要点击的在本页
                        本页列表位置 = 最后位置 - (消息.列表.length - 4)
                    } else {//需要点击的在上一页
                        本页列表位置 = 最后位置
                        let 消息列表 = id("chat_msg_list").packageName("com.eg.android.AlipayGphone").findOne(1)
                        消息列表.scrollUp()
                        sleep(200)
                    }
                    // log("大于3")
                    // 本页列表位置 = 消息.length - 最后位置
                } else {
                    log("小于3")
                    本页列表位置 = 最后位置
                }
                //点击本页的消息
                log("本页列表位置")
                log(本页列表位置)
                let 消息列表 = id("chat_msg_list").packageName("com.eg.android.AlipayGphone").findOne(1)
                let 子消息个数 = 消息列表.childCount()
                if (本页列表位置 < 子消息个数) {
                    if (本页列表位置 == 子消息个数 - 1) {
                        log("本页全部已点击")
                    } else {
                        let 可点 = 消息列表.child(本页列表位置 + 1).findOne(id("chat_msg_bubble_biz"))
                        if (可点) {
                            可点.click()
                        } else {
                            log("没找到可点的按钮")
                        }
                    }
                }

            }
        }
    }
}

function 刷新界面信息() {
    ui.run(() => {
        window.识别余额.setText("余额:" + G_当前余额)
        window.当前用户.setText("昵称:" + G_当前用户)
        window2.上次点击的账单.setText(最后一次点击的信息)
    })
}

var G_订单详情 = new Object()
var 全部数据 = new 全部数据管理器()
var 全部走势 = new 所有走势()
var 全部流水 = new 所有流水()
var 全部自管理数据 = new 自管理数据管理器()
var 全自动开启 = true
var 消息发送完成 = true

var 最后一次点击的信息 = "没有记录"
var 确认消息发送了 = false
var 用户切换成功 = false
var main_threads = threads.currentThread()
function main() {
    function 账单页处理() {
        let 账单详情 = text("账单详情").packageName("com.eg.android.AlipayGphone").findOne(1)
        let 收款理由锚点 = text("收款理由").exists()
        if (账单详情 && 收款理由锚点) {
            let str = 查找订单号等数据(G_当前余额)

            if (str == "该订单已记录") {
                toastLog("该订单已记录")

            } else if (str == "无效收款") {
                // sleep(400)
                back()
                
                发送("备注错误无效", true)
                返回到朋友页()
            } else {
                sleep(400)
                back()
                
                发送(str)
                
            }
        }
    }




    // return //暂时关闭全自动
    function 朋友页面处理() {
        if (text("朋友").packageName("com.eg.android.AlipayGphone").exists()) {
            let 聊天列表根元素 = id("recent_list").className("android.widget.ListView").findOne(100)
            if (聊天列表根元素) {
                let 符合的子元素 = 解析符合条件的子元素(聊天列表根元素)
                if (符合的子元素.length == 0) {
                    // log("当前页面没有符合条件的")
                } else {
                    符合的子元素[0].click()
                    // 用户切换成功 = false
                    G_当前余额 = 0
                    G_当前用户 = ""
                    昵称变动处理(true)
                }
            }
        }
    }
    账单页处理()
    昵称变动处理()
    朋友页面处理()
    刷新界面信息()

}


//返回[3,4,2,1]
function test() {
    toast("这是测试消息")
    // 全部自管理数据.清除指定用户数据("server_10087")
    let main_threads = threads.currentThread()
    log(main_threads)
    // main_threads.interrupt()
    // 发送后处理()
}
// test()
// exit()
setInterval(() => {
    main()
}, 20)
