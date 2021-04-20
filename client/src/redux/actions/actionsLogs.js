import { CHANGE_CURRENT_SORTING_LOGS_STATUS } from '../constants/actionTypes';

export const changeCurrentSortingStatus = (currentSortingStatus) => ({
  type: CHANGE_CURRENT_SORTING_LOGS_STATUS,
  currentSortingStatusLogs: currentSortingStatus
});

export default {
  changeCurrentSortingStatus
}
