
export function runFunctionAfterPressEnter(target, runFunction) {
    if (target.charCode === 13)
        runFunction();
}

export function getDateFromRegistrationTime(date) {
    return date.slice(0, 10);
}

export function getTimeFromRegistrationTime(date) {
    return date.slice(13, 18);
}

export function getSortedDataByStatus(data, sortingCriteria) {
    if(sortingCriteria === "All") return data;
    
    const sortedData = data.filter( item => item.isClosed === sortingCriteria)
    return sortedData;
}

const utils = {
    runFunctionAfterPressEnter,
    getDateFromRegistrationTime,
    getTimeFromRegistrationTime,
    getSortedDataByStatus
};

export default utils;
