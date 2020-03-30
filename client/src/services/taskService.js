import httpService from "./httpService";
import userService from './userService.js';
import { toast } from "react-toastify";
import server_path from '../constants/server_URL_paths';


const apiEndPoint = server_path.tasks;

export async function getTasks() {
    try {
        const { data: tasks } = await httpService.get(apiEndPoint);

        if (document.visibilityState === "visible") {
            localStorage.setItem("lastActivityTime", new Date().getTime())
        }
        return tasks;
    }
    catch (ex) {
        if (ex && ex.response.status === 423) { } // nic nie rób jak jest odmowa ze strony serwera przez zbyt długi braku aktywności
        else {
            toast.error("Nie można uzyskać danych o zdarzeniach.");
            return [];
        }
    }
}

export async function addTask(task) {
    const { data: addedTask } = await httpService.post(apiEndPoint, task);
    return addedTask;
}

export async function updateTask(taskToUpdate) {
    const { data: updatedTask } = await httpService.put(apiEndPoint + "/" + taskToUpdate._id, taskToUpdate);
    return updatedTask;
}

export async function deleteTask(taskToUpdate) {
    const { data: deletedTask } = await httpService.delete(apiEndPoint + "/" + taskToUpdate._id);
    return deletedTask;
}

function getFilteredTasks_bySortingStatus(data, currentSortingStatus) { //
    if (currentSortingStatus === "All") return data;
    return data.filter(item => item.isDone === currentSortingStatus);
}

function getFilterTasks_byLocation(data, currentLocalisation) { //
    if (currentLocalisation.category === "Magazyn") return data
    else if (currentLocalisation.category === "Utrzymanie ruchu") return data.filter(item => item.type === "breakdown")
    else return data.filter(item => item.location === currentLocalisation.name);
}

export function getSortedData(tasks, reduxState) {
    const { reducerTasks, reducerLocalisations } = reduxState
    tasks = getFilterTasks_byLocation(tasks, reducerLocalisations.currentLocalisation);
    tasks = getFilteredTasks_bySortingStatus(tasks, reducerTasks.currentSortingStatus);
    return tasks;
}

export function getFilteredColumns(columns, reduxState) {
    const { reducerServiceMode, reducerLocalisations } = reduxState
    const isServiceMode_jobName = (jobName) => {
        const { serviceMode_jobName } = reducerServiceMode;
        if (jobName === "Koordynator") {
            return userService.getUserJobValue(serviceMode_jobName) >= userService.getUserJobValue(jobName);
        }
        return serviceMode_jobName === jobName;
    }

    const { currentLocalisation } = reducerLocalisations;
    const { serviceMode, serviceMode_jobName, managerMode } = reducerServiceMode;

    const isManagingSet = userService.isThisJobManaging(serviceMode_jobName)
    const filteredColumns = [...columns.common];

    filteredColumns.push(columns.special.column_takedBy)

    if (!serviceMode ? userService.isCurrentUserEqualTo("Magazynier") : isServiceMode_jobName("Magazynier")) {
        filteredColumns.push(columns.special.column_take);
    }
    if (!serviceMode ? userService.isCurrentUserEqualTo("Operator") : isServiceMode_jobName("Operator")) {
        filteredColumns.push(columns.special.column_btnClose);
    }
    if (currentLocalisation.category !== "Utrzymanie ruchu") {
        if (!serviceMode ? userService.isCurrentUserGreaterThanORequalTo("Koordynator") : isServiceMode_jobName("Koordynator"))
            filteredColumns.push(columns.special.column_createdInFormatedData);
    }
    if (serviceMode ? isManagingSet && managerMode : managerMode) {
        filteredColumns.push(columns.special.column_btnClose);
        filteredColumns.push(columns.special.column_btnDelete)
    }
    if (!serviceMode ? userService.isCurrentUserEqualTo("Magazynier") : isServiceMode_jobName("Magazynier")) {
        filteredColumns.push(columns.special.column_btnClose);
    }

    return filteredColumns;
}

export default {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getSortedData,
    getFilteredColumns
}