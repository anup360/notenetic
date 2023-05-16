import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

const exportPDF = (element, options) => {
    savePDF(element, options);
};

const PDFExportHelper = { exportPDF };

export default PDFExportHelper;