import React from 'react';

export default {
    deleteUser: (actionHandler) => ({
        title: "Potwierdź usunięcie konta",
        btn_label: <p><span className="user__content_btn-label_full">Usuń konto</span><span className="user__content_btn-label_short">X</span></p>,
        btn_css: "btn btn-danger btn-sm",
        action: (user) => actionHandler(user)
    }),
    resetPassword: (actionHandler) => ({
        title: "Resetowanie hasło",
        btn_label: <p><span className="user__content_btn-label_full">Resetuj hasło</span><span className="user__content_btn-label_short">R</span></p>,
        message: `Resetujesz hasło użytkownika. Nowe hasło: 12345.`,
        btn_css: "btn btn-secondary btn-sm",
        action: (user) => actionHandler(user)
    }),
    addteUser: (actionHandler) => ({
        title: "Dodaj konto użytkownika",
        p_label: "Login",
        btn_label: "Dodaj nowe konto",
        placeholder_1: "Podaj nazwę użytkownika",
        btn_css: "btn btn-success btn-sm",
        action: (inputData) => actionHandler(inputData)
    })
}