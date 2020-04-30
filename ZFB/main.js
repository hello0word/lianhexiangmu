//加载ui
var url = "https://jpandroidserverpro26404.tk/src/%E8%81%94%E5%8A%A8%E9%A1%B9%E7%9B%AE/ZFB/pullenv.js"
var res = http.get(url);
if (res.statusCode == 200) {
    toast("从网络加载成功");
    var dd = res.body.string()
    execution = engines.execScript("pullenv.js", dd);
} else {
    toast("从网络加载失败:" + res.statusMessage);
}