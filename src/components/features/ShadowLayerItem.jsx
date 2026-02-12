import Slider from '../ui/Slider';

const DEFAULT_VALUES = {
  offsetX: 0,
  offsetY: 4,
  blur: 8,
  spread: 0,
  color: '#000000',
  opacity: 15,
  inset: false,
};

const ShadowLayerItem = ({
  layer,
  index,
  onUpdate,
  onRemove,
  onToggle,
  onReset,
  onDuplicate,
  onToggleLock,
  canRemove,
  canDuplicate = true,
  isLocked = false,
  darkMode = false,
  dragHandleProps = {},
}) => {
  const handleChange = (key, value) => {
    if (isLocked) return;
    onUpdate({ [key]: value });
  };

  const baseClass = darkMode
    ? 'border-gray-600 bg-gray-700'
    : 'border-gray-200 bg-white';

  const textClass = darkMode ? 'text-gray-200' : 'text-gray-700';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  const btnClass = darkMode
    ? 'text-gray-400 hover:bg-gray-600 hover:text-gray-200'
    : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600';

  const inputClass = darkMode
    ? 'border-gray-600 bg-gray-600 text-white'
    : 'border-gray-200 bg-white text-gray-700';

  return (
    <div className={`rounded-lg border p-3 ${baseClass} ${
      layer.enabled ? '' : 'opacity-50'
    } ${isLocked ? 'ring-1 ring-yellow-500/30' : ''}`}>
      {/* ヘッダー: ドラッグハンドル + レイヤー番号 + アクションボタン */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* ドラッグハンドル */}
          <div
            {...dragHandleProps}
            className={`cursor-grab p-1 ${isLocked ? 'cursor-not-allowed opacity-30' : ''} ${mutedClass}`}
            title={isLocked ? 'ロック中' : 'ドラッグして並べ替え'}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <span className={`text-sm font-medium ${textClass}`}>
            レイヤー {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* 複製 */}
          <button
            onClick={onDuplicate}
            disabled={!canDuplicate}
            className={`rounded p-1 transition-colors disabled:opacity-30 ${btnClass}`}
            title="複製"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          {/* ロック */}
          <button
            onClick={onToggleLock}
            className={`rounded p-1 transition-colors ${btnClass}`}
            title={isLocked ? 'ロック解除' : 'ロック'}
          >
            {isLocked ? (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          {/* リセット */}
          <button
            onClick={onReset}
            disabled={isLocked}
            className={`rounded px-1.5 py-0.5 text-xs transition-colors disabled:opacity-30 ${btnClass}`}
            title="初期値にリセット"
          >
            ↺
          </button>
          {/* ON/OFF */}
          <button
            onClick={onToggle}
            className={`rounded px-2 py-0.5 text-xs transition-colors ${
              layer.enabled
                ? 'bg-gray-800 text-white'
                : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {layer.enabled ? 'ON' : 'OFF'}
          </button>
          {/* 削除 */}
          <button
            onClick={onRemove}
            disabled={!canRemove}
            className={`rounded p-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${btnClass}`}
          >
            ×
          </button>
        </div>
      </div>

      {/* パラメータスライダー */}
      <div className="space-y-2">
        <Slider label="X" value={layer.offsetX} min={-100} max={100} defaultValue={DEFAULT_VALUES.offsetX} onChange={(v) => handleChange('offsetX', v)} darkMode={darkMode} disabled={isLocked} />
        <Slider label="Y" value={layer.offsetY} min={-100} max={100} defaultValue={DEFAULT_VALUES.offsetY} onChange={(v) => handleChange('offsetY', v)} darkMode={darkMode} disabled={isLocked} />
        <Slider label="ぼかし" value={layer.blur} min={0} max={100} defaultValue={DEFAULT_VALUES.blur} onChange={(v) => handleChange('blur', v)} darkMode={darkMode} disabled={isLocked} />
        <Slider label="広がり" value={layer.spread} min={-50} max={50} defaultValue={DEFAULT_VALUES.spread} onChange={(v) => handleChange('spread', v)} darkMode={darkMode} disabled={isLocked} />

        {/* 色・HEX入力 */}
        <div className="flex items-center gap-3 py-1">
          <label className={`w-14 shrink-0 text-sm ${mutedClass}`}>色</label>
          <input
            type="color"
            value={layer.color}
            onChange={(e) => handleChange('color', e.target.value)}
            disabled={isLocked}
            className="h-7 w-7 shrink-0 cursor-pointer rounded border-none disabled:cursor-not-allowed"
          />
          <input
            type="text"
            value={layer.color}
            onChange={(e) => handleChange('color', e.target.value)}
            disabled={isLocked}
            className={`w-20 shrink-0 rounded border px-2 py-1 text-sm disabled:opacity-50 ${inputClass}`}
          />
        </div>

        <Slider label="不透明度" value={layer.opacity} min={0} max={100} unit="%" defaultValue={DEFAULT_VALUES.opacity} onChange={(v) => handleChange('opacity', v)} darkMode={darkMode} disabled={isLocked} />

        {/* inset チェックボックス */}
        <div className="flex items-center gap-3 py-1">
          <span className="w-14 shrink-0"></span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={layer.inset}
              onChange={(e) => handleChange('inset', e.target.checked)}
              disabled={isLocked}
              className="h-4 w-4 accent-gray-800 disabled:cursor-not-allowed"
            />
            <span className={`text-sm ${mutedClass}`}>inset</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShadowLayerItem;
export { DEFAULT_VALUES };
