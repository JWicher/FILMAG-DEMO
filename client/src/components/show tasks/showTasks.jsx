import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

import TasksHeaderBar from './tasksHeaderBar';
import SortingButtons from './sortingButtons';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import TaskBox from './taskBox';
import Loader from '../common/loader';
import localisationService from '../../services/localisationService';
import taskService from '../../services/taskService';
import userService from '../../services/userService';
import client_paths from '../../constants/client_URL_paths';
import actionsTasks from '../../redux/actions/actionsTasks';
import actionsLocalisations from '../../redux/actions/actionsLocalisations';

const apiUrl = process.env.REACT_APP_BASIC_API_URL

class ShowTasks extends Component {
      state = {
            data: []
      };

      socket = io(apiUrl);

      async componentDidMount() {
            this.mounted = true;
            this.redirectIfNeeded();
            this.setActivityDetection();
            this.props.changeCurrentSortingStatus(false)

            this.socket.on('tasks_updated', async () => await this.fetchNewData())

            try {
                  await this.setCurrentLocalisationInRedux();
                  await this.updateUserValidLocalisations();

                  const { tasks: data_from_DB } = this.props.reducerTasks;
                  const data = data_from_DB !== null ? data_from_DB : await this.getTasksFromDB_updateReducerState()
                  this.mounted && this.setState({ data });
            } catch (ex) {
                  toast.error("Problem z pobraniem danych z serwera.")
            }
      }

      async fetchNewData(){
            try{
                  const data = await this.getTasksFromDB_updateReducerState()
                  this.mounted && this.setState({ data });
            }
            catch (error) {
                  toast.error("Problem z pobraniem danych z serwera.")
            }
      }
      async setCurrentLocalisationInRedux(){
            const { pathname } = this.props.location;
            const currentLocalisation = await localisationService.getCurrentLocalisation(pathname);
            this.props.changeCurrentLocalisation(currentLocalisation);
      }
      async updateUserValidLocalisations(){
            const user = userService.getUserFromJWT();
            const userLocalisations = await localisationService.getUserLocalisationsFromDB(user)
            localisationService.setUserLocalisations(userLocalisations)
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
            this.socket.disconnect();
            window.removeEventListener("visibilitychange", this.onHideApp)
            window.removeEventListener("focus", () => { this.mounted = true })
            window.removeEventListener("blur", () => { this.mounted = false })
      }

      // window event handlers
      setActivityDetection() {
            window.addEventListener("visibilitychange", this.onHideApp)
            window.addEventListener("focus", this.onFocus)
            window.addEventListener("blur", this.onBlur)
      }

      onHideApp = async () => {
            // odświeżenie danych od razu po powrocie do aplikacji
            if (document.visibilityState === "visible") {
                  this.mounted && this.setState({
                        data: await taskService.getTasks()
                  });
            }
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
            changeCurrentSortingStatus: newStatus => dispatch(actionsTasks.changeCurrentSortingStatus(newStatus)),
            changeCurrentLocalisation: localisation =>
                  dispatch(actionsLocalisations.changeCurrentLocalisation(localisation)),
      }
};

export default connect(
      mapStateToProps,
      mapDispatchToProps
)(ShowTasks)
