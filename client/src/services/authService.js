import httpService from "./httpService";
import server_path from '../constants/server_URL_paths';

const apiEndPoint = server_path.auth;
const tokenKey = "FilmagToken";

export async function login(name, password) {
    const { data: jwt } = await httpService.post(apiEndPoint, { name, password });
    return jwt;
}

export async function shortIdentification(idCode, pin) {
    const { data } = await httpService.post(apiEndPoint + "/shortIdentification/", { idCode, pin });
    return data;
}
export function setJwt(jwt) {
    return localStorage.setItem(tokenKey, jwt);
}

export function getJwt() {
    return localStorage.getItem(tokenKey);
}

export function removeJwt() {
    localStorage.removeItem(tokenKey);
}

export function setTokenToRequestsHeader(jwt){
    httpService.setHeader_xAuthToken(jwt)
}

export async function logoutUser(user) {
    await httpService.delete(`${apiEndPoint}/${user._id}`);
}
export default {
    login,
    shortIdentification,
    setJwt,
    getJwt,
    removeJwt,
    setTokenToRequestsHeader,
    logoutUser,
}