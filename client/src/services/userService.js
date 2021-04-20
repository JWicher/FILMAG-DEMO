import jwtDecode from 'jwt-decode';
import httpService from "./httpService";
import auth from './authService';
import server_path from '../constants/server_URL_paths';
import jobNames from '../enums/jobNames.json';

const apiEndPoint = server_path.users;

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

export async function resetUserPassword(user) {
    const { data } = await httpService.patch(server_path.resetPassword + "/" + user._id, { password: user.password, newPassword: user.newPassword });
    return data;
}

export async function resetUserPasswordToDefault(user) {
    const { data } = await httpService.get(server_path.resetPasswordDefault + "/" + user._id);
    return data;
}

export async function resetUserPIN(user) {
    const { data } = await httpService.patch(server_path.resetPassword + "/" + user._id, { password: user.password, newPIN: user.newPIN });
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

export function isCurrentUserNotA(jobName) {
    const currentUserJob = getUserFromJWT().job;
    return currentUserJob !== jobName
}

export default {
    endpoint: apiEndPoint,
    getJobNames,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    resetUserPasswordToDefault,
    resetUserPIN,
    getUserFromJWT,
    getUserJobName,
    getUserJobValue,
    isCurrentUserLessThan,
    isCurrentUserLessThanORequalTo,
    isCurrentUserGreaterThan,
    isCurrentUserGreaterThanORequalTo,
    isCurrentUserEqualTo,
    isThisJobManaging,
    isCurrentUserNotA
}