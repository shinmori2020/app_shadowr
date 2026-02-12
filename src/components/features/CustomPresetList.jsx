import { generateShadowCSS } from '../../utils/shadowGenerator';

const CustomPresetList = ({ presets, onSelect, onDelete, onSave }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {presets.length === 0 ? '保存されたプリセットはありません' : `${presets.length}件のプリセット`}
        </span>
        <button
          onClick={onSave}
          className="rounded-full bg-gray-800 px-3 py-1.5 text-xs text-white transition-colors hover:bg-gray-700"
        >
          現在の設定を保存
        </button>
      </div>
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {presets.map((preset) => {
            const shadow = generateShadowCSS(
              preset.layers.map(l => ({ ...l, enabled: true }))
            );

            return (
              <div key={preset.id} className="group relative">
                <button
                  onClick={() => onSelect(preset)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 transition-colors group-hover:bg-gray-100">
                    <div
                      className="h-7 w-7 rounded-md bg-white"
                      style={{ boxShadow: shadow }}
                    />
                  </div>
                  <span className="max-w-14 truncate text-xs text-gray-500">
                    {preset.name}
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(preset.id);
                  }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  title="削除"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomPresetList;
