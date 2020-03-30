import userService from './userService';

const timeLimit = 7200000;

// window event handlers
function setActivityDetection() {
    window.addEventListener("load", checkUserActivity)
    window.addEventListener("focus", checkUserActivity)
    window.addEventListener("visibilitychange", onReturn)
    window.addEventListener("unload", setLastActivity)
}
function removeActivityDetection() {
    window.removeEventListener("load", checkUserActivity)
    window.removeEventListener("focus", checkUserActivity)
    window.removeEventListener("visibilitychange", onReturn)
    window.removeEventListener("unload", setLastActivity)
}
function onReturn() {
    if (document.visibilityState === "visible")
        checkUserActivity()
}
function setLastActivity() {
    localStorage.setItem("lastActivityTime", new Date().getTime())
}
function getLastActivity() {
    return localStorage.getItem("lastActivityTime", new Date().getTime())
}
function checkUserActivity() {
    const lastActivityTime = getLastActivity();
    const user = userService.getUserFromJWT();

    if (lastActivityTime && user) {
        const now = new Date().getTime();
        const timeExceeded = now - lastActivityTime > timeLimit;

        if (timeExceeded) {
            localStorage.clear()
            window.location = '/'
            return
        }
    }

    setLastActivity()
}
export default {
    setActivityDetection,
    removeActivityDetection
}