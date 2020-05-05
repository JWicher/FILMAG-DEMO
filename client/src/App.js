import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import ShowTasks from './components/show tasks/showTasks';
import SettingsSwitch from './components/settings/settingsSwitch';
import Home from './components/home page/home';
import SelectLocalisation from './components/util compnents/selectLocalisation';
import ProtectedRoute from './components/util compnents/protectedRoute';
import LoginPage from './components/login page/loginPage';
import NoPermissions from './components/util compnents/noPermssions';
import checkUserActivity from './services/checkUserActivityService';
import auth from './services/authService';
import client_path from './constants/client_URL_paths';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {};
  
  componentDidMount() {
    checkUserActivity.setActivityDetection();
    try {
      const user = jwtDecode(auth.getJwt);
      this.setState({ user });
    }
    catch (ex) { } // ignoruj brak tokenu
  }

  componentWillUnmount() {
    checkUserActivity.removeActivityDetection();
  };

  render() {
    document.title = "FILMAG";
    return (
      <div className="App">
        <ToastContainer />
        <Switch>
          <ProtectedRoute
            path={client_path.tasks.paramId}
            requireUserLevel={"Operator"}
            redirectPath={client_path.loginPage}
            component={ShowTasks}
          />
          <ProtectedRoute
            path={client_path.tasks.main}
            requireUserLevel={"Operator"}
            redirectPath={client_path.loginPage}
            component={ShowTasks}
          />
          <ProtectedRoute
            path={client_path.selectLocalisation}
            requireUserLevel={"Operator"}
            redirectPath={client_path.loginPage}
            component={SelectLocalisation}
          />
          <ProtectedRoute
            path={client_path.settings.main}
            requireUserLevel={"Operator"}
            redirectPath={client_path.noPermissions}
            component={SettingsSwitch}
          />
          <ProtectedRoute
            path={client_path.noPermissions}
            requireUserLevel={"Operator"}
            redirectPath={client_path.loginPage} component={NoPermissions}
          />
          <Route
            path={client_path.loginPage}
            component={LoginPage}
          />
          {this.state.user && <Redirect to={client_path.tasks.main} />}
          <Route
            path={client_path.home}
            component={Home}
          />
        </Switch>
      </div>
    );
  }
}

export default App;