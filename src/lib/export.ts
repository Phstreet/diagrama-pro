import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { DiagramDocument } from '../types/diagram';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function exportJson(document: DiagramDocument) {
  downloadBlob(new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' }), 'diagrama-pro.json');
}
export async function exportCanvas(format: 'png' | 'svg' | 'pdf') {
  const element = document.querySelector<HTMLElement>('.react-flow__viewport');
  if (!element) throw new Error('Canvas não encontrado para exportação.');
  const options = { backgroundColor: '#f8fafc', pixelRatio: 2, cacheBust: true };
  if (format === 'svg') {
    const data = await toSvg(element, options);
    downloadBlob(await (await fetch(data)).blob(), 'diagrama-pro.svg');
    return;
  }
  const data = await toPng(element, options);
  if (format === 'png') {
    downloadBlob(await (await fetch(data)).blob(), 'diagrama-pro.png');
    return;
  }
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const width = pdf.internal.pageSize.getWidth() - 48;
  const height = pdf.internal.pageSize.getHeight() - 48;
  const image = new Image();
  image.src = data;
  await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Não foi possível preparar a imagem do diagrama.')); });
  const ratio = Math.min(width / image.width, height / image.height);
  pdf.addImage(data, 'PNG', 24 + (width - image.width * ratio) / 2, 24 + (height - image.height * ratio) / 2, image.width * ratio, image.height * ratio);
  pdf.save('diagrama-pro.pdf');
}