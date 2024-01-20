import service from "../index";

export const login = (params) => {
    return service({
        url: "/user/login",
        method: "post",
        data:params,
    });
};

