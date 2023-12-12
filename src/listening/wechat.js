export {
    wechat
}

var wechat={
    initContainer:()=>{
        window.dispatchEvent(new CustomEvent('initContainer', {
        }))
    },
}
