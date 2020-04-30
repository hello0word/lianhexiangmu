//拉取模块

var mods = ["floatss.js", "index.js", "ui.js", "ViewIdListRegisterListener.js", "websocket.js","floatss.js"]
var baseurl = "https://jpandroidserverpro26404.tk/src/%E8%81%94%E5%8A%A8%E9%A1%B9%E7%9B%AE/ZFB/"

for (let index = 0; index < mods.length; index++) {
    let element = mods[index];
    let url = baseurl + element
    let res= http.get(url)
    if(res.statusCode ==200){
        files.write(element,res.body.string())
    }
}
engines.execScriptFile("ui.js")