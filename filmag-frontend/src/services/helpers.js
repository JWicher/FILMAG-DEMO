import { useEffect } from 'react';
import { toast } from 'react-toastify';

const helpers = {
    fetchAndSetNewData: async (isMounted, fetchMethod, updateState) => {
        try{
            const data = await fetchMethod()
            isMounted && updateState(data);
        }
        catch (error) {
            toast.error("Problem z pobraniem danych z serwera.")
        }
    },
    useEffectAsync(introAction, exitAction, inputs = []) {
        useEffect(() => {
            introAction();
            return () => exitAction()
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, inputs);
    }
};

export default helpers;
