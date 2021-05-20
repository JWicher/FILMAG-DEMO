import React from 'react';
import utilsService from '../../services/utils';


const LoginBox = ({ user, inputHandler, loginHandler }) => {

    const handleInputOnChange = ({ currentTarget: input }) => {
        user[input.name] = input.value;
        inputHandler(user);
    };
    
    return (
        <div className="login-page_login_box">
            <h1>Zaloguj się</h1>
            <div className="login-page_login_box__input-box">
                <div className="login-page_login_box__input-box_group">
                    <p>Login</p>
                    <input
                        name="name"
                        autoComplete="off"
                        autoFocus
                        onChange={handleInputOnChange}
                        onKeyPress={(target) => utilsService.runFunctionAfterPressEnter(target, loginHandler)}
                    ></input>
                </div>
            </div>
            <div className="login-page_login_box__input-box">
                <div className="login-page_login_box__input-box_group">
                    <p>Hasło</p>
                    <input
                        name="password"
                        autoComplete="off"
                        type="password"
                        onChange={handleInputOnChange}
                        onKeyPress={(target) => utilsService.runFunctionAfterPressEnter(target, loginHandler)}
                    ></input>
                </div>
            </div>
            <div className="login-page_login_box__button-group">
                <button onClick={loginHandler}
                    >Zaloguj się
                </button>
            </div>
        </div>
    );
}
 
export default LoginBox;