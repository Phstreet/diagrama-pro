import { toPng, toSvg } from 'html-to-image';
import type { DiagramDocument } from '../types/diagram';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportJson(document: DiagramDocument) {
  downloadBlob(new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' }), 'diagrama-pro.json');
}

export async function exportCanvas(format: 'png' | 'svg') {
  const element = document.querySelector<HTMLElement>('.react-flow__viewport');
  if (!element) throw new Error('Canvas não encontrado para exportação.');
  const options = { backgroundColor: '#f8fafc', pixelRatio: 2, cacheBust: true };
  if (format === 'png') {
    const dataUrl = await toPng(element, options);
    const response = await fetch(dataUrl);
    downloadBlob(await response.blob(), 'diagrama-pro.png');
  } else {
    const dataUrl = await toSvg(element, options);
    const response = await fetch(dataUrl);
    downloadBlob(await response.blob(), 'diagrama-pro.svg');
  }
}