const columnsTaskBox = {
    getTaskBoxColumns: () => ({
        common: [
            { label: "#", path: "index" },
            { label: "Zdarzenie", path: "content" },
            { label: "Ilość", path: "qty" },
            { label: "Dostarczono", path: "partialQty" },
            { label: "Miejsce", path: "location" },
            { label: "Czas", path: "time" },
        ],
        special: {
            column_take: { label: "", path: "take" },
            column_btnClose: { label: "", path: "btnClose" },
            column_createdInFormatedData: { label: "Data rejestracji", path: "createdInFormatedData" },
            column_takedBy: { label: "Obsługuje", path: "takedBy" },
            column_btnDelete: { label: "", path: "btnDelete" }
        }
    })
};

export default columnsTaskBox;