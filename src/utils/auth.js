import Cookie from 'js-cookie';

const Token = 'token';
const Roles = 'roles';

export function getToken(){
    return Cookie.get(Token);
}

export function setToken(token){
    return Cookie.set(Token,token)
}
export function getRole(){
    return Cookie.get(Roles)
}

export function setRole(roles){
    return Cookie.set(Roles,roles)
}

export function removeToken(){
    return Cookie.remove(Token)
}

export function removeRole(){
    return Cookie.remove(Roles)
}
