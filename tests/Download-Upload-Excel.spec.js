/*
 * The script performs the following steps:
 * 1. Navigates to a webpage for file upload/download testing.
 * 2. Downloads an Excel file from the webpage and saves it locally.
 * 3. Reads the downloaded Excel file, searches for a specific text ('Mango'), and updates a cell value.
 * 4. Uploads the modified Excel file back to the webpage.
 * 5. Verifies that the updated value is reflected on the webpage.
 *
 * Helper functions 'writeToExcel' and 'readFromExcel' are used to manipulate the Excel file.
 */
import { test, expect } from '@playwright/test'
import ExcelJS from 'exceljs'
 
async function writeToExcel(params) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = await workbook.xlsx.readFile(params.sheetPath)
    const sheetName = worksheet.getWorksheet(params.sheetName)
    const myObject = await readFromExcel(sheetName, params.searchText)
 
    const currentCell = sheetName.getCell(myObject.row, myObject.col + params.colOffset)
    currentCell.value = params.updatedText
 
    // for git commit, i am writing into new file
    await workbook.xlsx.writeFile(params.sheetPath)
}
 
async function readFromExcel(sheetName, searchText) {
    let myObject = { row: -1, col: -1 }
    sheetName.eachRow((row) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {
                console.log(`${searchText} found in row ${row.number} & column ${colNumber}`)
                myObject.row = row.number
                myObject.col = colNumber
            }
        })
    })
    return myObject
}
 
test('upload and download', async ({ page }) => {
    // variables
    const sheetPath = 'test-data/downloadedExcel.xlsx'
    const sheetName = 'Sheet1'
    const searchText = 'Papaya'
    const updatedText = '1000'
 
    await page.goto('/upload-download-test/index.html', { waitUntil: 'domcontentloaded' })
 
    // Download the file and save as excel
    const downloadPromise = page.waitForEvent('download')
    await page.getByText('Download').click() // click the download button
    const download = await downloadPromise // wait for download event to complete
    await download.saveAs(sheetPath) // save the file
 
    // Read the file and update the value
    await writeToExcel({ sheetPath, sheetName, searchText, updatedText, colOffset: 2 })
 
    // Upload the file and check if the value is updated
    await page.locator('#fileinput').setInputFiles(sheetPath)
 
    // Assert the value in page, is updated
    const locatorForSearchText = page.getByText(searchText)
    const IdentifiedRow = page.getByRole('row').filter({ has: locatorForSearchText })
 
    await expect(IdentifiedRow.locator('#cell-4-undefined')).toContainText(updatedText);
    
})