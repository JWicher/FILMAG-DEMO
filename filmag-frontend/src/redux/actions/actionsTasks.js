import { UPDATE_TASKS, CHANGE_CURRENT_SORTING_TASK_STATUS, TOGGLE_CHOOSE_MANY_TASKS_MODE, UPDATE_CHOOSED_TASKS_FROM_MANAGER_MODE } from '../constants/actionTypes';

export const updateTasks = (tasks) => ({
  type: UPDATE_TASKS,
  tasks: tasks
});
export const changeCurrentSortingStatus = (currentSortingStatus) => ({
  type: CHANGE_CURRENT_SORTING_TASK_STATUS,
  currentSortingStatus: currentSortingStatus
});
export const toggleChooseManyTasksMode = (chooseManyTasksMode) => ({
  type: TOGGLE_CHOOSE_MANY_TASKS_MODE,
  chooseManyTasksMode: chooseManyTasksMode
});
export const updateChoosenTasksFromManagerMode = (selectedTasksIDs_fromManagerMode) => ({
  type: UPDATE_CHOOSED_TASKS_FROM_MANAGER_MODE,
  selectedTasksIDs_fromManagerMode: selectedTasksIDs_fromManagerMode
});

const actionsTasks = {
  updateTasks,
  changeCurrentSortingStatus,
  toggleChooseManyTasksMode,
  updateChoosenTasksFromManagerMode
};

export default actionsTasks;
