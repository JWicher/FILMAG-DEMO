import React, { Component } from 'react';
import LinkWithButton from '../common/linkWithButton';
import userService from '../../services/userService';
import localisationService from '../../services/localisationService';
import client_paths from '../../constants/client_URL_paths';

class SelectLocalisation extends Component {
    state = { validLocalisations: [] };

    componentDidMount() {
        const user = userService.getUserFromJWT();
        const validLocalisations = localisationService.getCurrentUserLocalisations();

        if (user.isCommonUser) {
            this.props.history.push(client_paths.tasks.main);
            return;
        }
        this.setState({ validLocalisations });
    }

    renderSelectLocalisationButtons() {
        const { validLocalisations } = this.state;
        const style = "btn btn-secondary btn-sm select-localisation__valid-localiation";
        return (
            validLocalisations.map(vl =>
                <LinkWithButton key={vl.name} label={vl.name} path={vl.path} css={style} />
            )
        )
    }

    render() {
        return (
            <React.Fragment>
                <header className="app__header">
                    <div className="app__header-title">FILMAG</div>
                </header>
                <div className="app__content">
                    <div className="select-localisation">
                        <h1>Wybierz lokalizację</h1>
                        <div className="select-localisation__wrapper">
                            {this.renderSelectLocalisationButtons()}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default SelectLocalisation;