const {GoogleSpreadsheet} = require("google-spreadsheet"); 
require('dotenv').config();

const gs_creds_string = process.env.GS_CREDS;
const gs_creds = JSON.parse(gs_creds_string);

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

const authGoogleSheet = async() => { 
    try{
        await doc.useServiceAccountAuth(gs_creds); 
        await doc.loadInfo() 
        console.log("ok")
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