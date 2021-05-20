import axios from 'axios';
import { toast } from 'react-toastify';
import authService from './authService';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
setHeader_xAuthToken(authService.getJwt());
setDefaultHeaders()

let errorCount = 0;
axios.interceptors.response.use(null, error => {
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

  if (!expectedError && errorCount === 0) {
    errorCount += 1;
    toast.error("Brak połączenia z serwerem.")
    setTimeout(function () { errorCount = 0 }, 2000)
  }
  return Promise.reject(error)
})


export function setHeader_xAuthToken(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;

}
function setDefaultHeaders(){
  axios.defaults.headers.common["Content-Type"] = "application/json;charset=UTF-8"
}

const httpService = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
  setHeader_xAuthToken
};

export default httpService;
