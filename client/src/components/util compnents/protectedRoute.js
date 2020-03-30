import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import userService from '../../services/userService';

const ProtectedRoute = ({ path, requireUserLevel, redirectPath, component: Component, render, ...rest }) => {
    const user = userService.getUserFromJWT();
    if (!user) {
        return <Redirect to={redirectPath} />
    }

    const accessDenied = userService.isCurrentUserLessThan(requireUserLevel);

    return (
        <Route path={path} {...rest}
            render={props => {
                if (accessDenied) return <Redirect to={redirectPath} />
                return Component ? <Component {...props} /> : render(props);
            }}
        />
    )
};

export default ProtectedRoute;