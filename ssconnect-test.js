const {GoogleSpreadsheet} = require("google-spreadsheet"); 
require('dotenv').config();

const gs_creds_string = process.env.GS_CREDS;
const gs_creds = JSON.parse(gs_creds_string);

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

const authGoogleSheet = async() => { 
    try{
        await doc.useServiceAccountAuth(gs_creds); 
        await doc.loadInfo();
    }catch(err){ 
        console.log( "AUTH ERROR ", err) 
    } 
} 

const addSheetRow = async(data) => {
    await doc.loadInfo();
    const sheet = doc.sheetsById[process.env.SHEET_ID];
    await sheet.addRow(data);
}

module.exports = { authGoogleSheet, addSheetRow };

const readSheetRow = async() => {
    await doc.loadInfo();
    const sheet = doc.sheetsById[process.env.SHEET_ID];
    const rows = await sheet.getRows();
    console.log(rows.length);

    const results = rows.filter(row => row.user === "홍시");
    const results_time = results.map(res => res.time_recorded);
    console.log(results_time);
}

const editSheetRow = async() => {
    await doc.loadInfo();
    const sheet = doc.sheetsById[process.env.SHEET_ID];
}

authGoogleSheet();
readSheetRow();