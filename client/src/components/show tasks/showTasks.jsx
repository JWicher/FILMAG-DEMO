import React, { Component } from 'react';
import { toast } from 'react-toastify';
import TasksHeaderBar from './tasksHeaderBar';
import SortingButtons from './sortingButtons';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import TaskBox from './taskBox';
import Loader from '../common/loader';
import localisationService from '../../services/localisationService';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import client_paths from '../../constants/client_URL_paths';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';
import actionsLocalisations from '../../redux/actions/actionsLocalisations';

class ShowTasks extends Component {
      state = {
            data: []
      };

      interval_cdm_refreshingData = '' // interwał do oðświeżania danych co 10 sekund

      async componentDidMount() {
            this.mounted = true;
            this.redirectIfNeeded();
            this.setActivityDetection();
            try {
                  const { pathname } = this.props.location;
                  const currentLocalisation = await localisationService.getCurrentLocalisation(pathname);
                  this.props.changeCurrentLocalisation(currentLocalisation);

                  const { tasks: data_from_DB } = this.props.reducerTasks;
                  const data = data_from_DB !== null ? data_from_DB : await this.getTasksFromDB_updateReducerState()
                  this.mounted && this.setState({ data });
            } catch (ex) {
                  if (ex.response)
                        toast.error("Problem z pobraniem danych z serwera.")
            }
            this.interval_cdm_refreshingData = this.set_interval_refreshData()// uruchomienie odświeżania danych
      }

      async getTasksFromDB_updateReducerState() {
            const tasks = await taskService.getTasks();
            this.props.updateTasks(tasks);
            return tasks;
      }

      static getDerivedStateFromProps(props, state) {
            if (props.reducerTasks.tasks !== state.tasks) {
                  return { data: props.reducerTasks.tasks };
            }
            if (props.reducerServiceMode.serviceMode !== state.serviceMode) {
                  return { serviceMode: props.reducerServiceMode.tasks };
            }
            if (props.reducerServiceMode.serviceMode_jobName !== state.serviceMode_jobName) {
                  return { serviceMode_jobName: props.reducerServiceMode.tasks };
            }

            return null;
      }

      componentWillUnmount() {
            this.mounted = false;
            this.remove_intervals_refreshData();
            this.removeActivityDetection();
      }

      // window event handlers
      setActivityDetection() {
            window.addEventListener("visibilitychange", this.onHideApp)
            window.addEventListener("focus", this.onFocus)
            window.addEventListener("blur", this.onBlur)
      }

      removeActivityDetection() {
            window.removeEventListener("visibilitychange", this.onHideApp)
            window.removeEventListener("focus", this.onFocus)
            window.removeEventListener("blur", this.onBlur)
      }

      onFocus = () => {
            // uruchomienie odświeżania danych po powrocie do aplikacji
            this.mounted = true;
            this.interval_onFocus_refreshingData = this.set_interval_refreshData()
      }

      onBlur = () => {
            // przestanie wysyłania zapytań na serwer wyjściu z zakładki aplikacji
            this.remove_intervals_refreshData();
      }

      onHideApp = async () => {
            // odświeżenie danych od razu po powrocie do aplikacji
            if (document.visibilityState === "visible") {
                  this.mounted && this.setState({
                        data: await taskService.getTasks()
                  });
                  this.remove_intervals_refreshData();
                  this.interval_onHideApp_refreshingData = this.set_interval_refreshData()
            }
            else if (document.visibilityState === "hidden") {
                  this.remove_intervals_refreshData();
            }
      }

      set_interval_refreshData = () => {
            return window.setInterval(
                  async () => {
                        const tasks = await this.getTasksFromDB_updateReducerState();
                        this.mounted && this.setState({ data: tasks })
                  }
                  , 10000)
      }

      remove_intervals_refreshData() {
            this.mounted = false;
            clearInterval(this.interval_cdm_refreshingData);
            clearInterval(this.interval_onFocus_refreshingData);
            clearInterval(this.interval_onHideApp_refreshingData);
      }

      // services

      async redirectIfNeeded() {
            const isCommonUser = userService.getUserFromJWT().isCommonUser;
            const isNormalWorker = userService.isCurrentUserLessThan("Koordynator") && !isCommonUser;
            const seletedLocalisation = await localisationService.getSelectedLocalisation(this.props.match.params.id);

            if (!seletedLocalisation && isNormalWorker) {
                  this.props.history.push(client_paths.selectLocalisation);
            }
            else if (!isNormalWorker) {
                  this.props.history.push(client_paths.tasks.main);
            }
      }

      // render
      render() {
            const { data } = this.state;

            return (
                  <React.Fragment>
                        <TasksHeaderBar />
                        <div className="app__content">
                              <div className="app__container-buttons">
                                    <SortingButtons />
                                    <LogoutButtonBox />
                              </div>
                              {data && data.length === 0 && <Loader />}
                              {data && <TaskBox data={data} />}
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
            updateTasks: tasks => dispatch(actionsTasks.updateTasks(tasks)),
            changeCurrentLocalisation: localisation =>
                  dispatch(actionsLocalisations.changeCurrentLocalisation(localisation)),
      }
};

export default connect(
      mapStateToProps,
      mapDispatchToProps
)(ShowTasks)
