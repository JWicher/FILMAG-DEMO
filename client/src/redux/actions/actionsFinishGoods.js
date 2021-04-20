import {
  UPDATE_FINISH_GOODS,
  TOGGLE_CHOOSE_MANY_FINISHGOOD_MODE,
  UPDATE_CHOOSED_FINISHGOODS_FROM_MANAGER_MODE,
  CHANGE_CURRENT_SORTING_FINISHGOOD_STATUS
} from '../constants/actionTypes';

export const updateFinishGoods = (finishGoods) => ({
  type: UPDATE_FINISH_GOODS,
  finishGoods: finishGoods
});

export const toggleChooseManyFinishGoodMode = (bool) => ({
  type: TOGGLE_CHOOSE_MANY_FINISHGOOD_MODE,
  chooseManyFinishGoodsMode: bool
});

export const updateChoosenFinishGoodsFromManagerMode = (selectedIds) => ({
  type: UPDATE_CHOOSED_FINISHGOODS_FROM_MANAGER_MODE,
  selectedFinishGoodIDs_fromManagerMode: selectedIds
});

export const changeCurrentSortingStatus = (currentSortingStatus) => ({
  type: CHANGE_CURRENT_SORTING_FINISHGOOD_STATUS,
  currentSortingStatusFinishGoods: currentSortingStatus
});

export default {
  updateFinishGoods,
  toggleChooseManyFinishGoodMode,
  updateChoosenFinishGoodsFromManagerMode,
  changeCurrentSortingStatus
}
