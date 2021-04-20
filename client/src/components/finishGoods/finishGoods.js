import React, { Component } from 'react';
import { toast } from 'react-toastify';
import FinishGoodsHeaderBar from './finishGoodsHeaderBar';
import AutosizerBox from './autosizerBox';
import SortingButtonsFinishGoods from './sortingButtonsFinishGoods.js';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import Loader from '../common/loader';
import finishGoodsService from '../../services/finishGoodsService';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

class FinishGoods extends Component {
      state = {
            data: []
      };

      async componentDidMount() {
        try{
            const { finishGoods: data_from_DB } = this.props.reducerFinishGood;
            const data = data_from_DB !== null ? data_from_DB : await finishGoodsService.getFinishGoods();
            this.props.updateFinishGoods(data);
            this.props.changeCurrentSortingStatus("All")
            this.setState({data})

        }
        catch(ex){
            toast.error("Problem z pobraniem danych z serwera.")
        }
      }

      static getDerivedStateFromProps(props, state) {
            if (props.reducerFinishGood.finishGoods !== state.finishGoods) {
                  return { data: props.reducerFinishGood.finishGoods };
            }

            return null;
      }

      render() {
            const { data } = this.state;

            return (
                  <React.Fragment>
                        <FinishGoodsHeaderBar />
                        <div className="app__content">
                              <div className="app__container-buttons">
                                    <SortingButtonsFinishGoods />
                                    <LogoutButtonBox />
                              </div>
                              {!data && <Loader />}
                              {data && <AutosizerBox data = {data} />}
                        </div>
                  </React.Fragment>
            );
      }
}

const mapStateToProps = (state) => {
      return state;
  };
  
const mapDispatchToProps = (dispatch) => {
return {
      updateFinishGoods: finishGoods => dispatch(actionsFinishGoods.updateFinishGoods(finishGoods)),
      changeCurrentSortingStatus: bool => dispatch(actionsFinishGoods.changeCurrentSortingStatus(bool)),
}
};

export default connect(
      mapStateToProps,
      mapDispatchToProps
)(FinishGoods)