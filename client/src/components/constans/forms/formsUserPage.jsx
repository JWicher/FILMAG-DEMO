export default {
    resetPassword: (actionHandler) => ({
        title: "Zmień hasło",
        p_label: "Obecne",
        input_1_type: "password",
        name_1: "password",
        p_label_2: "Nowe",
        name_2: "newPassword",
        btn_label: "Zmień hasło",
        btn_css: "btn btn-outline-danger btn-sm",
        action: (pwd) => actionHandler(pwd)
    }),
    resetPIN: (actionHandler) => ({
        title: "Zmień PIN",
        p_label: "Hasło",
        p_label_2: "Nowy PIN",
        input_1_type: "password",
        name_1: "password",
        name_2: "newPIN",
        placeholder_1: "Podaj obecne hasło",
        placeholder_2: "Podaj nowe hasło",
        btn_label: "Zmień PIN",
        btn_css: "btn btn-outline-danger btn-sm",
        action: (pin) => actionHandler(pin)
    }),
}