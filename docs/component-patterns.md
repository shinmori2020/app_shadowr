# コンポーネント設計パターン（Shadowr）

Shadowr固有のコンポーネント設計パターン集。

---

## 1. コンポーネント一覧と責務

### 汎用UI（共通 + 新規）

| コンポーネント | 責務 | 備考 |
| --- | --- | --- |
| AppLayout | ページ全体のレイアウト | 共通 |
| CopyButton | テキストをコピーするボタン | 共通 |
| CodeBlock | CSSコード表示 + コピーボタン | 共通 |
| Toast | 一時的な通知 | 共通 |
| Slider | ラベル付きスライダー | **新規**（複数パラメータで繰り返し使用） |

### 機能コンポーネント（Shadowr固有）

| コンポーネント | 責務 |
| --- | --- |
| ShadowPreview | box-shadowのリアルタイムプレビュー表示 |
| PreviewSettings | プレビュー背景色・ボックス形状の切り替え |
| ShadowLayerList | シャドウレイヤーの一覧管理（追加・削除） |
| ShadowLayerItem | 個別レイヤーのパラメータ調整UI |
| PresetList | プリセットシャドウ一覧 |

---

## 2. App.jsx の全体構成

```jsx
import { useState, useMemo } from 'react';
import AppLayout from './components/layout/AppLayout';
import ShadowPreview from './components/features/ShadowPreview';
import PreviewSettings from './components/features/PreviewSettings';
import ShadowLayerList from './components/features/ShadowLayerList';
import PresetList from './components/features/PresetList';
import CodeBlock from './components/ui/CodeBlock';
import { generateShadowCSS } from './utils/shadowGenerator';

const INITIAL_LAYERS = [
  {
    id: 1,
    enabled: true,
    offsetX: 5,
    offsetY: 5,
    blur: 15,
    spread: 0,
    color: '#000000',
    opacity: 20,
    inset: false,
  },
];

function App() {
  // state
  const [layers, setLayers] = useState(INITIAL_LAYERS);
  const [previewBg, setPreviewBg] = useState('light');
  const [customBg, setCustomBg] = useState('#f0f0f0');
  const [previewShape, setPreviewShape] = useState('rounded');

  // 派生値
  const shadowCSS = useMemo(() => generateShadowCSS(layers), [layers]);
  const cssCode = `box-shadow: ${shadowCSS};`;

  // プリセット適用
  const handlePresetSelect = (preset) => {
    setLayers(preset.layers.map((layer, i) => ({
      ...layer,
      id: Date.now() + i,
      enabled: true,
    })));
  };

  return (
    <AppLayout title="Shadowr">
      <div className="space-y-6">
        <ShadowPreview
          shadow={shadowCSS}
          background={previewBg}
          customBg={customBg}
          shape={previewShape}
        />
        <PreviewSettings
          background={previewBg}
          onBackgroundChange={setPreviewBg}
          customBg={customBg}
          onCustomBgChange={setCustomBg}
          shape={previewShape}
          onShapeChange={setPreviewShape}
        />
        <ShadowLayerList
          layers={layers}
          onChange={setLayers}
        />
        <CodeBlock code={cssCode} language="CSS" />
        <PresetList onSelect={handlePresetSelect} />
      </div>
    </AppLayout>
  );
}

export default App;
```

---

## 3. 各コンポーネントの設計

### Slider — 汎用ラベル付きスライダー（新規・再利用可能）

このアプリの中核UI部品。6つのパラメータすべてで使用する。

```jsx
const Slider = ({ label, value, min, max, step = 1, unit = 'px', onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <label className="w-16 text-sm text-gray-500 shrink-0">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-gray-800"
      />
      <span className="w-14 text-right text-sm text-gray-600">
        {value}{unit}
      </span>
    </div>
  );
};

export default Slider;
```

ポイント：
- ラベル（固定幅 w-16）+ スライダー（flex-1）+ 値表示（固定幅 w-14）
- unit propsで「px」「%」などの単位を切り替え可能
- すべてのパラメータで同じコンポーネントを使うことで統一感を出す

### ShadowPreview — プレビュー表示

```jsx
const BG_CLASSES = {
  light: 'bg-white',
  dark: 'bg-gray-800',
};

const SHAPE_CLASSES = {
  square: 'rounded-none',
  rounded: 'rounded-xl',
  circle: 'rounded-full',
};

const ShadowPreview = ({ shadow, background, customBg, shape }) => {
  const bgClass = background === 'custom' ? '' : BG_CLASSES[background];
  const bgStyle = background === 'custom' ? { backgroundColor: customBg } : {};

  return (
    <div
      className={`flex h-48 items-center justify-center rounded-xl border border-gray-200 md:h-64 ${bgClass}`}
      style={bgStyle}
    >
      <div
        className={`h-24 w-24 bg-white md:h-32 md:w-32 ${SHAPE_CLASSES[shape]}`}
        style={{ boxShadow: shadow }}
      />
    </div>
  );
};

export default ShadowPreview;
```

ポイント：
- 外側コンテナ（プレビューエリア）と内側ボックス（シャドウ適用対象）の2層構造
- 背景色はクラスベースで切り替え、カスタムのみインラインスタイル
- ボックス形状はクラスの切り替えで対応
- ボックスは常に白（`bg-white`）にしてシャドウが見やすいようにする

### PreviewSettings — プレビュー設定

```jsx
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

const PreviewSettings = ({
  background, onBackgroundChange,
  customBg, onCustomBgChange,
  shape, onShapeChange,
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
    </div>
  );
};

export default PreviewSettings;
```

