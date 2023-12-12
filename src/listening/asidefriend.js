export {
    asidefriend
}

var asidefriend={
    OnAndOffLineNotificationsImpl:(event)=>{
        window.dispatchEvent(new CustomEvent('OnAndOffLineNotifications', {
            detail: {
                data: event
            }
        }))
    },

    buddyListPopulation:(event)=>{
        window.dispatchEvent(new CustomEvent('buddyListPopulation', {
            detail: {
                data: event
            }
        }))
    },
    updateRemark(event) {
        window.dispatchEvent(new CustomEvent('updateRemark', {
            detail: {
                data: event
            }
        }))
    },
    initAsideFriend(){
        window.dispatchEvent(new CustomEvent('initAsideFriend', {
        }))
    }
}
