var storage = storages.create("ZFBTOOL")
// var 


function 解析消息列表() {
    var 第一页列表 = []
    var 页数 = 1
    let 消息列表 = id("chat_msg_list").packageName("com.eg.android.AlipayGphone").findOne(1)
    if (!消息列表) {
        return
    }
    获取页(1)
    if (第一页列表[第一页列表.length - 1].金额 == 第一页列表[第一页列表.length - 2].金额 && 第一页列表[第一页列表.length - 1].金额 == 第一页列表[第一页列表.length - 3].金额 && 第一页列表[第一页列表.length - 1].备注 == 第一页列表[第一页列表.length - 2].备注 && 第一页列表[第一页列表.length - 1].备注 == 第一页列表[第一页列表.length - 3].备注) {
        第一页列表 = []
        消息列表.scrollUp()
        sleep(150)
        获取页(1)
        消息列表.scrollDown()
        sleep(150)
        获取页(2)
        页数 = 2
    }



    function 获取页(页数) {
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
            }
            let remarks = element.findOne(id("biz_mid_title"))
            if (remarks) {
                // log("备注")
                // log(remarks.text())
                one_msg.备注 = remarks.text()
            }
            if (!(页数 == 2 && index == 0)) {
                第一页列表.push(one_msg)
            }
        }
    }

    //分析
    log("第一页列表")
    log(第一页列表)
    return { 页数: 页数, 列表: 第一页列表 }
}

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
        let 所有用户的已点击消息 = storage.get("所有用户的已点击消息", new Object())
        if (!所有用户的已点击消息[用户名]) {//该用户没有信息
            所有用户的已点击消息[用户名] = []
        }
        if (所有用户的已点击消息[用户名].length > 200) {
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
                }
            }
        }

        return 匹配位置
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
var 全部自管理数据 = new 自管理数据管理器()
// 解析消息列表()
// let 消息列表 = id("chat_msg_list").packageName("com.eg.android.AlipayGphone").findOne(1)
// 消息列表.child(0).findOne(id("chat_msg_bubble_biz")).click()
// setInterval(()=>{
//     log(消息列表.child(2).bounds())
// },400)
// let ls=全部自管理数据.获取用户列表("server_10087")
// log(ls)
// 全部自管理数据.用户列表位置交换("server_10087",ls.length - 1,ls.length -3)
// ls = 全部自管理数据.获取用户列表("server_10087")
// log(ls)
function 获取收款列表() {
    function 收款特征(备注, 金额, 时间) {
        this.原始备注 = 备注
        this.原始金额 = 金额
        this.原始时间 = 时间
        this.返回对象 = {}

        this.解析备注 = function () {
            this.返回对象.备注 = this.原始备注.split("-")[0]
        }
        this.解析时间 = function () {
            this.返回对象.时间 = this.原始时间.substr(2)
        }
        this.解析金额 = function () {
            this.返回对象.金额 = Math.abs(parseInt(this.原始金额))
        }
        this.解析备注()
        // this.解析时间()
        this.解析金额()
        return this.返回对象


    }
    var 所有列表 = []
    var 查找时间 = 20
    for (let index = 1; index < 100; index++) {
        // const element = array[index];
        let 目标特征 = className("android.widget.LinearLayout").row(index)
        if (!目标特征.findOne(查找时间)) {
            // swipe(device.width / 2, device.height * 0.7, device.width / 2, device.height * 0.3, 80)
            let list = className("android.widget.ListView").findOne().scrollDown()

            // sleep(100)
            if (!目标特征.findOne(查找时间)) {
                log(index + "没有")
                //这里从头再来一次
                return false
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
            if (所有列表.length > 4 && JSON.stringify(所有列表[所有列表.length - 1]) != JSON.stringify(所有列表[所有列表.length - 2])) {
                return 所有列表
            }

        }

    }
    // log(className("android.widget.LinearLayout").row(1).findOne())
}
// let 计数器 =0 
// while(true){
//     text("查看转账记录").findOne().parent().parent().parent().parent().click()
//     // exit()
//     id("bill_object_listView").waitFor()
//     className("android.widget.LinearLayout").row(1).waitFor()
//     let liebiao = 获取收款列表()
//     // log(liebiao)
//     liebiao = liebiao.reverse()
//     let pipei = 全部自管理数据.比对位置("server_10087", liebiao)
//     if (pipei !=3) {
//         计数器++
//     }
//     back()
//     log(计数器)
// }
function 统计当前页面表头数() {
    let count = 0
    let 列表对象 = id("bill_object_listView").findOne()
    count += 列表对象.find(className("android.widget.RelativeLayout").depth(列表对象.depth() + 1)).length
    return count
}
// log(统计当前页面表头数())
// log(desc("查看转账记录").findOne())
let array = [{ '金额': '50', '备注': '1' },
{ '金额': '50', '备注': '9' },
{ '金额': '50', '备注': '7' },
{ '金额': '50', '备注': '7' },
{ '金额': '60', '备注': '6' },
{ '金额': '50', '备注': '1' },
{ '金额': '40', '备注': '9' },
{ '金额': '50', '备注': '7' },
{ '金额': '40', '备注': '9' },
{ '金额': '50', '备注': '1' },
{ '金额': '20', '备注': '8' },
{ '金额': '60', '备注': '4' },
{ '金额': '50', '备注': '9' },
{ '金额': '40', '备注': '7' },
{ '金额': '50', '备注': '7' },
{ '金额': '40', '备注': '9' },
{ '金额': '50', '备注': '1' },
{ '金额': '20', '备注': '8' },
{ '金额': '60', '备注': '4' },
{ '金额': '50', '备注': '9' },
{ '金额': '40', '备注': '7' }]
let 聊天页面金额和备注的列表 = [{ '备注': '7', '金额': 50 },
{ '备注': '9', '金额': 40 },
{ '备注': '1', '金额': 50 },
{ '备注': '8', '金额': 20 },
{ '备注': '4', '金额': 60 },
{ '备注': '9', '金额': 50 },
{ '备注': '7', '金额': 40 }]

// log("当前用户所有已记录的聊天列表:")
// log(array)
// log("传入的列表:")
// log(聊天页面金额和备注的列表)
// var 匹配位置 = -1
// for (let 已记录列表指针位置 = array.length - 1; 已记录列表指针位置 >= 0; 已记录列表指针位置--) {
//     let element = array[已记录列表指针位置];
//     if (聊天页面金额和备注的列表[0].金额 == element.金额 && 聊天页面金额和备注的列表[0].备注 == element.备注) {
//         let 匹配成功 = true
//         log("这次ok" + 已记录列表指针位置)
//         for (let 传入列表指针位置 = 0; 传入列表指针位置 < 聊天页面金额和备注的列表.length && 已记录列表指针位置 + 传入列表指针位置 < array.length; 传入列表指针位置++) {
//             let element2 = 聊天页面金额和备注的列表[传入列表指针位置];
//             if (array[已记录列表指针位置 + 传入列表指针位置].金额 != element2.金额 || array[已记录列表指针位置 + 传入列表指针位置].备注 != element2.备注) {
//                 匹配成功 = false
//                 break
//             }
//         }
//         if (匹配成功) {
//             匹配位置 = array.length - 已记录列表指针位置 - 1
//             break
//         }
//     }
// }
// log(匹配位置)


// let ff = /^([0-9]{1,5}|龙|虎|合)$/
// log(ff.test("."))
// log(app.versionName)

// a_p = a.length - b.length
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
// b_p = 0
for (a_pianyi = array.length - 聊天页面金额和备注的列表.length; a_pianyi < array.length; a_pianyi++) {
    let ok = true
    let b_pianyi = 0
    for (; b_pianyi < 聊天页面金额和备注的列表.length && a_pianyi + b_pianyi < array.length; b_pianyi++) {
        if (!isObjectValueEqual(array[a_pianyi + b_pianyi], 聊天页面金额和备注的列表[b_pianyi])) {
            ok = false
            break
        }
    }
    if (ok) {
        log( "a偏移:" + a_pianyi)
        log( "b偏移:" + (b_pianyi-1 ))
        break
    }
}



