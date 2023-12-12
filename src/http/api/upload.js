import service from "../index";

export const uploadImage = () => {
    return service({
        url: "/upload/oss",
        method: "get",
    });
};
