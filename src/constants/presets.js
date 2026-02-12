// カテゴリ別プリセット
export const PRESET_CATEGORIES = [
  {
    id: 'intensity',
    name: '強度',
    presets: [
      { name: 'Subtle', layers: [{ offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: '#000000', opacity: 12, inset: false }] },
      { name: 'Medium', layers: [{ offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 10, inset: false }, { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: '#000000', opacity: 10, inset: false }] },
      { name: 'Bold', layers: [{ offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: '#000000', opacity: 15, inset: false }, { offsetX: 0, offsetY: 4, blur: 6, spread: -4, color: '#000000', opacity: 10, inset: false }] },
      { name: 'Heavy', layers: [{ offsetX: 0, offsetY: 20, blur: 40, spread: -5, color: '#000000', opacity: 25, inset: false }] },
    ],
  },
  {
    id: 'elevation',
    name: '浮遊感',
    presets: [
      { name: 'Flat', layers: [{ offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: '#000000', opacity: 8, inset: false }] },
      { name: 'Raised', layers: [{ offsetX: 0, offsetY: 4, blur: 8, spread: -2, color: '#000000', opacity: 12, inset: false }] },
      { name: 'Float', layers: [{ offsetX: 0, offsetY: 12, blur: 20, spread: -4, color: '#000000', opacity: 15, inset: false }, { offsetX: 0, offsetY: 4, blur: 6, spread: -2, color: '#000000', opacity: 8, inset: false }] },
      { name: 'Hover', layers: [{ offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: '#000000', opacity: 15, inset: false }, { offsetX: 0, offsetY: 8, blur: 10, spread: -6, color: '#000000', opacity: 10, inset: false }] },
    ],
  },
  {
    id: 'style',
    name: 'スタイル',
    presets: [
      { name: 'Sharp', layers: [{ offsetX: 5, offsetY: 5, blur: 0, spread: 0, color: '#000000', opacity: 20, inset: false }] },
      { name: 'Soft', layers: [{ offsetX: 0, offsetY: 8, blur: 30, spread: 0, color: '#000000', opacity: 12, inset: false }] },
      { name: 'Glow', layers: [{ offsetX: 0, offsetY: 0, blur: 20, spread: 2, color: '#3b82f6', opacity: 40, inset: false }] },
      { name: 'Neon', layers: [{ offsetX: 0, offsetY: 0, blur: 10, spread: 1, color: '#22c55e', opacity: 60, inset: false }, { offsetX: 0, offsetY: 0, blur: 30, spread: 5, color: '#22c55e', opacity: 30, inset: false }] },
    ],
  },
  {
    id: 'direction',
    name: '方向',
    presets: [
      { name: 'Center', layers: [{ offsetX: 0, offsetY: 0, blur: 15, spread: 0, color: '#000000', opacity: 15, inset: false }] },
      { name: 'Bottom', layers: [{ offsetX: 0, offsetY: 8, blur: 15, spread: -3, color: '#000000', opacity: 15, inset: false }] },
      { name: 'Right', layers: [{ offsetX: 8, offsetY: 4, blur: 15, spread: -3, color: '#000000', opacity: 15, inset: false }] },
      { name: 'Left', layers: [{ offsetX: -8, offsetY: 4, blur: 15, spread: -3, color: '#000000', opacity: 15, inset: false }] },
    ],
  },
  {
    id: 'special',
    name: '特殊',
    presets: [
      { name: 'Inset', layers: [{ offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: '#000000', opacity: 15, inset: true }] },
      { name: 'Deep Inset', layers: [{ offsetX: 0, offsetY: 4, blur: 8, spread: -2, color: '#000000', opacity: 20, inset: true }] },
      { name: 'Layered', layers: [{ offsetX: 0, offsetY: 1, blur: 1, spread: 0, color: '#000000', opacity: 5, inset: false }, { offsetX: 0, offsetY: 2, blur: 2, spread: 0, color: '#000000', opacity: 5, inset: false }, { offsetX: 0, offsetY: 4, blur: 4, spread: 0, color: '#000000', opacity: 5, inset: false }, { offsetX: 0, offsetY: 8, blur: 8, spread: 0, color: '#000000', opacity: 5, inset: false }] },
      { name: 'Material', layers: [{ offsetX: 0, offsetY: 3, blur: 5, spread: -1, color: '#000000', opacity: 20, inset: false }, { offsetX: 0, offsetY: 6, blur: 10, spread: 0, color: '#000000', opacity: 14, inset: false }] },
    ],
  },
];

// 後方互換性のため、フラットなプリセット配列も提供
export const SHADOW_PRESETS = PRESET_CATEGORIES.flatMap(cat => cat.presets);
