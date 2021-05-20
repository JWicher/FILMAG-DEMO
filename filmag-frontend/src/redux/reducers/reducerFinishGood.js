import {
  UPDATE_FINISH_GOODS,
  TOGGLE_CHOOSE_MANY_FINISHGOOD_MODE,
  UPDATE_CHOOSED_FINISHGOODS_FROM_MANAGER_MODE,
  CHANGE_CURRENT_SORTING_FINISHGOOD_STATUS
} from '../constants/actionTypes';

const reducerFinishGood = (state = {}, action) => {

  switch (action.type) {

    case UPDATE_FINISH_GOODS: {
      return ({ ...state, finishGoods: action.finishGoods });
    }

    case TOGGLE_CHOOSE_MANY_FINISHGOOD_MODE: {
      return ({ ...state, chooseManyFinishGoodsMode: action.chooseManyFinishGoodsMode });
    }

    case UPDATE_CHOOSED_FINISHGOODS_FROM_MANAGER_MODE: {
      return ({ ...state, selectedFinishGoodIDs_fromManagerMode: action.selectedFinishGoodIDs_fromManagerMode });
    }

    case CHANGE_CURRENT_SORTING_FINISHGOOD_STATUS: {
      return ({ ...state, currentSortingStatusFinishGoods: action.currentSortingStatusFinishGoods });
    }
    // no default

  }

  return state;

};

export default reducerFinishGood;