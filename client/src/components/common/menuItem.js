import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ item, action }) => {
    function renderIcon() {
        let iconType;
        if (item.category === "Magazyn") {
            iconType = "cubes";
        }
        else if (item.category === "Maszyna") {
            iconType = "cubes invisible";
        }
        else if (item.category === "Utrzymanie ruchu") {
            iconType = "wrench";
        }
        return (
            <i className={"fa fas fa-" + iconType}></i>
        )
    }
    return (
        <Link to={item.path} >
            <li className="app__header-menu_item" onClick={action} >
                {item.category && renderIcon()}
                {item.name || item.label}
            </li>
        </Link>
    );
}

export default MenuItem;