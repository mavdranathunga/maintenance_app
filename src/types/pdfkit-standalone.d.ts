declare module "pdfkit/js/pdfkit.standalone.js" {
  import type PDFDocument from "pdfkit";
  const PDFDocumentExport: typeof PDFDocument;
  export default PDFDocumentExport;
}
