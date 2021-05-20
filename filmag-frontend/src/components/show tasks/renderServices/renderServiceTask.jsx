import React from 'react';
import ButtonTakeTask from '../../button components/buttonTakeTask';
import ButtonCloseTask from '../../button components/buttonCloseTask';
import ButtonDeleteTask from '../../button components/buttonDeleteTask';
import ButtonPartialDelivery from '../../button components/buttonPartialDelivery';
import CustomCheckBox from '../../common/customCheckBox';

const renderServiceTask = {
    init: ({user, chooseManyTasksMode, isSelected, reducerServiceMode}) => {
        function getTakedByLabel(task) {
            const orderType = (task.type === "order" || task.type === "orderTakeout");
            return orderType ? (task.takedBy || "?") : task.createdBy
        };
        function renderTaskContent(task) {
            return (
                <React.Fragment>
                    <div className="task-box__task_content-text">{task.content}</div>
                    <div className="task-box__task_content-createdInFormatedData">{task.createdInFormatedData}</div>
                </React.Fragment>
            )
        };
        function renderQty(task) {
            const alreadyDelivered = task.partialQty ? task.partialQty : 0;
            return (
                <React.Fragment>
                    <div className="task-box__task_qty-main">{task.qty}</div>
                    {!task.isDone && <div className="task-box__task_qty-partialDelivery">({alreadyDelivered})</div>}
                </React.Fragment>
            )
        };
        function renderCloseButton(task) {
            const { serviceMode_jobName, managerMode } = reducerServiceMode;
    
            const isOperator = user.job === 'Operator' || serviceMode_jobName === 'Operator';
            const isMagazynierAndHisTask = user.job === 'Magazynier' || serviceMode_jobName === 'Magazynier';
    
            if (isOperator || isMagazynierAndHisTask || managerMode) {
                return <ButtonCloseTask task={task} />;
            }
        };
        function renderDeleteButton(task){
            if (chooseManyTasksMode) {
                return (
                    <CustomCheckBox
                        isChecked={isSelected}
                        action={() => { return }}
                    />)
            }
            return <ButtonDeleteTask task={task} />;
        };
        function renderUpdateButton(task){
            if (task.type === "order" && task.takedBy === user.name){
                return <ButtonPartialDelivery task={task} />;
            }
            else if (task.type === "order" || task.type === "orderTakeout"){
                return <ButtonTakeTask task={task} />;
            }
        };

        return {
            renderContent(task, columnPath, index) {
                switch(columnPath){
                    case("index"): return index;
                    case("content"): return renderTaskContent(task);
                    case("qty"): return task.type === "order" ? renderQty(task) : "";
                    case("partialQty"): return task.type === "order" ? task.partialQty : "";
                    case("location"): return task.location;
                    case("time"): return task.time >= 1400 ? "24h+" : task.time;
                    case("takedBy"): return getTakedByLabel(task);
                    case("btnClose"): return (!task.isDone && !chooseManyTasksMode && renderCloseButton(task));
                    case("take"): return (!task.isDone && renderUpdateButton(task));
                    case("createdInFormatedData"): return task.createdInFormatedData;
                    case("btnDelete"): return renderDeleteButton(task);
                    default: return;
                }
            },
            taskCustomCSS(task) {
                if (task.isUrgent && !task.isDone) return "priority-task";
                else if (task.isDone) return "task-box__task-color_ok";
                else if (task.partialTime >= 10 || task.type === "breakdown") return "task-box__task-color_ng";
                else if (task.type === "modelChange" || task.type === "cleaning") return "task-box__task-color_warning";
                else { return "" };
            }
        }
    }
};

export default renderServiceTask;
