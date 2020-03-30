import httpService from "./httpService";
import userService from '../services/userService';
import { toast } from 'react-toastify';
import client_URL_paths from '../constants/client_URL_paths';
import server_path from '../constants/server_URL_paths';

const apiEndPoint = server_path.localisations;
const tokenKey = "userLocalisations";

const localisationNames = {
    "Magazyn": 3,
    "Utrzymanie ruchu": 2,
    "Maszyna": 1
};
export function getLocalisationNames() {
    return Object.keys(localisationNames);
}
export async function getLocalisations() {
    try {
        const { data } = await httpService.get(apiEndPoint);

        return data;
    } catch (ex) {
        toast.error("Nie można uzyskać danych o lokalizacjach.")
    }
}
export async function getUserLocalisationsFromDB(user) {
    const { data: userLocalisations } = await httpService.get(userService.endpoint + "/" + user._id + "/localisations");
    return userLocalisations;
}

export function setUserLocalisations(userLocalisations) {

    userLocalisations.forEach(localisation => localisation.path = `${client_URL_paths.tasks.main}/${localisation.name}`);
    const stringified_localisations = JSON.stringify(userLocalisations);

    localStorage.setItem(tokenKey, stringified_localisations);
}
export function getCurrentUserLocalisations() {
    const userLocalisations = localStorage.getItem(tokenKey);
    return userLocalisations ? JSON.parse(userLocalisations) : [];
}

export async function addLocalisation(localisation) {
    const { data } = await httpService.post(apiEndPoint, localisation);
    return data;
}
export async function updateLocalisation(localisation) {
    const { data } = await httpService.put(apiEndPoint + "/" + localisation._id, localisation);
    return data;
}
export async function deleteLocalisation(localisation) {
    const { data } = await httpService.delete(apiEndPoint + "/" + localisation._id);
    return data;
}

export async function getSelectedLocalisation(endPoint) {
    const validLocalisations = await getCurrentUserLocalisations();
    return endPoint ? validLocalisations.filter(vl => vl.name === endPoint)[0] : null;
}


export async function getCurrentLocalisation(pathname) {
    const validLocalisations = await getCurrentUserLocalisations();
    const localisationFromPathname = validLocalisations.filter(vl => vl.path === pathname);
    return localisationFromPathname[0] ? localisationFromPathname[0] : validLocalisations[0];
}

export function sortLocalisationsOrder(localisations) {
    const sortedLocalisations = localisations.sort((a, b) => a.order_number - b.order_number);
    return sortedLocalisations;
}

export default {
    getLocalisationNames,
    getLocalisations,
    setUserLocalisations,
    getCurrentUserLocalisations,
    getUserLocalisationsFromDB,
    addLocalisation,
    updateLocalisation,
    deleteLocalisation,
    getSelectedLocalisation,
    getCurrentLocalisation,
    sortLocalisationsOrder
}