// log(engines.all())

function 查找引擎(引擎名){
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
let yq= 查找引擎("websocket.js")
yq.emit("msg","我草")