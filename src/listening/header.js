export {
    header
}

var header={
    getWebsocketStatus:(event)=>{
        window.dispatchEvent(new CustomEvent('socketStatus', {
            detail: {
                data: event
            }
        }))
    },

    addFriendNotice:(event)=>{
        window.dispatchEvent(new CustomEvent('addFriendNotice', {
            detail: {
                data: event
            }
        }))
    }
}
