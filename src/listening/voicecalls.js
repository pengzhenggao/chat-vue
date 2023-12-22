export {
    voicecalls
}

var voicecalls={
    voiceCallsResponse:(event)=>{
        window.dispatchEvent(new CustomEvent('voiceCallsResponse', {
            detail: {
                data: event
            }
        }))
    },
}
