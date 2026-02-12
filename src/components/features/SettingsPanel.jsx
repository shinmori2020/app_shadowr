import { useState } from 'react';
import { PRESET_CATEGORIES } from '../../constants/presets';
import { generateShadowCSS } from '../../utils/shadowGenerator';

const SettingsPanel = ({
  activePreset,
  onPresetSelect,
  onPresetHover,
  background,
  onBackgroundChange,
  customBg,
  onCustomBgChange,
  shape,
  onShapeChange,
  size,
  onSizeChange,
  collapsed,
  onToggleCollapse,
  darkMode = false,
}) => {
  const [activeCategory, setActiveCategory] = useState('intensity');

  const BG_OPTIONS = [
    { value: 'light', label: 'ライト' },
    { value: 'dark', label: 'ダーク' },
    { value: 'custom', label: 'カスタム' },
  ];

  const SHAPE_OPTIONS = [
    { value: 'square', label: '□' },
    { value: 'rounded', label: '▢' },
    { value: 'circle', label: '○' },
  ];

  const SIZE_OPTIONS = [
    { value: 'small', label: 'S' },
    { value: 'medium', label: 'M' },
    { value: 'large', label: 'L' },
  ];

  const currentPresets = PRESET_CATEGORIES.find(cat => cat.id === activeCategory)?.presets || [];

  // スタイルクラス
  const btnActive = 'bg-gray-800 text-white';
  const btnInactive = darkMode
    ? 'border border-gray-600 text-gray-300 hover:bg-gray-600'
    : 'border border-gray-200 text-gray-600 hover:bg-gray-50';

  return (
    <div className={`rounded-lg border ${
      darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
    }`}>
      {/* ヘッダー行 - タイトルと折りたたみボタン */}
      <button
        onClick={onToggleCollapse}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          プリセット・プレビュー設定
        </span>
        <span className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          {collapsed ? '+' : '−'}
        </span>
      </button>

      {!collapsed && (
        <div className={`space-y-2 border-t px-3 py-2 ${
          darkMode ? 'border-gray-600' : 'border-gray-100'
        }`}>
          {/* カテゴリタブ */}
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat.id ? btnActive : btnInactive
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* プリセットボタン */}
          <div className="flex flex-wrap gap-1.5">
            {currentPresets.map((preset) => {
              const shadow = generateShadowCSS(
                preset.layers.map(l => ({ ...l, enabled: true }))
              );
              const isActive = activePreset === preset.name;

              return (
                <button
                  key={preset.name}
                  onClick={() => onPresetSelect(preset)}
                  onMouseEnter={() => onPresetHover && onPresetHover(shadow)}
                  onMouseLeave={() => onPresetHover && onPresetHover(null)}
                  className={`rounded-full px-2.5 py-1 text-sm font-medium transition-colors ${
                    isActive ? btnActive : btnInactive
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          {/* 区切り線 */}
          <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-100'}`} />

          {/* プレビュー設定 */}
          <div className="space-y-2">
            {/* 背景 */}
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>背景</span>
              <div className="flex gap-1.5">
                {BG_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onBackgroundChange(opt.value)}
                    className={`rounded px-2.5 py-1 text-sm font-medium transition-colors ${
                      background === opt.value ? btnActive : btnInactive
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {background === 'custom' && (
                <input
                  type="color"
                  value={customBg}
                  onChange={(e) => onCustomBgChange(e.target.value)}
                  className="h-5 w-5 cursor-pointer rounded border-none"
                />
              )}
            </div>

            {/* 形状・サイズ */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>形状</span>
                <div className="flex gap-1.5">
                  {SHAPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onShapeChange(opt.value)}
                      className={`flex h-7 w-7 items-center justify-center rounded text-sm transition-colors ${
                        shape === opt.value ? btnActive : btnInactive
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>サイズ</span>
                <div className="flex gap-1.5">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onSizeChange(opt.value)}
                      className={`flex h-7 w-7 items-center justify-center rounded text-sm font-medium transition-colors ${
                        size === opt.value ? btnActive : btnInactive
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
