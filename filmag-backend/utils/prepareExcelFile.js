const XLSX = require('xlsx');


function createExcellFileBuffer(dataFromDB) {
    const workbook = createExcelWorkbook({ SheetNames: [], Sheets: {} })
    const workbook_readyToSend = addExcellSheetToWorkbook(workbook, dataFromDB)
    const excelWorkbookContent = XLSX.write(workbook_readyToSend, { bookType: 'xlsx', type: 'buffer' });
    return new Buffer.from(excelWorkbookContent);
}
function addExcellSheetToWorkbook(properWorkbook, dataFromDB) {
    const workbook = properWorkbook;
    const excelSheetName = "Zdarzenia";
    const excelSheet = createExcelSheetWithData(dataFromDB);
    XLSX.utils.book_append_sheet(workbook, excelSheet, excelSheetName);
    return workbook;
}
function createExcelSheetWithData(dataFromDB) {
    const newData = dataFromDB.map(item => item = prepareItem(item)).reverse();
    const data = [header, ...newData]
    const excelSheet = XLSX.utils.json_to_sheet(
        data,
        {
            header: [ // dane niebrane do realizacji, tylko prezentacja poglądowa
                "createdInFormatedData",
                "location",
                "content",
                "qty",
                "time",
                "isDone",
                "takedBy",
                "type",
                "createdBy",
                "closedBy"
            ],
            skipHeader: true
        });
    return excelSheet;
}
function createExcelWorkbook(workbookObject) {
    const workbook = workbookObject;
    workbook.Props = { Title: "FILMA - rejestr zdarzeń", Author: "FILMAG" };
    return workbook;
}
function prepareItem(item) {
    const type = getItemType(item.type);
    return {
        createdInFormatedData: item.createdInFormatedData,
        location: item.location,
        content: item.content,
        qty: item.qty,
        time: item.time,
        takedBy: item.takedBy ? item.takedBy : "?",
        type: type,
        isDone: item.isDone ? "Zakończono" : "---Niezakończono---",
        createdBy: item.createdBy,
        closedBy: item.closedBy
    }
}
function getItemType(type) {
    switch (type) {
        case "order": return "Zamówienie"; break;
        case "orderTakeout": return "Odbiór palet"; break;
        case "breakdown": return "Awaria"; break;
        case "modelChange": return "Przezbrojenie"; break;
        case "cleaning": return "Czyszczenie"; break;
    }
}

const header = {
    isDone: "Status",
    createdInFormatedData: 'Data rejestracji',
    location: 'Miejsce',
    content: 'Zdarzenie ',
    qty: 'Ilość',
    time: "Czas",
    takedBy: 'Obsługiwał',
    type: 'Typ',
    createdBy: 'Zarejestrował',
    closedBy: "Zamknął"
};

module.exports = {
    createExcellFileBuffer
};
