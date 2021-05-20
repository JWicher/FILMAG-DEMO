import { TOGGLE_SERVICE_MODE, CHANGE_SERVICE_MODE_JOB_NAME, TOGGLE_DELETE_TASK_MODE } from '../constants/actionTypes';

const reducerServiceMode = (state = {}, action) => {
  switch (action.type) {

    case TOGGLE_SERVICE_MODE: {
      return ({ ...state, serviceMode: action.serviceMode });
    }
    case CHANGE_SERVICE_MODE_JOB_NAME: {
      return ({ ...state, serviceMode_jobName: action.serviceMode_jobName });
    }
    case TOGGLE_DELETE_TASK_MODE: {
      return ({ ...state, managerMode: action.managerMode });
    }
    // no default

  }

  return state;

};

export default reducerServiceMode;