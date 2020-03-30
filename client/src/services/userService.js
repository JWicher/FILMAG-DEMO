import jwtDecode from 'jwt-decode';
import httpService from "./httpService";
import auth from './authService';
import server_path from '../constants/server_URL_paths';

const apiEndPoint = server_path.users;

const jobNames = {
    "SuperAdmin": 1000,
    "Admin": 100,
    "Prezes": 14,
    "Dyrektor": 13,
    "Kierownik": 12,
    "Mistrz": 11,
    "Koordynator": 10,
    "Współdzielone": 4,
    "Prac. utrz. ruchu": 3,
    "Magazynier": 2,
    "Operator": 1
};

export function getJobNames() {
    return Object.keys(jobNames);
}

export async function getUsers() {
    const isAdmin = isCurrentUserGreaterThanORequalTo("Admin");
    let { data } = await httpService.get(apiEndPoint);
    data = isAdmin ? data : data.filter(u => u.job !== "Admin" && u.job !== "SuperAdmin") // nie pokazuj użytkowników, którzy mają większe uprawnienia
    data = data.sort((a, b) => getUserJobValue(b.job) - getUserJobValue(a.job)) // sortuj tak, aby wyświetlać zgodnie z hierarchią
    return data;
}

export async function addUser(user) {
    const { data } = await httpService.post(apiEndPoint, user);
    return data;
}

export async function updateUser(user) {
    const { data } = await httpService.put(apiEndPoint + "/" + user._id, user);
    return data;
}

export async function deleteUser(user) {
    const { data } = await httpService.delete(apiEndPoint + "/" + user._id);
    return data;
}

export async function logoutUser() {
    const user = getUserFromJWT();
    await httpService.patch(apiEndPoint + "/" + user._id, { isLogged: false });
}

export async function resetUserPassword(user) {
    const { data } = await httpService.patch("/resetPassword/" + user._id, { password: user.password, newPassword: user.newPassword });
    return data;
}

export async function resetUserPIN(user) {
    const { data } = await httpService.patch("/resetPassword/" + user._id, { password: user.password, newPIN: user.newPIN });
    return data;
}

// funkcje przetwarzające dane
export function getUserFromJWT() {
    const jwt = auth.getJwt()
    return jwt ? jwtDecode(jwt) : undefined;
}

export function isCurrentUserGreaterThanORequalTo(jobName) { // zmienic na required
    const user = getUserFromJWT();
    if (!user) return false;
    const currentUserJob = user.job;
    return getUserJobValue(currentUserJob) >= jobNames[jobName];
}

export function isCurrentUserLessThan(jobName) {
    const currentUserJob = getUserFromJWT().job;
    return getUserJobValue(currentUserJob) < jobNames[jobName];
}

export function isCurrentUserLessThanORequalTo(jobName) {
    const currentUserJob = getUserFromJWT().job;
    return getUserJobValue(currentUserJob) <= jobNames[jobName];
}

export function isCurrentUserGreaterThan(jobName) {
    const currentUserJob = getUserFromJWT().job;
    return getUserJobValue(currentUserJob) > jobNames[jobName];
}

export function isCurrentUserEqualTo(jobName) {
    const currentUserJob = getUserFromJWT().job;
    return getUserJobValue(currentUserJob) === jobNames[jobName];
}

export function isThisJobManaging(jobName) {
    return getUserJobValue(jobName) >= jobNames['Koordynator'];
}

export function getUserJobValue(jobName) {
    return jobNames[jobName]
}

export function getUserJobName(user) {
    for (let key in jobNames) {
        if (jobNames[key] === user.job) return key;
    }
}

export default {
    endpoint: apiEndPoint,
    getJobNames,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    logoutUser,
    resetUserPassword,
    resetUserPIN,
    getUserFromJWT,
    getUserJobName,
    getUserJobValue,
    isCurrentUserLessThan,
    isCurrentUserLessThanORequalTo,
    isCurrentUserGreaterThan,
    isCurrentUserGreaterThanORequalTo,
    isCurrentUserEqualTo,
    isThisJobManaging
}