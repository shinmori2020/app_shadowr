import { useState, useRef } from 'react';

const ExportModal = ({ onClose, shadowCSS, darkMode = false }) => {
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef(null);

  const baseClass = darkMode
    ? 'bg-gray-800 text-white'
    : 'bg-white text-gray-800';

  const btnClass = darkMode
    ? 'bg-gray-700 hover:bg-gray-600 text-white'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-700';

  // PNG エクスポート
  const exportPNG = async () => {
    setExporting(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 400;
      const padding = 80;
      canvas.width = size;
      canvas.height = size;

      // 背景
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, size, size);

      // シャドウを描画するためのオフスクリーンキャンバス
      const boxSize = size - padding * 2;
      const boxX = padding;
      const boxY = padding;

      // シャドウのパース
      const shadows = shadowCSS.split(/,(?![^(]*\))/).map(s => s.trim());

      shadows.forEach(shadow => {
        const parts = shadow.match(/(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+(-?\d+)px\s+(rgba?\([^)]+\)|#[a-fA-F0-9]+)/);
        if (parts) {
          const [, offsetX, offsetY, blur, spread, color] = parts;
          ctx.shadowColor = color;
          ctx.shadowBlur = parseInt(blur);
          ctx.shadowOffsetX = parseInt(offsetX);
          ctx.shadowOffsetY = parseInt(offsetY);
        }
      });

      // ボックス描画
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxSize, boxSize, 16);
      ctx.fill();

      // ダウンロード
      const link = document.createElement('a');
      link.download = 'shadow-preview.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('エクスポートに失敗しました');
    }
    setExporting(false);
  };

  // CSS ファイルエクスポート
  const exportCSS = () => {
    const cssContent = `.shadow-custom {
  box-shadow: ${shadowCSS};
}

/* Hover state example */
.shadow-custom-hover:hover {
  box-shadow: ${shadowCSS};
  transition: box-shadow 0.3s ease;
}

/* CSS Variable */
:root {
  --shadow-custom: ${shadowCSS};
}
`;
    const blob = new Blob([cssContent], { type: 'text/css' });
    const link = document.createElement('a');
    link.download = 'shadow.css';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // SVG エクスポート
  const exportSVG = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="5" dy="5" stdDeviation="10" flood-color="rgba(0,0,0,0.2)"/>
    </filter>
  </defs>
  <rect x="80" y="80" width="240" height="240" rx="16" fill="white" filter="url(#shadow)"/>
</svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'shadow.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`w-full max-w-md rounded-xl p-6 ${baseClass}`}>
        <h2 className="mb-4 text-lg font-semibold">エクスポート</h2>

        <div className="space-y-3">
          <button
            onClick={exportPNG}
            disabled={exporting}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${btnClass}`}
          >
            <span className="text-xl">🖼️</span>
            <div className="text-left">
              <div className="font-medium">PNG画像</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                プレビュー画像をダウンロード
              </div>
            </div>
          </button>

          <button
            onClick={exportSVG}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${btnClass}`}
          >
            <span className="text-xl">📐</span>
            <div className="text-left">
              <div className="font-medium">SVG画像</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ベクター形式でダウンロード
              </div>
            </div>
          </button>

          <button
            onClick={exportCSS}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${btnClass}`}
          >
            <span className="text-xl">📄</span>
            <div className="text-left">
              <div className="font-medium">CSSファイル</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                .cssファイルをダウンロード
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className={`mt-4 w-full rounded-lg py-2 text-sm ${
            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
