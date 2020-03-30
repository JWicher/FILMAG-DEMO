// import taskService from './taskService';


// function ActivityChecker() {

//     this.setActivityDetection = function () {
//         console.log('setActivityDetection')
//         window.addEventListener("visibilitychange", this.onHideApp)
//         window.addEventListener("focus", this.onFocus)
//         window.addEventListener("blur", this.onBlur)
//     }

//     this.removeActivityDetection = function () {
//         console.log('removeActivityDetection')

//         window.removeEventListener("visibilitychange", this.onHideApp)
//         window.removeEventListener("focus", this.onFocus)
//         window.removeEventListener("blur", this.onBlur)
//     }
//     this.onFocus = () => {
//         console.log('onFocus')

//         // uruchomienie odświeżania danych po powrocie do aplikacji
//         this.mounted = true;
//         this.interval_onFocus_refreshingData = this.set_interval_refreshData()
//     }
//     this.onBlur = () => {
//         console.log('onBlur')
//         // przestanie wysyłania zapytań na serwer wyjściu z zakładki aplikacji
//         this.remove_intervals_refreshData();
//     }
//     this.onHideApp = async () => {
//         console.log('onHideApp')

//         // odświeżenie danych od razu po powrocie do aplikacji
//         if (document.visibilityState === "visible") {
//             this.mounted && this.setState({
//                 data: await taskService.getTasks()
//             });
//             this.remove_intervals_refreshData();
//             this.interval_onHideApp_refreshingData = this.set_interval_refreshData()
//         }
//         else if (document.visibilityState === "hidden") {
//             this.remove_intervals_refreshData();
//         }
//     }
//     this.set_interval_refreshData = async () => {
//         console.log('set_interval_refreshData thisthis', this)

//         return window.setInterval(
//             async () => this.mounted && this.setState({ data: await taskService.getTasks() })
//             , 10000)
//     };
//     this.remove_intervals_refreshData = function () {
//         console.log('remove_intervals_refreshData')

//         this.mounted = false;
//         clearInterval(this.interval_cdm_refreshingData);
//         clearInterval(this.interval_onFocus_refreshingData);
//         clearInterval(this.interval_onHideApp_refreshingData);
//     }


// }

// export default {
//     ActivityChecker
// }