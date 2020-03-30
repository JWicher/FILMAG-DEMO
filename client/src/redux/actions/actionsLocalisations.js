import { CHANGE_CURRENT_LOCALISATION } from '../constants/actionTypes';

export const changeCurrentLocalisation = (currentLocalisation) => ({
  type: CHANGE_CURRENT_LOCALISATION,
  currentLocalisation: currentLocalisation
});

export default {
  changeCurrentLocalisation
}
