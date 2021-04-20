import httpService from "./httpService";
import server_path from '../constants/server_URL_paths';


const apiEndPoint = server_path.finishGoods;

export async function getFinishGoods() {
    const { data: finishGoods } = await httpService.get(apiEndPoint);
    return finishGoods;
}

export async function getFinishGoodById(Id) {
    const { data: finishGood } = await httpService.get(apiEndPoint + "/" + Id);
    return finishGood;
}

export async function addFinishGood(finishGood) {
    const { data: addedFinishGood } = await httpService.post(apiEndPoint, finishGood);
    return addedFinishGood;
}

export async function updateFinishGood(finishGoodToUpdate) {
    const { data: updatedFinishGood } = await httpService.put(apiEndPoint + "/" + finishGoodToUpdate._id, finishGoodToUpdate);
    return updatedFinishGood;
}

export async function deleteFinishGood(finishGoodToDelete) {
    const { data: deletedFinishGood } = await httpService.delete(apiEndPoint + "/" + finishGoodToDelete._id);
    return deletedFinishGood;
}

export function getFilteredColumns(columns, reduxState) {
    const { managerMode } = reduxState.reducerServiceMode
    const filteredColumns = [...columns.common];
    if (managerMode) {
        filteredColumns.push(columns.special.column_btnDelete);
    }

    return filteredColumns;
}

export default {
    getFinishGoods,
    getFinishGoodById,
    addFinishGood,
    updateFinishGood,
    deleteFinishGood,
    getFilteredColumns
}