import { combineReducers } from 'redux';
import reducerTasks from './reducerTasks';
import reducerLocalisations from './reducerLocalisations';
import reducerServiceMode from './reducerServiceMode';
import reducerFinishGood from './reducerFinishGood';
import reducerLogs from './reducerLogs';

const rootReducer = combineReducers({
  reducerTasks,
  reducerLocalisations,
  reducerServiceMode,
  reducerFinishGood,
  reducerLogs
});

export default rootReducer;