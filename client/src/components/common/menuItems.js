import React from 'react';
import MenuItem from './menuItem';

const MenuItems = ({ items, action }) => {
    return (
        items.map(item =>
            <MenuItem key={item.name || item.label}
                item={item}
                action={() => action(item)}
            />
        )
    );
}

export default MenuItems;