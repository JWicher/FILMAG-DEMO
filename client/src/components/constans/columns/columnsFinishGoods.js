export default {
    getFinishGoodsColumns: () => ({
        starndardColumns: [
            { label: "#", path: "index" },
            { label: "Nazwa", path: "name" },
            { label: "Opis", path: "description" },
            { label: "Ilość", path: "qty" },
            { label: "Zarejestrowno", path: "createdAtFormatedData" },
            { label: "Cena", path: "rawMaterialPrice" },
            { label: "Rezerwacja", path: "reservation" },
            { label: "Status", path: "status" }
        ],
        specialColumns: {
            column_btnDelete: { label: "", path: "btnDelete" }
        }
    })
}