import { SHADOW_PRESETS } from '../../constants/presets';
import { generateShadowCSS } from '../../utils/shadowGenerator';

const PresetList = ({ activePreset, onSelect, onHover }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-medium text-gray-800">プリセット</h2>
      <div className="flex flex-wrap gap-3">
        {SHADOW_PRESETS.map((preset) => {
          const shadow = generateShadowCSS(
            preset.layers.map(l => ({ ...l, enabled: true }))
          );
          const isActive = activePreset === preset.name;

          return (
            <button
              key={preset.name}
              onClick={() => onSelect(preset)}
              onMouseEnter={() => onHover && onHover(shadow)}
              onMouseLeave={() => onHover && onHover(null)}
              className="group flex flex-col items-center gap-1"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-lg border bg-white transition-colors ${
                isActive
                  ? 'border-gray-800 ring-2 ring-gray-800 ring-offset-1'
                  : 'border-gray-200 group-hover:border-gray-300'
              }`}>
                <div
                  className="h-8 w-8 rounded-md bg-white"
                  style={{ boxShadow: shadow }}
                />
              </div>
              <span className={`text-xs ${isActive ? 'font-medium text-gray-800' : 'text-gray-500'}`}>
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PresetList;
