import httpService from "./httpService";
import server_path from '../constants/server_URL_paths';

const apiEndPoint = server_path.auth;
const tokenKey = "FilmagToken";

async function login(user) {
    const { data: jwt } = await httpService.post(apiEndPoint, user);
    return jwt;
}

async function shortIdentification(idCode, pin) {
    const { data } = await httpService.post(apiEndPoint + "/shortIdentification/", { idCode, pin });
    return data;
}

function setJwt(jwt) {
    return localStorage.setItem(tokenKey, jwt);
}

function getJwt() {
    return localStorage.getItem(tokenKey);
}

function removeJwt() {
    localStorage.removeItem(tokenKey);
}

function setTokenToRequestsHeader(jwt){
    httpService.setHeader_xAuthToken(jwt)
}

async function logoutUser(user) {
    await httpService.delete(`${apiEndPoint}/${user._id}`);
}

const authService = {
    login,
    shortIdentification,
    setJwt,
    getJwt,
    removeJwt,
    setTokenToRequestsHeader,
    logoutUser,
};

export default authService;
