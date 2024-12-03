import PDFKit from 'pdfkit';
import fs from 'fs';
import path from 'path';

export default class GeneratePDF {
    static async generatePDF(data: any) {
        const doc = new PDFKit();
        const pdfFilePath = path.join('teste.pdf');

        doc.pipe(fs.createWriteStream(pdfFilePath));

        doc.fontSize(12).text(data);

        doc.end();
    }
}
