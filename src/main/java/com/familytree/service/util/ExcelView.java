package com.familytree.service.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.poi.ooxml.POIXMLProperties;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;

public class ExcelView {

    private static final String SHEETNAME = "sheetname";
    private static final String HEADERS = "headers";
    private static final String RESULTS = "results";

    @SuppressWarnings("unchecked")
    public XSSFWorkbook buildExcelDocument(Map<String, Object> model, HttpServletRequest request) {
        //VARIABLES REQUIRED IN MODEL
        String sheetName = (String) model.get(SHEETNAME);
        List<String> headers = (List<String>) model.get(HEADERS);
        List<List<String>> results = (List<List<String>>) model.get(RESULTS);
        List<String> numericColumns = new ArrayList<>();
        if (model.containsKey("numericcolumns")) numericColumns = (List<String>) model.get("numericcolumns");

        //BUILD DOC
        XSSFWorkbook wb = createXSSFWorkbook();

        XSSFSheet sheet = createSheet(wb, sheetName, request, headers);

        pupolateTable(wb, results, sheet, numericColumns, headers);

        return wb;
    }

    private XSSFWorkbook createXSSFWorkbook() {
        XSSFWorkbook wb = new XSSFWorkbook();

        // file info
        POIXMLProperties xmlProps = wb.getProperties();
        POIXMLProperties.CoreProperties coreProps = xmlProps.getCoreProperties();
        coreProps.setCreator("Eleaflet");

        return wb;
    }

    private XSSFSheet createSheet(XSSFWorkbook wb, String sheetName, HttpServletRequest request, List<String> headers) {
        XSSFSheet sheet = wb.createSheet(sheetName);
        sheet.setDefaultColumnWidth((short) 30);
        if (request.getHeader("Accept-Language").equalsIgnoreCase("en")) {
            sheet.setRightToLeft(false);
        } else {
            sheet.setRightToLeft(true);
        }

        // HEADER
        XSSFCellStyle headerStyle = wb.createCellStyle();

        // color
        headerStyle.setFillForegroundColor(color(wb, "bbbbbb"));
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        // alignment
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // font
        XSSFFont headerFont = wb.createFont();
        headerFont.setFontHeightInPoints((short) 16);
        headerFont.setFontName("Calibri");
        headerFont.setBold(true);
        headerFont.setColor(color(wb, "000000"));
        headerStyle.setFont(headerFont);

        Row headerRow = sheet.createRow(0);
        headerRow.setHeightInPoints(30);

        int currentColumn = 0;
        for (String header : headers) {
            Cell cell = headerRow.createCell(currentColumn);
            cell.setCellStyle(headerStyle);
            cell.setCellValue(header);
            currentColumn++;
        }
        return sheet;
    }

    private void pupolateTable(
        XSSFWorkbook wb,
        List<List<String>> results,
        XSSFSheet sheet,
        List<String> numericColumns,
        List<String> headers
    ) {
        // CELL STYLE
        XSSFCellStyle cellStyle = wb.createCellStyle();

        // alignment
        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

        // font
        Font cellFont = wb.createFont();
        cellFont.setFontHeightInPoints((short) 12);
        cellFont.setFontName("Calibri");
        cellStyle.setFont(cellFont);

        //POPULATE VALUE ROWS/COLUMNS
        int currentRow = 1; //exclude header
        int currentColumn; //exclude header
        for (List<String> result : results) {
            currentColumn = 0;
            XSSFRow row = sheet.createRow(currentRow);
            row.setHeightInPoints((short) 26);

            for (String value : result) { //used to count number of columns
                XSSFCell cell = row.createCell(currentColumn);
                cell.setCellStyle(cellStyle);

                if (numericColumns.contains(headers.get(currentColumn))) {
                    cell.setCellType(CellType.NUMERIC);
                    cell.setCellValue(value);
                } else {
                    cell.setCellValue(value);
                }
                currentColumn++;
            }
            currentRow++;
        }
    }

    private XSSFColor color(XSSFWorkbook workbook, String rgbHex) {
        XSSFCreationHelper helper = new XSSFCreationHelper(workbook);
        XSSFColor color = helper.createExtendedColor();
        color.setARGBHex(rgbHex);
        return color;
    }
}
