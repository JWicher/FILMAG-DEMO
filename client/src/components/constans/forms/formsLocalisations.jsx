import React from 'react';

export default {
    confirmAlert: (actionHandler) => ({
        title: 'Potwierdź usunięcie lokalizacji',
        btn_label: <p><span className="localisation__content_btn-label_full">Usuń lokalizację</span><span className="localisation__content_btn-label_short">X</span></p>,
        btn_css: "btn-danger btn-sm",
        action: (localisation) => actionHandler(localisation)
    }),
    addLocalisation: (actionHandler) => ({
        title: "Dodaj nową lokalizację",
        p_label: "Nazwa",
        placeholder_1: "Podaj nazwę lokalizacji",
        btn_label: "Dodaj nową lokalizację",
        btn_css: "btn btn-success btn-sm",
        action: (localisation) => actionHandler(localisation)
    })

}