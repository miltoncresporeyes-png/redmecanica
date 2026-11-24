// Prepara un documento (cedula, certificado) para subirlo: las fotos se reducen en el navegador (una foto de celular
// pesa 3-6 MB y asi baja a unos 300-600 KB); los PDF se envian tal cual si caben.
export const MAX_DOC_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 1600;

const readAsDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
  });

const loadBitmap = async (file: File): Promise<{ width: number; height: number; draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void }> => {
  if (typeof createImageBitmap === 'function') {
    const bmp = await createImageBitmap(file);
    return { width: bmp.width, height: bmp.height, draw: (ctx, w, h) => ctx.drawImage(bmp, 0, 0, w, h) };
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('No se pudo abrir la imagen'));
      i.src = url;
    });
    return { width: img.naturalWidth, height: img.naturalHeight, draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h) };
  } finally {
    URL.revokeObjectURL(url);
  }
};

export async function fileToDocumentDataUrl(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    if (file.size > MAX_DOC_BYTES) throw new Error('El PDF pesa más de 4 MB. Usa una versión más liviana o una foto.');
    return readAsDataUrl(file);
  }
  if (!file.type.startsWith('image/')) throw new Error('Usa una foto (JPG, PNG) o un PDF.');

  let bmp;
  try {
    bmp = await loadBitmap(file);
  } catch {
    throw new Error('No pudimos abrir esa imagen. Prueba con una foto en JPG o PNG.');
  }
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Tu navegador no pudo procesar la imagen.');
  ctx.fillStyle = '#ffffff'; // fondo blanco para PNG con transparencia
  ctx.fillRect(0, 0, w, h);
  bmp.draw(ctx, w, h);

  for (const quality of [0.82, 0.7, 0.55]) {
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    // tamaño aproximado del binario a partir del base64
    if ((dataUrl.length * 3) / 4 <= MAX_DOC_BYTES) return dataUrl;
  }
  throw new Error('La imagen sigue siendo muy pesada. Toma la foto con menos resolución.');
}
