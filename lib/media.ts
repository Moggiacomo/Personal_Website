export const FIGURE_FILE_ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.svg,application/pdf,image/png,image/jpeg,image/svg+xml";

export function isPdfPath(src?: string | null) {
  if (!src) return false;
  const normalized = src.split("#")[0]?.split("?")[0] ?? "";
  return normalized.toLowerCase().endsWith(".pdf");
}

export function getPdfViewerSrc(src: string) {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;
  return trimmed.includes("#")
    ? trimmed
    : `${trimmed}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
}

function escapeSvgText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createPdfPlaceholderSvg(label: string) {
  const safeLabel = escapeSvgText(label || "Preview");
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <rect width="1200" height="900" rx="72" fill="#3b4556"/>
      <rect x="220" y="120" width="760" height="660" rx="40" fill="#f3f4f6" opacity="0.96"/>
      <rect x="320" y="240" width="560" height="90" rx="24" fill="#d6dae1"/>
      <rect x="320" y="390" width="460" height="40" rx="20" fill="#d6dae1"/>
      <rect x="320" y="470" width="520" height="40" rx="20" fill="#d6dae1"/>
      <rect x="320" y="550" width="390" height="40" rx="20" fill="#d6dae1"/>
      <rect x="420" y="84" width="360" height="108" rx="32" fill="#9877a2"/>
      <text x="600" y="154" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#ffffff">PDF</text>
      <text x="600" y="845" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="600" fill="#f3f4f6">${safeLabel}</text>
    </svg>
  `)}`;
}

export function getMediaPreviewSrc(src?: string | null, label = "Preview") {
  if (!src?.trim()) {
    return createPdfPlaceholderSvg(label);
  }

  if (isPdfPath(src)) {
    return createPdfPlaceholderSvg(label);
  }

  return src;
}
