import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { io } from "socket.io-client";

import FinishGoodsHeaderBar from './finishGoodsHeaderBar';
import AutosizerBox from './autosizerBox';
import SortingButtonsFinishGoods from './sortingButtonsFinishGoods.js';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import Loader from '../common/loader';
import finishGoodsService from '../../services/finishGoodsService';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const apiUrl = process.env.REACT_APP_BASIC_API_URL

class FinishGoods extends Component {
      state = {
            data: []
      };

      socket = io(apiUrl);

      async componentDidMount() {
            this.mounted = true;
            this.socket.on('finishgoods_updated', async () => await this.fetchNewData())

            try{
                  this.props.changeCurrentSortingStatus("All")
                  this.fetchNewData()
            }
            catch(ex){
                  toast.error("Problem z pobraniem danych z serwera.")
            }
      }

      async fetchNewData(){
            try{
                  const data = await finishGoodsService.getFinishGoods()
                  this.mounted && this.setState({ data });
            }
            catch (error) {
                  toast.error("Problem z pobraniem danych z serwera.")
            }
      }

      componentWillUnmount() {
            this.mounted = false;
            this.socket.disconnect();
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
            changeCurrentSortingStatus: bool => dispatch(actionsFinishGoods.changeCurrentSortingStatus(bool)),
      }
};

export default connect(
      mapStateToProps,
      mapDispatchToProps
)(FinishGoods)