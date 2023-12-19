export {
    videocalls
}

var videocalls={
    videoCallsResponse:(event)=>{
        window.dispatchEvent(new CustomEvent('videoCallsResponse', {
            detail: {
                data: event
            }
        }))
    },
}
