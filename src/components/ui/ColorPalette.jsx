import { useState, useEffect } from 'react';

const RECENT_COLORS_KEY = 'shadowr-recent-colors';
const MAX_RECENT = 8;

// プリセットカラー
const PRESET_COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF',
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
];

const ColorPalette = ({ value, onChange, darkMode = false }) => {
  const [recentColors, setRecentColors] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  // 最近使った色を読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_COLORS_KEY);
      if (saved) {
        setRecentColors(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load recent colors:', e);
    }
  }, []);

  // 色を選択
  const selectColor = (color) => {
    onChange(color);
    addToRecent(color);
  };

  // 最近使った色に追加
  const addToRecent = (color) => {
    const updated = [color, ...recentColors.filter(c => c !== color)].slice(0, MAX_RECENT);
    setRecentColors(updated);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
  };

  // カスタム色入力
  const handleCustomChange = (e) => {
    const color = e.target.value;
    onChange(color);
  };

  // カスタム色入力完了時
  const handleCustomBlur = () => {
    addToRecent(value);
  };

  const sectionTitle = `text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className="space-y-3">
      {/* 現在の色 */}
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleCustomBlur}
          className={`w-20 rounded border px-2 py-1 text-xs font-mono ${
            darkMode
              ? 'border-gray-600 bg-gray-700 text-white'
              : 'border-gray-200 bg-white text-gray-700'
          }`}
        />
        <input
          type="color"
          value={value}
          onChange={handleCustomChange}
          onBlur={handleCustomBlur}
          className="h-8 w-8 cursor-pointer rounded border-none"
        />
      </div>

      {/* 最近使った色 */}
      {recentColors.length > 0 && (
        <div>
          <p className={sectionTitle}>最近使った色</p>
          <div className="flex flex-wrap gap-1">
            {recentColors.map((color, i) => (
              <button
                key={`${color}-${i}`}
                onClick={() => selectColor(color)}
                className={`h-6 w-6 rounded border transition-transform hover:scale-110 ${
                  value === color ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                } ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* プリセットカラー */}
      <div>
        <p className={sectionTitle}>プリセット</p>
        <div className="flex flex-wrap gap-1">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => selectColor(color)}
              className={`h-6 w-6 rounded border transition-transform hover:scale-110 ${
                value === color ? 'ring-2 ring-blue-500 ring-offset-1' : ''
              } ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 透明度プリセット */}
      <div>
        <p className={sectionTitle}>透明度付き</p>
        <div className="flex flex-wrap gap-1">
          {[10, 20, 30, 40, 50].map((opacity) => (
            <button
              key={opacity}
              onClick={() => selectColor(`rgba(0, 0, 0, 0.${opacity})`)}
              className={`rounded border px-2 py-1 text-xs ${
                darkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opacity}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
