import React from 'react';
import { Link } from 'react-router-dom';

const MenuMainItem = ({label, path, icon}) => {
    return ( 
        <Link to={path}>
            <li className="app__header-menu_item app__header-menu_item-main">
                <i className={"fa fas " + icon}></i>
                <p>{label}</p>
            </li>
        </Link>
     );
}
 
export default MenuMainItem;