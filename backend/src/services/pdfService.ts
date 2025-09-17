import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

function formatContentForPDF(content: string): string {
    return content
        .replace(/\*\*/g, '')
        .replace(/^\*\s/gm, '• ');
}

export async function generateFormattedPDF(content: string, outputFilePath: string): Promise<void> {
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margins: { top: 50, bottom: 50, left: 72, right: 72 } });
            const stream = fs.createWriteStream(outputFilePath);
            doc.pipe(stream);

            doc.fontSize(20).font('Helvetica-Bold').text('Academic Assistant Agent - Solved Assignment', { align: 'center' });
            doc.moveDown(2);

            const formattedContent = formatContentForPDF(content);
            const lines = formattedContent.split('\n');

            let isLatexBlock = false;

            for (const line of lines) {
                if (line.trim() === '---') {
                    doc.moveDown(2);
                    // Draw a horizontal line
                    const pageWidth = doc.page.width;
                    const leftMargin = doc.page.margins.left;
                    const rightMargin = doc.page.margins.right;
                    const lineWidth = pageWidth - leftMargin - rightMargin;
                    const y = doc.y;
                    doc.moveTo(leftMargin, y)
                        .lineTo(leftMargin + lineWidth, y)
                        .stroke();
                    doc.moveDown(2);
                    continue;
                }

                if (line.trim().startsWith('Answer:')) {
                    doc.moveDown();
                }

                if (line.trim() === '$$') {
                    isLatexBlock = !isLatexBlock;
                    if (isLatexBlock) {
                        doc.font('Courier').fontSize(10);
                    } else {
                        doc.font('Helvetica').fontSize(12);
                    }
                    doc.text(line);
                    continue;
                }

                if (isLatexBlock) {
                    doc.font('Courier').fontSize(10).text(line);
                } else {
                    doc.font('Helvetica').fontSize(12).text(line, { align: 'justify' });
                }
            }

            doc.end();
            stream.on('finish', resolve);
            stream.on('error', reject);
        } catch (err) {
            reject(err);
        }
    });
}