import httpService from "./httpService";
import server_path from '../constants/server_URL_paths';

const apiEndPoint = server_path.logs;

export async function getLogs() {
    const { data: logs } = await httpService.get(apiEndPoint);
    return logs;
}

export default {
    getLogs
}