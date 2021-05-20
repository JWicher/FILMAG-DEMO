import React from 'react';
import logoEduLEAN from '../../css/images/logo_eduLEAN.png';
import logoEkopak from '../../css/images/logo_ekopak.png'

const Advertisement = () => {
    const show_advertisements = JSON.parse(process.env.REACT_APP_SHOW_ADVERTISEMENTS);

    if (!show_advertisements) {
        return (
            <div className="Advertisement">
                <div className="Advertisement__logo-box">
                    <img src={logoEduLEAN} alt="logoEduLEAN"></img>
                </div>
            </div>
        )
    }

    return (
        <div className="Advertisement">
            <div className="Advertisement__logo-box">
                <img src={logoEduLEAN} alt="logoEduLEAN"></img>
                <img src={logoEkopak} alt="logoEkopak"></img>
            </div>
        </div>
    );
}


export default Advertisement;