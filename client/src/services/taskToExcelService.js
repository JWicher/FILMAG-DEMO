import httpService from "./httpService";
import { toast } from "react-toastify";
import filesaver from 'file-saver';
import server_path from '../constants/server_URL_paths';

const apiEndPoint = server_path.getTasksInExcelFile;

export async function getTasksInExcelFile() {
    try {
        const fileName = getFileName();
        const { data } = await httpService.get(apiEndPoint, { responseType: 'arraybuffer' });
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; base64' })
        filesaver.saveAs(blob, fileName);
    }
    catch (ex) {
        toast.error("Nie można ściągnąć pliku.")
    }
}

function getFileName() {
    const timeOnServer_GMT0 = new Date().getTime();
    const timeOffset_Poland = -120;
    const localTimeInPoland = timeOnServer_GMT0 - timeOffset_Poland * 60 * 1000; // local Time in Poland
    const date = new Date(localTimeInPoland).toISOString();
    const day = date.slice(0, 10);
    const hour = date.slice(11, 13);
    const minutes = date.slice(14, 16);
    const seconds = date.slice(17, 19);

    return "FILMAG-Wykaz zdarzeń - " + day + "-" + hour + minutes + seconds + ".xlsx";
}

export default {
    getTasksInExcelFile
}
