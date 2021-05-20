import React from 'react';
import { confirmAlert } from 'react-confirm-alert';

const ConfirmAlert = (props) => {

    function openPopup() {
        const { item, itemRepresentation } = props;
        const { title, action, message } = props.form;
        
        confirmAlert({
            title: title,
            message: message || itemRepresentation,
            buttons: [
                {
                    label: 'Potwierdzam',
                    onClick: () => action(item)
                },
                {
                    label: 'Anuluj',
                    onClick: () => { return null }
                }
            ]
        })
    }

    const { btn_label, btn_css, isNoActionButton = false } = props.form;
    const { disableButton = false } = props;

    if (isNoActionButton) return <button className={"btn " + btn_css} >{btn_label} </button>;

    return (
        <button
            className={"btn " + btn_css}
            onClick={openPopup}
            disabled={disableButton}
            >{btn_label}
        </button>
    );
}
 
export default ConfirmAlert