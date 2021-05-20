import React, { useState } from 'react';
import { connect } from 'react-redux';
import { io } from "socket.io-client";

import FinishGoodsHeaderBar from './finishGoodsHeaderBar';
import AutosizerBox from './autosizerBox';
import SortingButtonsFinishGoods from './sortingButtonsFinishGoods.js';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import Loader from '../common/loader';
import finishGoodsService from '../../services/finishGoodsService';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';
import helper from "../../services/helpers";

const apiUrl = process.env.REACT_APP_BASIC_API_URL

const FinishGoods = (props) => {
      const [data, setData] = useState(null);
      const [isMounted, setIsMounted] = useState(true);

      const socket = io(apiUrl);

      const fetchAndSetNewData = () => helper.fetchAndSetNewData(isMounted, finishGoodsService.getFinishGoods, setData);

      helper.useEffectAsync(async () => {
                  props.changeCurrentSortingStatus("All");
                  socket.on('finishgoods_updated', async () => await fetchAndSetNewData())
                  await fetchAndSetNewData()
            },
            () => {
                  setIsMounted(false)
                  socket.disconnect()
            }, [])

      return (
            <React.Fragment>
                  <FinishGoodsHeaderBar />
                  <div className="app__content">
                        <div className="app__container-buttons">
                              <SortingButtonsFinishGoods />
                              <LogoutButtonBox />
                        </div>
                        {!data ? <Loader /> : <AutosizerBox data = {data} />}
                  </div>
            </React.Fragment>
      );
}
 
const mapDispatchToProps = (dispatch) => {
      return {
            changeCurrentSortingStatus: bool => dispatch(actionsFinishGoods.changeCurrentSortingStatus(bool)),
      }
};

export default connect(
      (state) =>  state,
      mapDispatchToProps
)(FinishGoods)