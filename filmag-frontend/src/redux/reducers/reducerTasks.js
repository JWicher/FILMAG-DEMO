import { UPDATE_TASKS, CHANGE_CURRENT_SORTING_TASK_STATUS, TOGGLE_CHOOSE_MANY_TASKS_MODE, UPDATE_CHOOSED_TASKS_FROM_MANAGER_MODE } from '../constants/actionTypes';

const reducerTasks = (state = {}, action) => {

  switch (action.type) {

    case UPDATE_TASKS: {
      return ({ ...state, tasks: action.tasks });
    }
    case CHANGE_CURRENT_SORTING_TASK_STATUS: {
      return ({ ...state, currentSortingStatus: action.currentSortingStatus });
    }
    case TOGGLE_CHOOSE_MANY_TASKS_MODE: {
      return ({ ...state, chooseManyTasksMode: action.chooseManyTasksMode });
    }
    case UPDATE_CHOOSED_TASKS_FROM_MANAGER_MODE: {
      return ({ ...state, selectedTasksIDs_fromManagerMode: action.selectedTasksIDs_fromManagerMode });
    }
    // no default

  }

  return state;

};

export default reducerTasks;