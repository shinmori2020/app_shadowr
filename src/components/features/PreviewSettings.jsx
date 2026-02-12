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

const PreviewSettings = ({
  background, onBackgroundChange,
  customBg, onCustomBgChange,
  shape, onShapeChange,
  size, onSizeChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* 背景切り替え */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">背景:</span>
        <div className="flex gap-1">
          {BG_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onBackgroundChange(opt.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                background === opt.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="h-7 w-7 cursor-pointer rounded border-none"
          />
        )}
      </div>

      {/* 形状切り替え */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">形状:</span>
        <div className="flex gap-1">
          {SHAPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onShapeChange(opt.value)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                shape === opt.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* サイズ切り替え */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">サイズ:</span>
        <div className="flex gap-1">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSizeChange(opt.value)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                size === opt.value
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviewSettings;
