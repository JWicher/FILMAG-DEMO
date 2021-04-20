import React from 'react';
import ButtonReserveFinishGood from '../button components/buttonReserveFinishGood';
import ButtonDeleteFinishGood from '../button components/buttonDeleteFinishGood';
import ButtonCloseFinishGood from '../button components/buttonCloseFinishGood';
import CustomCheckBox from '../common/customCheckBox';
import userService from '../../services/userService';
import utils from '../../services/utils';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const FinishGood = React.memo((props) => {
    const { chooseManyFinishGoodsMode, selectedFinishGoodIDs_fromManagerMode } = props.reducerFinishGood;
    const isSelected = selectedFinishGoodIDs_fromManagerMode.includes(props.finishGood._id)

    const rederRegistrationData = (finishGood, column) =>{
        return (
            <React.Fragment >
                <div className={`${utils.getCustomCssClass(column.path, "finishGood-box__finishGood")}-full`}>{finishGood.createdAtFormatedData}</div>
                <div className={`${utils.getCustomCssClass(column.path, "finishGood-box__finishGood")}-splitted`}>
                    <div>{utils.getDateFromRegistrationTime(finishGood.createdAtFormatedData)}</div>
                    <div>{utils.getTimeFromRegistrationTime(finishGood.createdAtFormatedData)}</div>
                </div>
            </React.Fragment>
        )

    }
    function renderContent(finishGood, column, index) {
        if (column.path === "index") return index;
        else if (column.path === "rawMaterialPrice") return `${finishGood.rawMaterialPrice.value} ${finishGood.rawMaterialPrice.currency}`;
        else if (column.path === "reservation"){
            if(finishGood.isClosed) return;
            const userReserved = finishGood.reservedBy === userService.getUserFromJWT().name;
            const finishGoodIsReserved = finishGood.reservedBy !== "";
            return userReserved || !finishGoodIsReserved ? <ButtonReserveFinishGood finishGood={finishGood} /> : finishGood.reservedBy
        }
        else if (column.path === "status"){
            const showedText = finishGood.isClosed ? "Zamknięte" : "Otwarte";
            const doNotRederCloseButton = userService.isCurrentUserEqualTo("Handlowiec");
            if(doNotRederCloseButton) return showedText;
            return !finishGood.isClosed ? <ButtonCloseFinishGood finishGood={finishGood} /> : showedText
        }
        else if (column.path === "btnDelete"){
            if (chooseManyFinishGoodsMode) {
                return (
                    <CustomCheckBox
                        isChecked={isSelected}
                        action={() => { return }}
                    />
                )
            }
            else return <ButtonDeleteFinishGood finishGood={finishGood} />;
        }
        else if (column.path === "createdAtFormatedData") return rederRegistrationData(finishGood, column)

        return finishGood[column.path];
    }

    const handleClickInManagerMode = (selected_finishGood) => {
        const { selectedFinishGoodIDs_fromManagerMode: selectedData } = props.reducerFinishGood;
        const index = selectedData.findIndex(finishGoodId => finishGoodId === selected_finishGood._id);

        if (index < 0) selectedData.push(selected_finishGood._id);
        else selectedData.splice(index, 1);

        props.updateChoosenFinishGoodsFromManagerMode(selectedData)
    }

    // return
    const { finishGood, columns, index } = props;

    return (
            <div
                className="finishGood-box__finishGood"
                onClick={() => { chooseManyFinishGoodsMode && handleClickInManagerMode(finishGood) }}
                >
                {columns.map(column =>
                    <div key={finishGood._id + column.path} className={utils.getCustomCssClass(column.path, "finishGood-box__finishGood")}>
                        {renderContent(finishGood, column, index)}
                    </div>
                )}
            </div>
    );
})


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateFinishGoods: finishGoods => dispatch(actionsFinishGoods.updateFinishGoods(finishGoods)),
        updateChoosenFinishGoodsFromManagerMode: finishGoodIds => dispatch(actionsFinishGoods.updateChoosenFinishGoodsFromManagerMode(finishGoodIds)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FinishGood)