// Array de dados para o relatório
import GeneratePDF from "./pdf/generate-pdf";

const pages = Array.from({ length: 300 }, (_, i) => ({
    content: `Página ${i + 1} do relatório`,
}));

const generatePDF = new GeneratePDF(5);

generatePDF.generatePDF(pages).then(() => {
    console.log('PDF gerado com sucesso!');
});
