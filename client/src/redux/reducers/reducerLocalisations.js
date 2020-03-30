import { CHANGE_CURRENT_LOCALISATION } from '../constants/actionTypes';

const reducerLocalisations = (state = {}, action) => {
  switch (action.type) {

    case CHANGE_CURRENT_LOCALISATION: {
      return ({ ...state, currentLocalisation: action.currentLocalisation });
    }
    // no default

  }

  return state;

};

export default reducerLocalisations;