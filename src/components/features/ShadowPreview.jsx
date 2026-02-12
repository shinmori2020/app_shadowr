import { useState } from 'react';

const BG_CLASSES = {
  light: 'bg-gray-100',
  dark: 'bg-gray-800',
};

const SHAPE_CLASSES = {
  square: 'rounded-none',
  rounded: 'rounded-2xl',
  circle: 'rounded-full',
};

const SIZE_CLASSES = {
  small: 'h-20 w-20 md:h-24 md:w-24',
  medium: 'h-28 w-28 md:h-36 md:w-36',
  large: 'h-36 w-36 md:h-48 md:w-48',
};

// プレビューモード
const PREVIEW_MODES = [
  { id: 'single', label: '単体' },
  { id: 'card', label: 'カード' },
  { id: 'button', label: 'ボタン' },
  { id: 'multi', label: '複数' },
];

// サイズに応じたスケール係数
const SIZE_SCALE = {
  small: 0.7,
  medium: 1,
  large: 1.3,
};

const ShadowPreview = ({
  shadow,
  background,
  customBg,
  shape,
  size = 'medium',
  showAnimation = false,
  hoverShadow,
  baseShadow,
  fullHeight = false,
  darkMode = false,
  transitionSettings = null,
}) => {
  const [previewMode, setPreviewMode] = useState('single');
  const [isHovered, setIsHovered] = useState(false);
  const bgClass = background === 'custom' ? '' : BG_CLASSES[background];
  const bgStyle = background === 'custom' ? { backgroundColor: customBg } : {};

  // サイズスケール
  const scale = SIZE_SCALE[size] || 1;

  // トランジション設定が有効かどうか
  const transitionEnabled = transitionSettings?.enabled;

  // アニメーション用のスタイル
  const animationStyle = showAnimation && hoverShadow && baseShadow
    ? {
        animation: 'shadowPulse 1s ease-in-out infinite alternate',
      }
    : {};

  // トランジション用のスタイル
  const getTransitionStyle = (baseStyle = {}) => {
    if (!transitionEnabled) return baseStyle;

    return {
      ...baseStyle,
      boxShadow: isHovered ? transitionSettings.hoverShadow : shadow,
      transition: `box-shadow ${transitionSettings.duration}ms ${transitionSettings.easing}, transform ${transitionSettings.duration}ms ${transitionSettings.easing}`,
      transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    };
  };

  // ホバーイベントハンドラ
  const hoverHandlers = transitionEnabled ? {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  } : {};

  // 各プレビューモードの描画
  const renderPreview = () => {
    // カードサイズ計算
    const cardWidth = Math.round(256 * scale);
    const cardImageHeight = Math.round(128 * scale);
    const cardPadding = Math.round(16 * scale);

    // ボタンサイズ計算
    const btnPaddingX = Math.round(24 * scale);
    const btnPaddingY = Math.round(12 * scale);
    const btnFontSize = Math.round(14 * scale);
    const iconBtnPadding = Math.round(12 * scale);
    const iconSize = Math.round(24 * scale);

    // マルチサイズ計算
    const multiSize = Math.round(64 * scale);
    const multiGap = Math.round(24 * scale);

    switch (previewMode) {
      case 'card':
        return (
          <div
            className="rounded-xl bg-white cursor-pointer"
            style={getTransitionStyle({
              width: cardWidth,
              padding: cardPadding,
              boxShadow: shadow,
              ...animationStyle,
            })}
            {...hoverHandlers}
          >
            <div
              className="rounded-lg bg-gray-200"
              style={{ height: cardImageHeight, marginBottom: cardPadding * 0.75 }}
            />
            <div
              className="rounded bg-gray-300"
              style={{ height: Math.round(16 * scale), width: '75%', marginBottom: Math.round(8 * scale) }}
            />
            <div
              className="rounded bg-gray-200"
              style={{ height: Math.round(12 * scale), width: '50%' }}
            />
          </div>
        );

      case 'button':
        return (
          <div className="flex flex-col" style={{ gap: Math.round(16 * scale) }}>
            <button
              className="rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 cursor-pointer"
              style={getTransitionStyle({
                padding: `${btnPaddingY}px ${btnPaddingX}px`,
                fontSize: btnFontSize,
                boxShadow: shadow,
                ...animationStyle,
              })}
              {...hoverHandlers}
            >
              Primary Button
            </button>
            <button
              className="rounded-lg bg-white font-medium text-gray-700 cursor-pointer"
              style={getTransitionStyle({
                padding: `${btnPaddingY}px ${btnPaddingX}px`,
                fontSize: btnFontSize,
                boxShadow: shadow,
                ...animationStyle,
              })}
              {...hoverHandlers}
            >
              Secondary Button
            </button>
            <button
              className="rounded-full bg-white cursor-pointer"
              style={getTransitionStyle({
                padding: iconBtnPadding,
                boxShadow: shadow,
                ...animationStyle,
              })}
              {...hoverHandlers}
            >
              <svg
                className="text-gray-600"
                style={{ width: iconSize, height: iconSize }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        );

      case 'multi':
        return (
          <div className="grid grid-cols-3" style={{ gap: multiGap }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`bg-white cursor-pointer ${SHAPE_CLASSES[shape]}`}
                style={getTransitionStyle({
                  width: multiSize,
                  height: multiSize,
                  boxShadow: shadow,
                  ...animationStyle,
                })}
                {...hoverHandlers}
              />
            ))}
          </div>
        );

      default:
        return (
          <div
            className={`bg-white cursor-pointer ${SIZE_CLASSES[size]} ${SHAPE_CLASSES[shape]}`}
            style={getTransitionStyle({
              boxShadow: shadow,
              ...animationStyle,
            })}
            {...hoverHandlers}
          />
        );
    }
  };

  return (
    <>
      {showAnimation && (
        <style>{`
          @keyframes shadowPulse {
            0% { box-shadow: ${baseShadow}; }
            100% { box-shadow: ${hoverShadow}; }
          }
        `}</style>
      )}
      <div
        className={`relative flex flex-col ${bgClass} ${
          fullHeight ? 'h-full w-full' : 'min-h-[280px] rounded-xl md:min-h-[360px]'
        }`}
        style={bgStyle}
      >
        {/* プレビューモード切替 */}
        {fullHeight && (
          <div className="absolute left-4 top-4 z-10 flex gap-1">
            {PREVIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setPreviewMode(mode.id)}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  previewMode === mode.id
                    ? 'bg-gray-800 text-white'
                    : darkMode
                      ? 'bg-gray-700/80 text-gray-300 hover:bg-gray-600'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        )}

        {/* プレビュー本体 */}
        <div className="flex flex-1 items-center justify-center">
          {renderPreview()}
        </div>
      </div>
    </>
  );
};

export default ShadowPreview;
