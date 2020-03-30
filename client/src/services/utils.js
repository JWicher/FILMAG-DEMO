
export function runFunctionAfterPressEnter(target, runFunction) {
    if (target.charCode === 13)
        runFunction();
}

export function getDateFromTaskCreatedIn(date) {
    return date.slice(0, 10);
}

export function getTimeFromTaskCreatedIn(date) {
    return date.slice(11, 19);
}


function getCustomTaskCss(path, customClassName) {
    if (path === "#") return "task-box__" + customClassName + "_index";
    else if (path === "content") return "task-box__" + customClassName + "_content";
    else if (path === "status") return "task-box__" + customClassName + "_status";
    else if (path === "qty") return "task-box__" + customClassName + "_qty";
    else if (path === "partialQty") return "task-box__" + customClassName + "_partialQty";
    else if (path === "location") return "task-box__" + customClassName + "_location";
    else if (path === "time") return "task-box__" + customClassName + "_time";
    else if (path === "take") return "task-box__" + customClassName + "_take";
    else if (path === "btnClose") return "task-box__" + customClassName + "_btnClose";
    else if (path === "takedBy") return "task-box__" + customClassName + "_takedBy";
    else if (path === "createdInFormatedData") return "task-box__" + customClassName + "_createdInFormatedData";
    else if (path === "btnDelete") return "task-box__" + customClassName + "_btnDelete";
    return;
}

export default {
    runFunctionAfterPressEnter,
    getCustomTaskCss,
    getDateFromTaskCreatedIn,
    getTimeFromTaskCreatedIn,
}