import httpService from "./httpService";
import server_path from '../constants/server_URL_paths';

const apiEndPoint = server_path.logs;

async function getLogs() {
    const { data: logs } = await httpService.get(apiEndPoint + "/parsed");
    return logs;
}

async function getLogsFile() {
    const { data: logs } = await httpService.get(apiEndPoint + "/file");
    return logs;
}

const logsService = {
    getLogs,
    getLogsFile
};

export default logsService;
