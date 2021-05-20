import { toast } from 'react-toastify';
import userService from '../../services/userService';
import localisationService from '../../services/localisationService';
import client_paths from '../../constants/client_URL_paths';

const loginPageHelper = {
    redirectUserToNextPath(history){
        const userLocalisations = localisationService.getCurrentUserLocalisations();
        const isSupervisor = userService.isCurrentUserGreaterThanORequalTo("Koordynator");
        const isCommonUser = userService.getUserFromJWT().isCommonUser;

        if (isSupervisor || isCommonUser) {
            history.push(client_paths.tasks.main);
        }
        else if (userLocalisations.length > 1) {
            history.push(client_paths.selectLocalisation);
        }
        else if (userLocalisations.length === 1) {
            history.push(userLocalisations[0].path);
        }
        else {
            toast.error("Obecnie Twoje konto nie posiada dostępu do żadych lokalizacji. Zgłoś problem przełożonemu lub adminowi.");
            return null;
        }
    }
};

export default loginPageHelper;