### ShadowLayerItem — 個別レイヤー設定

```jsx
import Slider from '../ui/Slider';

const ShadowLayerItem = ({ layer, onUpdate, onRemove, onToggle, canRemove }) => {
  const handleChange = (key, value) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className={`rounded-xl border bg-white p-4 ${
      layer.enabled ? 'border-gray-200' : 'border-gray-100 opacity-50'
    }`}>
      {/* ヘッダー: レイヤー名 + ON/OFF + 削除 */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          レイヤー
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`rounded px-2 py-1 text-xs transition-colors ${
              layer.enabled
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {layer.enabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={onRemove}
            disabled={!canRemove}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ×
          </button>
        </div>
      </div>

      {/* パラメータスライダー */}
      <div className="space-y-2">
        <Slider label="X" value={layer.offsetX} min={-100} max={100} onChange={(v) => handleChange('offsetX', v)} />
        <Slider label="Y" value={layer.offsetY} min={-100} max={100} onChange={(v) => handleChange('offsetY', v)} />
        <Slider label="ぼかし" value={layer.blur} min={0} max={100} onChange={(v) => handleChange('blur', v)} />
        <Slider label="広がり" value={layer.spread} min={-50} max={50} onChange={(v) => handleChange('spread', v)} />

        {/* 色・不透明度 */}
        <div className="flex items-center gap-3">
          <label className="w-16 text-sm text-gray-500 shrink-0">色</label>
          <input
            type="color"
            value={layer.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border-none"
          />
          <input
            type="text"
            value={layer.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-20 rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
          />
        </div>

        <Slider label="不透明度" value={layer.opacity} min={0} max={100} unit="%" onChange={(v) => handleChange('opacity', v)} />

        {/* inset チェックボックス */}
        <label className="flex items-center gap-2 pl-16">
          <input
            type="checkbox"
            checked={layer.inset}
            onChange={(e) => handleChange('inset', e.target.checked)}
            className="accent-gray-800"
          />
          <span className="text-sm text-gray-600">inset（内側シャドウ）</span>
        </label>
      </div>
    </div>
  );
};

export default ShadowLayerItem;
```

ポイント：
- Sliderコンポーネントを繰り返し使い、レイアウトを統一
- ON/OFF切り替えで `opacity-50` にして視覚的に無効化を表現
- ラベル幅（w-16）を全スライダーで揃えて整列させる

### ShadowLayerList — レイヤー一覧

```jsx
import ShadowLayerItem from './ShadowLayerItem';

const MAX_LAYERS = 4;
const MIN_LAYERS = 1;

const ShadowLayerList = ({ layers, onChange }) => {
  const handleAdd = () => {
    if (layers.length >= MAX_LAYERS) return;
    const newLayer = {
      id: Date.now(),
      enabled: true,
      offsetX: 0,
      offsetY: 4,
      blur: 8,
      spread: 0,
      color: '#000000',
      opacity: 15,
      inset: false,
    };
    onChange([...layers, newLayer]);
  };

  const handleRemove = (id) => {
    if (layers.length <= MIN_LAYERS) return;
    onChange(layers.filter((l) => l.id !== id));
  };

  const handleUpdate = (id, updates) => {
    onChange(
      layers.map((l) => l.id === id ? { ...l, ...updates } : l)
    );
  };

  const handleToggle = (id) => {
    onChange(
      layers.map((l) => l.id === id ? { ...l, enabled: !l.enabled } : l)
    );
  };

  return (
    <div className="space-y-3">
      {layers.map((layer, index) => (
        <ShadowLayerItem
          key={layer.id}
          layer={layer}
          onUpdate={(updates) => handleUpdate(layer.id, updates)}
          onRemove={() => handleRemove(layer.id)}
          onToggle={() => handleToggle(layer.id)}
          canRemove={layers.length > MIN_LAYERS}
        />
      ))}

      {layers.length < MAX_LAYERS && (
        <button
          onClick={handleAdd}
          className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
        >
          + レイヤーを追加
        </button>
      )}
    </div>
  );
};

export default ShadowLayerList;
```

### PresetList — プリセット一覧

```jsx
import { SHADOW_PRESETS } from '../../constants/presets';
import { generateShadowCSS } from '../../utils/shadowGenerator';

const PresetList = ({ onSelect }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-medium text-gray-800">プリセット</h2>
      <div className="flex flex-wrap gap-3">
        {SHADOW_PRESETS.map((preset) => {
          const shadow = generateShadowCSS(
            preset.layers.map(l => ({ ...l, enabled: true }))
          );

          return (
            <button
              key={preset.name}
              onClick={() => onSelect(preset)}
              className="group flex flex-col items-center gap-1"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-white">
                <div
                  className="h-8 w-8 rounded-md bg-white"
                  style={{ boxShadow: shadow }}
                />
              </div>
              <span className="text-xs text-gray-500">{preset.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PresetList;
```

---

## 4. 状態管理の全体図

```
App.jsx
├── layers[] ─────→ ShadowLayerList → ShadowLayerItem → Slider
│   (配列)           (追加/削除)        (パラメータ調整)
│
├── previewBg ────→ PreviewSettings（背景切り替え）
├── customBg  ────→ PreviewSettings（カスタム背景色）
├── previewShape ─→ PreviewSettings（形状切り替え）
│
├── shadowCSS（useMemo で派生）
│   ├──→ ShadowPreview（style={{ boxShadow: shadowCSS }}）
│   └──→ CodeBlock（CSSコード表示）
│
└── handlePresetSelect → PresetList（プリセット適用でlayersを一括更新）
```
