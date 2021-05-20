import {
  TOGGLE_SERVICE_MODE,
  CHANGE_SERVICE_MODE_JOB_NAME,
  TOGGLE_DELETE_TASK_MODE
} from '../constants/actionTypes';

export const toggleServiceMode = (bool) => ({
  type: TOGGLE_SERVICE_MODE,
  serviceMode: bool
});
export const changeServiceMode_jobName = (job_name) => ({
  type: CHANGE_SERVICE_MODE_JOB_NAME,
  serviceMode_jobName: job_name
});
export const toggleManagerMode = (bool) => ({
  type: TOGGLE_DELETE_TASK_MODE,
  managerMode: bool
});

const actionsServiceMode = {
  toggleServiceMode,
  changeServiceMode_jobName,
  toggleManagerMode
};

export default actionsServiceMode;
