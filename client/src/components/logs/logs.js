import React, { Component } from 'react';
import { toast } from 'react-toastify';
import LogsHeaderBar from './logsHeaderBar';
import AutosizerBox from './autosizerBox';
import SortingButtonsLogs from './sortingButtonsLogs.js';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import Loader from '../common/loader';
import logsService from '../../services/logsService';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

class Logs extends Component {
      state = {
            data: []
      };

      async componentDidMount() {
        try{
            this.props.changeCurrentSortingStatus("All")
            const data = await logsService.getLogs();
            this.setState({data})

        }
        catch(ex){
            toast.error("Problem z pobraniem danych z serwera.")
        }
      }

      render() {
            const { data } = this.state;

            return (
                  <React.Fragment>
                        <LogsHeaderBar />
                        <div className="app__content">
                              <div className="app__container-buttons">
                                    <SortingButtonsLogs />
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
)(Logs)