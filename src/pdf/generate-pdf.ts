import { Worker } from 'worker_threads';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';


export default class PdfManager {
    private readonly maxWorkers: number;
    private activeWorkers: number = 0;

    public constructor(maxWorkers: number) {
        this.maxWorkers = maxWorkers;
    }

    public async generatePDF(pagesData: any[]): Promise<void> {
        let currentWorker = 0;
        const doc = new PDFDocument({ margin: 0, size: 'A4' });
        const output = fs.createWriteStream('relatorio.pdf');

        // Canaliza o PDF gerado para o arquivo
        doc.pipe(output);

        return new Promise((resolve, reject) => {
            const startWorker = () => {
                if (currentWorker >= pagesData.length) {
                    if (this.activeWorkers === 0) {
                        doc.end(); // Finaliza o documento PDF
                        console.log('Todas as tarefas foram concluídas.');
                        resolve();
                    }
                    return;
                }else{
                    console.log('Processando senha: ', currentWorker + 1);
                }

                const currentPage = pagesData[currentWorker];
                this.activeWorkers++;
                currentWorker++;

                const worker = new Worker(path.resolve(__dirname, 'pdf-worker.js'), {
                    workerData: { page: currentPage },
                });

                worker.on('message', (pageContent) => {
                    // Adiciona o conteúdo da página ao PDF
                    doc.addPage();
                    doc.text(pageContent, { align: 'center' });

                    this.activeWorkers--;
                    startWorker(); // Inicia o próximo worker
                });

                worker.on('error', (error) => reject(error));
                worker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Worker finalizado com código ${code}`));
                    }
                });
            }

            for (let i = 0; i < this.maxWorkers; i++) {
                startWorker();
            }
        });
    }
}
