/**
 * HEXカラーと不透明度からrgba文字列を生成する
 * @param {string} hex - HEXカラーコード（例: '#000000'）
 * @param {number} opacity - 不透明度（0〜100）
 * @returns {string} rgba文字列（例: 'rgba(0, 0, 0, 0.20)'）
 */
export const hexToRgba = (hex, opacity) => {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return 'rgba(0, 0, 0, 0.20)';
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = Math.max(0, Math.min(100, opacity)) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
};

/**
 * シャドウレイヤー配列からbox-shadow CSS文字列を生成する
 * @param {Array<Object>} layers - シャドウレイヤー配列
 * @returns {string} box-shadow CSS文字列
 */
export const generateShadowCSS = (layers) => {
  if (!layers || layers.length === 0) return 'none';

  const enabledLayers = layers.filter(layer => layer.enabled);
  if (enabledLayers.length === 0) return 'none';

  return enabledLayers
    .map(layer => {
      const rgba = hexToRgba(layer.color, layer.opacity);
      const inset = layer.inset ? 'inset ' : '';
      return `${inset}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${rgba}`;
    })
    .join(',\n  ');
};

/**
 * シャドウレイヤー配列からTailwind CSSクラスを生成する
 * @param {Array<Object>} layers - シャドウレイヤー配列
 * @returns {string} Tailwind CSSクラス
 */
export const generateTailwindCSS = (layers) => {
  const shadowValue = generateShadowCSS(layers);
  if (shadowValue === 'none') return 'shadow-none';

  // Tailwindの任意値記法でエスケープ
  const escaped = shadowValue.replace(/\s+/g, '_').replace(/,/g, ',');
  return `shadow-[${escaped}]`;
};

/**
 * box-shadow CSS文字列をパースしてレイヤー配列に変換する
 * @param {string} cssString - box-shadow CSS文字列
 * @returns {Array<Object>|null} レイヤー配列、またはパース失敗時null
 */
export const parseShadowCSS = (cssString) => {
  if (!cssString || cssString.trim() === 'none') return null;

  // box-shadow: を除去
  let cleaned = cssString.replace(/^box-shadow:\s*/i, '').replace(/;$/, '').trim();

  const layers = [];
  // カンマで分割（rgba内のカンマは除く）
  const shadowParts = cleaned.split(/,(?![^(]*\))/);

  for (const part of shadowParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const isInset = trimmed.startsWith('inset');
    const values = trimmed.replace(/^inset\s*/, '').trim();

    // 値をパース (offsetX offsetY blur spread color)
    const match = values.match(/^(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+(-?\d+)px\s+(.+)$/);
    if (!match) continue;

    const [, offsetX, offsetY, blur, spread, colorStr] = match;

    // rgba/hex から色と不透明度を抽出
    let color = '#000000';
    let opacity = 20;

    const rgbaMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      const [, r, g, b, a] = rgbaMatch;
      color = `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
      opacity = a ? Math.round(parseFloat(a) * 100) : 100;
    } else if (colorStr.startsWith('#')) {
      color = colorStr.slice(0, 7);
      opacity = 100;
    }

    layers.push({
      id: Date.now() + layers.length,
      enabled: true,
      offsetX: parseInt(offsetX),
      offsetY: parseInt(offsetY),
      blur: parseInt(blur),
      spread: parseInt(spread),
      color,
      opacity,
      inset: isInset,
    });
  }

  return layers.length > 0 ? layers : null;
};
