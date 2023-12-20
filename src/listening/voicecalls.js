export {
    voicecalls
}

var voicecalls={
    videoCallsResponse:(event)=>{
        window.dispatchEvent(new CustomEvent('voiceCallsResponse', {
            detail: {
                data: event
            }
        }))
    },
}
