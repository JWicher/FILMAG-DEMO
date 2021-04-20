import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = ({ item, action }) => {
    function renderIcon() {
        let iconType;
        switch(item.category){
            case "Magazyn": iconType = "cubes"; break;
            case "Maszyna": iconType = "circle-o"; break;
            case "Utrzymanie ruchu": iconType = "wrench"; break;
            case "Produkcja": iconType = "industry"; break;
            case "Ustawienia": iconType = "cog"; break;
            case "Wyroby gotowe": iconType = "truck"; break;
            case "Opcja ustawień": iconType = "list-alt"; break;
            default: iconType = "";
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