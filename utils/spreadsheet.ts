import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  })
  
  const getGoogleSheetConnection = async () => {
    const client = await auth.getClient()
    const googleSheets = google.sheets({ version: 'v4', auth: client })
    return { googleSheets }
  }
  
  const getSpreadSheetMetaData = async (googleSheets, spreadsheetId) => {
    return {
      metaData: await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
      })
    }
  }
  
  const getGoogleSheetRows = async (googleSheets, spreadsheetId, range) => {
    return {
      rows: await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range
      })
    }
  }

  const appendSpreadSheetValues = async({googleSheets,spreadsheetId,range,valueInputOption,values}) =>{
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range,
        valueInputOption,
        requestBody: {
          values
        }
      })
  }

  const updateSpreadSheetValues = async({googleSheets,spreadsheetId,range,valueInputOption,values}) =>{
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range,
        valueInputOption,
        requestBody: {
          values
        }
      })
  }

export {  auth, getGoogleSheetConnection, getSpreadSheetMetaData,getGoogleSheetRows,appendSpreadSheetValues,updateSpreadSheetValues }
