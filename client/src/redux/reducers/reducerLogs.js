import { CHANGE_CURRENT_SORTING_LOGS_STATUS } from '../constants/actionTypes';

const reducerLogs = (state = {}, action) => {

  switch (action.type) {

    case CHANGE_CURRENT_SORTING_LOGS_STATUS: {
      return ({ ...state, currentSortingStatusLogs: action.currentSortingStatusLogs });
    }
    // no default

  }

  return state;

};

export default reducerLogs;