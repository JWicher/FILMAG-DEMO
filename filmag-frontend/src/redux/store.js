import { createStore } from 'redux';
import rootReducer from './reducers/root';

const initialState = {
  reducerTasks: {
    tasks: null,
    currentSortingStatus: false,
    chooseManyTasksMode: false,
    selectedTasksIDs_fromManagerMode: []
  },
  reducerLocalisations: {
    currentLocalisation: {
      name: "",
      category: "Magazyn"
    }
  },
  reducerServiceMode: {
    serviceMode: false,
    serviceMode_jobName: "Admin",
    managerMode: false // w przyciskach "tryb zarządzania"
  },
  reducerFinishGood: {
    finishGoods: null,
    currentSortingStatusFinishGoods: "All",
    chooseManyFinishGoodsMode: false,
    selectedFinishGoodIDs_fromManagerMode: []
  },
  reducerLogs: {
    currentSortingStatusLogs: "All",
  }
};

export const store = createStore(rootReducer, initialState);
window.store = store;