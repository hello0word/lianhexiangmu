
const WebSocket = require('ws');
const UUID = require('uuid');
const fs = require('fs');
const path = require('path')

var bin_info = null
var 上传文件 = null;

console.log("开始")



// if (!fs.existsSync("img")) {
//   fs.mkdirSync("img")
// }


function 检查并获取编号(androidid){
  if (fs.existsSync('./map.json')) {
    var f = fs.readFileSync('./map.json', { encoding: "utf-8" })
    console.log(f)
    try {
      let all_info= JSON.parse(f)
      if (all_info[androidid]) {
        console.log(all_info[androidid])
        return all_info[androidid]
      }else{
        console.log(Object.keys(all_info).length)
        all_info[androidid] = Object.keys(all_info).length
        console.log(all_info)
        fs.writeFileSync('./map.json',JSON.stringify(all_info))
        return all_info[androidid]

      }
    } catch (error) {
      console.log(error)
    }
  }
    
}
// 检查并获取编号(new Date().getTime())
/**
 * ///客户端注册
 * @param {连接对象} connection 
 */
function client_reg(server, connection, type, data) {
  console.log("客户端注册类型:" + type)
  console.log("客户端注册数据:" + JSON.stringify(data))
  connection.type = type
  if (data.androidid) {
    console.log("初始AndroidID:" + connection.androidid)
    server.clients.find_by_androidid(data.androidid)//强制退出其他的符合该AndroidID的
    connection.androidid = data.androidid
    connection.bianhao = 检查并获取编号(connection.androidid)
  } else {
    // connection.id = UUID.v4().split("-")[0]
    //无androidID  不能连接
  }
  console.log("设置androidId为:" + connection.androidid)
  console.log("设置编号为:" + connection.bianhao)
  // if (type == "zfb") {
  //   let 被控端 = Array.from(server.clients).find(ss => ss.admin_id == connection.id)//返回结果时被控端
  //   if (被控端) {
  //     被控端.admin_id = connection.id
  //     connection.child_id = 被控端.id//管理员短线重连时,把以前的控制端分配给它
  //     connection.send(JSON.stringify({ code: "getChild", data: { msg: "ok", child_id: connection.child_id } }))
  //   }
  // } else if (type == "client") {
  //   let 管理员 = Array.from(server.clients).find(ss => ss.child_id == connection.id)//返回结果为管理员
  //   if (管理员) {
  //     管理员.child_id = connection.id
  //     connection.admin_id = 管理员.id //客户端断线重连时,把以前的控制端分配给它
  //     管理员.send(JSON.stringify({ code: "getChild", data: { msg: "ok", child_id: connection.admin_id } }))
  //   }
    if (data.model) {
      connection.model = data.model
    }
    if (data.data) {
      connection.self_data = data
    }
    


  
  console.log("下发注册成功消息")
  connection.send(JSON.stringify({ code: "zc_ok", data: { bianhao: connection.bianhao } }))
  // 服务器广播(server, { code: "update" }, "admin")
}


/**
 * 把从控制端传来的消息发给客户端
 * @param {*} connection 控制端连接
 * @param {*} datas 需要发送的对象
 */
function child_send_info(server, connection, datas) {
  if (!connection.child_id) {
    connection.send(JSON.stringify({ code: "error", data: { msg: "没有受控端" } }))
    return
  }
  let client = Array.from(server.clients).find(se => se.id == connection.child_id)//查找受控端信息   //  
  // let client = connect_pool.findById(tempssss)//查找受控端信息  //测试用的
  if (!client) {
    connection.send(JSON.stringify({ code: "error", data: { msg: "找不到client:" + connection.child_id } }))
    for (let iterator of server.clients) {
      console.log("在线设备id为" + iterator.id)
    }
    return
  }
  client.send(JSON.stringify(datas))
}

/**
* 把从客户端传来的消息发给控制端
*/
function parent_send_info(server, connection, datas) {
  console.log("转发送给控制端")
  let element = Array.from(server.clients).find(ele => ele.id == connection.admin_id)

  if (!element) {
    console.log("没有控制端")

    connection.send(JSON.stringify({ code: "error", data: { msg: "没有控制端" } }))
    return
  }
  console.log("转发送给控制端" + element.id)

  element.send(JSON.stringify(datas))
}


function Child_manager(server, connection, data, cmd) {//data中uid是每个连接自己的id

  if (cmd == "releaseChild") {
    console.log("释放设备:" + data.target_uid)
    let element = Array.from(server.clients).find(ss => ss.id == data.target_uid)
    if (element) {
      element.admin_id = null
      // connection.child_id = null
      connection.send(JSON.stringify({ code: "releaseChild", data: { msg: "ok" } }))
    }


  } else {
    if (data.target_uid == connection.id) {
      connection.send(JSON.stringify({ code: "error", data: { msg: "不能把自己设为目标" } }))
      return
    }
    let element = Array.from(server.clients).find(ss => ss.id == data.target_uid)
    if (!element) {
      connection.send(JSON.stringify({ code: "error", data: { msg: "找不到client:" + data.target_uid } }))
      for (let iterator of server.clients) {
        console.log("在线设备id为" + iterator.id)
      }
      return
    }
    element.admin_id = connection.id
    connection.child_id = element.id
    connection.send(JSON.stringify({ code: "getChild", data: { msg: "ok", child_id: data.target_uid } }))

  }
}

