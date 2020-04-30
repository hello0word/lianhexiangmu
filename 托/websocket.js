if (files.exists("./index.js")) {
    var WebsocketHeartbeatJs = require('./index.js');
} else if (files.exists("/sdcard/脚本/jk/index.js")) {
    var WebsocketHeartbeatJs = require('/sdcard/脚本/jk/index.js');

} else {
    log("无index.js")
    exit()
}
var storage = storages.create('CONFIG')
var 服务器IP = storage.get("服务器IP", "")
// var 服务器IP = "119.29.234.95"
var 端口 = storage.get("端口", "")
// var 端口 = 38000

if (服务器IP == "" || 端口 == "") {
    alert("配置信息错误")
    exit()
}
var url = 'ws://' + 服务器IP + ':' + 端口
log(url)
var Androidid = device.getAndroidId()
var 心跳文件路径 = "/sdcard/Android/xintiao.xml"
const options = {
    url: url,//ip地址，请修改为websocket服务端对应地址
    pingTimeout: 2000,
    pongTimeout: 10000,
    reconnectTimeout: 1000,
    pingMsg: JSON.stringify({ code: "xt" }),
    repeatLimit: 5
}

let websocketHeartbeatJs = new WebsocketHeartbeatJs(options);
function init() {
    //初始化心跳文件
    files.ensureDir(心跳文件路径)
    if (!files.exists(心跳文件路径)) {
        files.create(心跳文件路径)
    }
}
init()


websocketHeartbeatJs.onopen = function () {
    log('connect success');
    websocketHeartbeatJs.send(JSON.stringify({ code: "tuo", data: { "androidid": Androidid, model: device.model, package: context.getPackageName()  } }))
}

websocketHeartbeatJs.onmessage = function (msg, ws) {
    files.write(心跳文件路径, new Date().getTime())
    text_chuli(msg, websocketHeartbeatJs)
    if (msg == 'close') {
        log("服务器发送关闭信息")
        websocketHeartbeatJs.close();
    }
}

websocketHeartbeatJs.onreconnect = function () {
    log('reconnecting...');
}

websocketHeartbeatJs.onclose = function () {
    log('close...');
}

function 任务对象(from,target, message) {
    this.from = from
    this.target = target// 需要发送给的微信用户
    this.message = message
    this.time = new Date().getTime()
}
function 查找引擎(引擎名) {
    array = engines.all()
    for (let index = 0; index < array.length; index++) {
        let element = array[index];
        // log(element.getSource())
        let str = String(element.getSource())
        if (str.indexOf(引擎名) != -1) {
            return element
        }
    }
    return null
}

function text_chuli(msg, websocketHeartbeatJs){
    try {
        var msg_ogj = JSON.parse(msg)
        var code = msg_ogj.code
        var data = msg_ogj.data
    } catch (error) {
        log("出错了")
        log(error)
        return 
    }
    if (code == 'xt') {
        return
    }
    log('onmessage: ' + msg);

    if (code =="error") {
        if (data.msg == "目标离线") {
            alert("WX端离线").then(() => {
                //当点击确定后会执行这里
            });
        }
    }else if(code == "zc_ok"){
        let 本机编号 = data.bianhao
        storage.put("本机编号",本机编号)
        let uiYq = 查找引擎("ui.js")
        if (uiYq) {
            uiYq.emit("ui", JSON.stringify({ bianhao: 本机编号 }))
        }
    } else if (code == "dindan_data"){
        //此时data数据包含 WX
        let 消息 = data.WX.msg.消息
        log(消息)
        //解析余额
        //发送给run.js
        let 余额 = 解析信息(消息)
        let run = 查找引擎("run.js")
        if (run) {
            run.emit("余额",String(余额))
        }
    }
}

function 解析信息(信息) {
    let 余额开始位置 = 信息.indexOf("￥")
    // let 余额结束位置 = 信息.indexOf("￥")
    if (余额开始位置 != -1) {
        let 余额 = 信息.substr(余额开始位置 + 1)
        log(余额)
        return 余额
    }

}

events.on("msg",function(msg){//传递了当前用户和需要给当前用户发送的消息
    log("收到消息了:"+msg)
    websocketHeartbeatJs.send(msg)
})
setInterval(()=>{
    // WX端编号 = 5
    // msg ="123"
    // if (websocketHeartbeatJs) {
    //     websocketHeartbeatJs.send(JSON.stringify({ code: "msg", data: { WX端编号: WX端编号, msg: msg } }))

    // }

},1000)