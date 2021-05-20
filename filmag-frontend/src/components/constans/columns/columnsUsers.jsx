import React from 'react';

const columnsUsers = {
    getUserColumns: () => [
        {   label: "#", path: "#" },
        {   label: "Pracownik", path: "name" },
        {   label: "Stanowisko", path: "userJob" },
        {   label: <i className="fa fas fa-desktop"></i>, path: "status" },
        {
            label:
                <div>
                    <span className="user__content_btn-label_full">Magazyn</span>
                    <span className="user__content_btn-label_short">MG</span>
                </div>,
            path: "Magazyn"
        },
        {
            label:
                <div>
                    <span className="user__content_btn-label_full">Maszyny</span>
                    <span className="user__content_btn-label_short">MS</span>
                </div>,
            path: "Maszyny"
        },
        {
            label:
                <div>
                    <span className="user__content_btn-label_full">Utrzymanie ruchu</span>
                    <span className="user__content_btn-label_short">UR</span>
                </div>,
            path: "Utrzymanie ruchu"
        },
        {
            label:
                <div>
                    <span className="user__content_btn-label_full">Wyroby gotowe</span>
                    <span className="user__content_btn-label_short">WG</span>
                </div>,
            path: "Wyroby gotowe"
        },
        { label: "", path: "btn-reset" }
    ]
};

export default columnsUsers;