function send_to_tuo(data){
    //遍历当前所有连接
    //找到需要该订单号的托
    //把数据传递给他
  
  let 订单号 = data.SERVER.订单号
  console.log("订单号:"+订单号)
  let tuo =  wss.clients.find_by_jianting_dindanhao(订单号)
  if (tuo) {
    tuo.send(JSON.stringify({code:"dindan_data", data:data}))
  }
}

function 收到文本处理(server, connection, result) {
  connection.last_time = new Date().getTime()
  try {
    var info = JSON.parse(result)
  } catch (error) {
    console.log(error)
    return
  }
  let code = info.code
  let data = info.data
  if (code == "xt") {
    connection.send(JSON.stringify({ code: "xt" }))
    // console.log("----" + connection.model)
    // 服务器广播(server, { code: "xt", data: { uid: connection.id } }, "admin")
    return
  }
  console.log("收到文本消息:" + result)
  if (code === "zfb") {//客户端注册
    client_reg(server, connection, "zfb", data)
  } else if (code === "wx") {
    client_reg(server, connection, "wx", data)
  } else if(code === "tuo"){
    client_reg(server, connection, "tuo", data)
  } else {
    if (code =="task") {
      send_to_tuo(data)
      console.log("data:")
      console.log(data)
      let 目标编号 = data.WX.WX端编号
      console.log(目标编号)
      let msg = data.WX.msg
      console.log("发送到微信的msg:")
      console.log(msg)
      let 发送目标= wss.clients.find_by_bianhao(目标编号)
      if (发送目标) {
        console.log("找到了目标:" + 发送目标)
        console.log(connection.bianhao)
        发送目标.send(JSON.stringify({ code: "task", data: { "from_bianhao": connection.bianhao, "msg": msg } }))
      }else{
        console.log("目标离线")
        console.log(connection.bianhao)
        console.log(JSON.stringify({ from_bianhao: connection.bianhao,msg: msg }))
        connection.send(JSON.stringify({ "code": "error", data: { "msg": "目标离线" }}))
      }
    }else if(code == "jianting_dindanhao" ){
      if (connection.type == 'tuo') {
        console.log("设置监听成功")
        connection.jianting_dindanhao = data
      }
    }
    
  }
}



function 服务器广播(wss, data, 目标) {
  if (typeof data != "string") {
    try {
      data = JSON.stringify(data)
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && client.type == 目标) {
          client.send(data);
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

}



// function 收到二进制处理(server, connection, data) {
//   connection.last_time = new Date().getTime()
//   let 文件名 = bin_info.name
//   console.log(文件名)
//   console.log(bin_info)
//   let fd = bin_info.name
//   let 格式 = bin_info.type
//   console.log(fd)
//   console.log(格式)
//   if (格式 == "image") {
//     console.log("图像文件")
//     fd = path.join("img", fd)
//   }
//   fs.writeFile(fd, data, (err) => {
//     console.log(err)
//   })
//   let element = Array.from(server.clients).find(ele => ele.id == connection.admin_id)
//   element.send(data)
//   console.log("发送完成")

// }



const wss = new WebSocket.Server({ port: 38000, clientTracking: true });

wss.on('connection', function connection(ws, req) {
  const ip = req.connection.remoteAddress;//连接来的ip
  wss.clients.find_by_androidid = function (androidid) {
    for (let element of wss.clients) {
      if (element.androidid == androidid) {
        console.log("terminate:"+element)
        element.terminate()
      }
    }
  }
  wss.clients.find_by_bianhao = function (bianhao) {
    for (let element of wss.clients) {
      if (element.bianhao == bianhao) {
        return element
      }
    }
  }
  wss.clients.find_by_jianting_dindanhao = function (jianting_dindanhao) {
    for (let element of wss.clients) {
      if (element.jianting_dindanhao == jianting_dindanhao) {
        return element
      }
    }
  }
  ws.on('message', function incoming(message) {
    if (typeof message === "string") {
      // console.log('received: %s', message);
      收到文本处理(wss, ws, message)
    } else {
      console.log('二进制长度: %d', message.length);
      // 收到二进制处理(wss, ws, message)
    }

  });
  ws.on("open", function () {
    console.log("open")
  })
  ws.on("close", function (code, reason) {
    console.log("close")

    // 服务器广播(wss, JSON.stringify({ code: "update" }), "admin")
  })
  ws.on("error", function (error) {
    console.log("error")
    console.log(error)
    // 服务器广播(wss, JSON.stringify({ code: "update" }), "admin")
  })
  ws.on("ping", function () {
    console.log("收到ping")
    
   })
  ws.on("pong", function () {
    console.log("服务器收到pong消息")
   })
});
wss.on("close", function () {
  console.log("服务器关闭")
})
wss.on("error", function (error) {
  console.log(error)
})

setInterval(() => { 
  for (let element of wss.clients) {
    if (new Date().getTime() - element.last_time > 15000) {
      console.log("设备断线踢除:" +element.androidid)
      element.terminate()
    }
  }
 }, 3000)