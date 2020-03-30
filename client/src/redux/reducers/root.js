import { combineReducers } from 'redux';
import reducerTasks from './reducerTasks';
import reducerLocalisations from './reducerLocalisations';
import reducerServiceMode from './reducerServiceMode';

const rootReducer = combineReducers({
  reducerTasks,
  reducerLocalisations,
  reducerServiceMode
});

export default rootReducer;