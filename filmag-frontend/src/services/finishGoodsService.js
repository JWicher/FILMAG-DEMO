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

export function getFilteredColumns({ starndardColumns, specialColumns }, reduxState) {
    const { managerMode } = reduxState.reducerServiceMode
    const filteredColumns = [...starndardColumns];
    if (managerMode) {
        filteredColumns.push(specialColumns.column_btnDelete);
    }

    return filteredColumns;
}

const finishGoodsService = {
    getFinishGoods,
    getFinishGoodById,
    addFinishGood,
    updateFinishGood,
    deleteFinishGood,
    getFilteredColumns
};

export default finishGoodsService;
