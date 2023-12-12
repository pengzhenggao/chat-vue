export {
    chatcontent
}


var chatcontent={
    retractMessage:(event)=>{
        window.dispatchEvent(new CustomEvent('retractMessage', {
            detail: {
                data: event
            }
        }))
    },
    initMessage:()=>{
        window.dispatchEvent(new CustomEvent('initMessage', {
        }))
    }
};
