const ModeType = 'modetype';

export function getModeType(){
    return window.localStorage.getItem(ModeType)
    // return Cookie.get(Theme);
}

export function setModeType(type){
    // return Cookie.set(Theme,token)
    return window.localStorage.setItem(ModeType,type)
}

export function removeModeType(){
    return window.localStorage.removeItem(ModeType)
    // return Cookie.remove(Theme)
}
