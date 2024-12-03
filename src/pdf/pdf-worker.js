const {parentPort, workerData} = require('worker_threads');
const PDFDocument = require('pdfkit');

const generatePDF = (pageData) => {
    try{
        const doc = new PDFDocument({ margin: 0, size: 'A4', autoFirstPage: false });

        // Envia chunks do PDF para o processo principal
        doc.on('data', (chunk) => {
            parentPort?.postMessage(chunk);
        });

        doc.on('end', () => {
            // Informa que terminou o processamento da página
            parentPort?.postMessage('done');
        });

        doc.addPage();
        doc.text(pageData, { align: 'center' });
        doc.end();
    }catch (e) {
        postMessage('error', e);
    }
};

generatePDF(workerData.page.content);
