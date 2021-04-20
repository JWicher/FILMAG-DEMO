import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import userService from '../../services/userService';

const ProtectedRoute = ({ path, requireUserLevel, acceptedExceptions = [], redirectPath, component: Component, render, ...rest }) => {
    const user = userService.getUserFromJWT();
    if (!user) {
        return <Redirect to={redirectPath} />
    }
    
    const isException = acceptedExceptions
                            .map(exceptionJob => userService.isCurrentUserEqualTo(exceptionJob))
                            .some(bool => bool);
    const accessAccepted = userService.isCurrentUserGreaterThanORequalTo(requireUserLevel) || isException;

    return (
        <Route path={path} {...rest}
            render={props => {
                if (!accessAccepted) return <Redirect to={redirectPath} />
                return Component ? <Component {...props} /> : render(props);
            }}
        />
    )
};

export default ProtectedRoute;