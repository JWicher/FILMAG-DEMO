import React, { Component } from 'react';
import { toast } from 'react-toastify';
import LogsHeaderBar from './logsHeaderBar';
import AutosizerBox from './autosizerBox';
import SortingButtonsLogs from './sortingButtonsLogs.js';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import Loader from '../common/loader';
import logsService from '../../services/logsService';

class Logs extends Component {
      state = {
            data: [],
            sortingType: ""
      };

      async componentDidMount() {
            try{
                  const data = await logsService.getLogs();
                  this.setState({data})
            }
            catch(ex){
                  toast.error("Problem z pobraniem danych z serwera.")
            }
      }
      
      handleChangeSortingStatus = sortingType => this.setState({sortingType});

      render() {
            const { data } = this.state;
            const dataToRender = this.state.sortingType && data.filter( record =>  record.level === this.state.sortingType ) || data

            return (
                  <React.Fragment>
                        <LogsHeaderBar />
                        <div className="app__content">
                              <div className="app__container-buttons">
                                    <SortingButtonsLogs
                                          handleChangeSortingStatus={this.handleChangeSortingStatus}
                                          sortingType={this.state.sortingType}
                                          />
                                    <LogoutButtonBox />
                              </div>
                              {!dataToRender ? <Loader /> : <AutosizerBox data={dataToRender} />}
                        </div>
                  </React.Fragment>
            );
      }
}

export default Logs