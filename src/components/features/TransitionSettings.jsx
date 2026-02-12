import { useState, useEffect } from 'react';

const EASING_OPTIONS = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' },
];

const TransitionSettings = ({
  baseShadow,
  darkMode = false,
  onSettingsChange,
}) => {
  const [duration, setDuration] = useState(300);
  const [easing, setEasing] = useState('ease');
  const [hoverScale, setHoverScale] = useState(1);
  const [hoverOffset, setHoverOffset] = useState(0);
  const [enabled, setEnabled] = useState(false);

  // ホバー時のシャドウを計算
  const calculateHoverShadow = () => {
    if (!baseShadow) return baseShadow;

    // シャドウのオフセットを調整
    return baseShadow.replace(
      /(-?\d+)px\s+(-?\d+)px/g,
      (match, x, y) => {
        const newX = Math.round(parseInt(x) * hoverScale + hoverOffset);
        const newY = Math.round(parseInt(y) * hoverScale + hoverOffset);
        return `${newX}px ${newY}px`;
      }
    );
  };

  const hoverShadow = calculateHoverShadow();

  // 親コンポーネントに設定を通知
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        enabled,
        duration,
        easing,
        hoverShadow,
      });
    }
  }, [enabled, duration, easing, hoverShadow, onSettingsChange]);

  // CSS生成
  const generateTransitionCSS = () => {
    return `.shadow-element {
  box-shadow: ${baseShadow};
  transition: box-shadow ${duration}ms ${easing}, transform ${duration}ms ${easing};
}

.shadow-element:hover {
  box-shadow: ${hoverShadow};
  transform: translateY(-2px);
}

.shadow-element:active {
  box-shadow: ${baseShadow};
  transform: translateY(0);
}`;
  };

  const btnInactive = darkMode
    ? 'border border-gray-600 text-gray-300 hover:bg-gray-600'
    : 'border border-gray-200 text-gray-600 hover:bg-gray-50';

  const inputClass = darkMode
    ? 'border-gray-600 bg-gray-700 text-white'
    : 'border-gray-200 bg-white text-gray-700';

  const labelClass = `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className="space-y-4">
      {/* 有効/無効切り替え */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="accent-gray-800"
          />
          <span className={labelClass}>プレビューに反映</span>
        </label>
      </div>

      {/* デュレーション */}
      <div className={enabled ? '' : 'opacity-50'}>
        <label className={labelClass}>
          デュレーション: {duration}ms
        </label>
        <input
          type="range"
          min="100"
          max="1000"
          step="50"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="mt-1 w-full"
        />
      </div>

      {/* イージング */}
      <div className={enabled ? '' : 'opacity-50'}>
        <label className={labelClass}>イージング</label>
        <div className="mt-1 flex flex-wrap gap-1">
          {EASING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setEasing(opt.value)}
              className={`rounded px-2 py-1 text-xs transition-colors ${
                easing === opt.value
                  ? 'bg-gray-800 text-white'
                  : btnInactive
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ホバースケール */}
      <div className={enabled ? '' : 'opacity-50'}>
        <label className={labelClass}>
          ホバー時のシャドウ強度: {(hoverScale * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={hoverScale}
          onChange={(e) => setHoverScale(parseFloat(e.target.value))}
          className="mt-1 w-full"
        />
      </div>

      {/* オフセット調整 */}
      <div className={enabled ? '' : 'opacity-50'}>
        <label className={labelClass}>
          ホバー時のオフセット追加: {hoverOffset}px
        </label>
        <input
          type="range"
          min="-10"
          max="10"
          step="1"
          value={hoverOffset}
          onChange={(e) => setHoverOffset(parseInt(e.target.value))}
          className="mt-1 w-full"
        />
      </div>

      {/* CSS出力 */}
      <div>
        <div className="flex items-center justify-between">
          <p className={labelClass}>生成されたCSS</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(generateTransitionCSS());
            }}
            className={`rounded px-2 py-1 text-xs ${btnInactive}`}
          >
            コピー
          </button>
        </div>
        <pre className={`mt-1 overflow-x-auto rounded p-2 text-xs ${
          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700'
        }`}>
          {generateTransitionCSS()}
        </pre>
      </div>
    </div>
  );
};

export default TransitionSettings;
