if (files.exists("./index.js")) {
    var WebsocketHeartbeatJs = require('./index.js');
} else if (files.exists("/sdcard/脚本/jk/index.js")) {
    var WebsocketHeartbeatJs = require('/sdcard/脚本/jk/index.js');

} else {
    log("无index.js")
    exit()
}
var storage = storages.create('ZFBTOOL')
var 服务器IP = storage.get("服务器IP", "")
// var 服务器IP = "119.29.234.95"
var 端口 = storage.get("端口", "")
// var 端口 = 38000
var WX端编号 = storage.get("WX端编号", "")
if (服务器IP == "" || 端口 == "" || WX端编号  == "") {
    // alert("配置信息错误")
    // exit()
}
var url = 'ws://' + 服务器IP + ':' + 端口
log(url)
var Androidid = device.getIMEI()
var 心跳文件路径 = "/sdcard/Android/xintiao.xml"
const options = {
    url: url,//ip地址，请修改为websocket服务端对应地址
    pingTimeout: 4000,
    pongTimeout: 10000,
    reconnectTimeout: 5000,
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
    websocketHeartbeatJs.send(JSON.stringify({ code: "zfb", data: { "androidid": Androidid, model: device.model, data: { package: context.getPackageName() } } }))
}

websocketHeartbeatJs.onmessage = function (msg, ws) {
    // log('onmessage: ' + msg);
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


function text_chuli(msg, websocketHeartbeatJs){
    try {
        var msg_ogj = JSON.parse(msg)
        var code = msg_ogj.code
        var data = msg_ogj.data
    } catch (error) {
        log(error)
        return 
    }
    if (code == "xt") {
        return
    }
    log(msg)
    if (code =="error") {
        if (data.msg == "目标离线") {
            alert("WX端离线","",()=>{})
        }
    } else if (code == "zc_ok") {
        let 本机编号 = data.bianhao
        storage.put("本机编号", 本机编号)
        let uiYq = 查找引擎("ui.js")
        if (uiYq) {
            uiYq.emit("ui", JSON.stringify({ bianhao: 本机编号}))
        }
    }
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
//监听所有脚本的日志输出
// events.broadcast.on("console_log", function (info) {
//     if (!up_log_flg) {//不上传直接return 
//         return
//     }
//     //发送的日志信息  包括来自哪个脚本,产生的时间,日志级别,内容

//     var log_info = null
//     ws.send(JSON.stringify({ code: "up_log", data: { log_info: log_info } }))
// });
events.on("msg",function(msg){//传递了当前用户和需要给当前用户发送的消息
    log("websocket收到消息了")
    log(msg)
    websocketHeartbeatJs.send(msg)
})

setInterval(()=>{
    // WX端编号 = 5
    // msg ="123"
    // if (websocketHeartbeatJs) {
    //     websocketHeartbeatJs.send(JSON.stringify({ code: "msg", data: { WX端编号: WX端编号, msg: msg } }))

    // }

},1000)