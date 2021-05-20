const client_URL_paths = {
    tasks: {
        main: "/show-tasks",
        paramId: "/show-tasks/:id"
    },
    home: "/",
    loginPage: "/login",
    noPermissions: "/no-permissions",
    selectLocalisation: "/select-localisation",
    getExcelFileWithTasks: "/getExcelFile",
    settings: {
        main: "/settings",
        user: "/settings/user",
        users: "/settings/users",
        localisations: "/settings/localisations"
    },
    finishGoods : {
        main: "/finish-goods",
        paramId: "/finish-goods/:id"
    },
    logs: "/logs"
}

export default client_URL_paths;
