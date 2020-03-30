import React from 'react';
import { Link } from 'react-router-dom';

const LinkWithButton = ({label, path, css = "btn btn-secondary btn-sm"}) => {
    return ( 
        <Link to={ path } >
            <button className={css}>{ label }</button>
        </Link>
     );
}
 
export default LinkWithButton;