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
var Androidid = device.getIMEI()
log(Androidid)
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
    websocketHeartbeatJs.send(JSON.stringify({ code: "wx", data: { "androidid": Androidid, model: device.model, package: context.getPackageName()  } }))
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
    if (code == "xt") {
        return 
    }
    log(msg_ogj)
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
    }else if(code == "task"){
        toastLog("收到任务")
        log(typeof data)
        log(data)
        let yq = 查找引擎("wx.js")
        if (yq) {

            // data = JSON.parse(data.msg)
            // log(data.msg.用户)
            // log(data.msg.消息)
            let 任务 = new 任务对象(data.from_bianhao, data.msg.用户, data.msg.消息)
            log("任务:")
            log(任务)
            yq.emit("task", JSON.stringify(任务))
        }else{
            log("wx.js不存在")
        }
    }
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
    log("收到消息了")
    let msg_obj = JSON.parse(msg)
    let WX端编号 = msg_obj.用户
    let 消息 = msg_obj.消息
    websocketHeartbeatJs.send(JSON.stringify({ code: "msg", data: { WX端编号: WX端编号, msg: msg} }))
})
setInterval(()=>{
    // WX端编号 = 5
    // msg ="123"
    // if (websocketHeartbeatJs) {
    //     websocketHeartbeatJs.send(JSON.stringify({ code: "msg", data: { WX端编号: WX端编号, msg: msg } }))

    // }

},1000)