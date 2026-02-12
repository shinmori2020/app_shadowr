# コーディング規約・スタイルガイド（Shadowr）

Shadowr開発で統一するコーディングルール。基本はSwatchr / Gradientrと共通。

---

## 1. ファイル・命名規則

### ファイル名

| 種類 | 命名規則 | 例 |
| --- | --- | --- |
| コンポーネント | PascalCase.jsx | `ShadowLayerItem.jsx`, `Slider.jsx` |
| カスタムフック | camelCase.js（use始まり） | `useClipboard.js` |
| ユーティリティ | camelCase.js | `shadowGenerator.js` |
| 定数ファイル | camelCase.js | `presets.js` |

### 変数・関数名

| 種類 | 命名規則 | 例 |
| --- | --- | --- |
| コンポーネント | PascalCase | `ShadowLayerList`, `PreviewSettings` |
| 関数 | camelCase（動詞始まり） | `generateShadowCSS()`, `hexToRgba()` |
| 定数 | UPPER_SNAKE_CASE | `MAX_LAYERS`, `SHADOW_PRESETS` |
| boolean変数 | is/has/can始まり | `isEnabled`, `canRemove` |
| イベントハンドラ | handle始まり | `handleToggle`, `handleLayerUpdate` |
| コールバックprops | on始まり | `onChange`, `onToggle`, `onRemove` |

---

## 2. コンポーネントの書き方

Swatchr / Gradientr と同一ルール。

### 基本ルール

- 関数コンポーネント + アロー関数で統一
- default export を使用
- propsは分割代入で受け取る
- 1ファイル1コンポーネント

### コンポーネント内の記述順序

1. import文
2. 定数（コンポーネント外）
3. コンポーネント本体
   - state宣言
   - 派生値（useMemo）
   - 副作用（useEffect）
   - イベントハンドラ
   - JSX return
4. export

---

## 3. ユーティリティ関数

### shadowGenerator.js

```jsx
/**
 * シャドウレイヤー配列からbox-shadow CSS文字列を生成する
 * @param {Array<Object>} layers - シャドウレイヤー配列
 * @returns {string} box-shadow CSS文字列
 */
export const generateShadowCSS = (layers) => {
  if (!layers || layers.length === 0) return 'none';

  const enabledLayers = layers.filter(layer => layer.enabled);
  if (enabledLayers.length === 0) return 'none';

  return enabledLayers
    .map(layer => {
      const rgba = hexToRgba(layer.color, layer.opacity);
      const inset = layer.inset ? 'inset ' : '';
      return `${inset}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${rgba}`;
    })
    .join(',\n  ');
};

/**
 * HEXカラーと不透明度からrgba文字列を生成する
 * @param {string} hex - HEXカラーコード（例: '#000000'）
 * @param {number} opacity - 不透明度（0〜100）
 * @returns {string} rgba文字列（例: 'rgba(0, 0, 0, 0.20)'）
 */
export const hexToRgba = (hex, opacity) => {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return 'rgba(0, 0, 0, 0.20)';
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = Math.max(0, Math.min(100, opacity)) / 100;
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
};
```

### ルール

- 純粋関数にする（副作用なし）
- JSDocコメントで型を明示する
- 不正な入力にはデフォルト値を返す
- 複数レイヤーの結合は `,\n  ` で改行付きにし、コード表示で見やすくする

---

## 4. レイヤー操作のパターン

### 追加

```jsx
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
```

### 削除

```jsx
const handleRemove = (id) => {
  if (layers.length <= MIN_LAYERS) return;
  onChange(layers.filter((l) => l.id !== id));
};
```

### 部分更新

```jsx
const handleUpdate = (id, updates) => {
  onChange(layers.map((l) => l.id === id ? { ...l, ...updates } : l));
};
```

### ON/OFF切り替え

```jsx
const handleToggle = (id) => {
  onChange(layers.map((l) => l.id === id ? { ...l, enabled: !l.enabled } : l));
};
```

### プリセット適用

```jsx
const handlePresetSelect = (preset) => {
  setLayers(preset.layers.map((layer, i) => ({
    ...layer,
    id: Date.now() + i,
    enabled: true,
  })));
};
```

idには `Date.now()` を使う。配列のインデックスをkeyにしない。

---

## 5. Tailwind CSS の使い方

Swatchr / Gradientr と同一ルール。

### クラス記述の順序

1. レイアウト → 2. サイズ → 3. 見た目 → 4. テキスト → 5. アニメーション → 6. レスポンシブ

### インラインスタイルの使用

動的なシャドウとカスタム背景色のみ許可。

```jsx
// OK
<div style={{ boxShadow: shadowCSS }} />
<div style={{ backgroundColor: customBg }} />

// NG
<div style={{ padding: '16px' }} />
```

---

## 6. 避けるべきパターン

### 不要な状態

```jsx
// Bad - shadowCSS は layers から計算できる
const [shadowCSS, setShadowCSS] = useState('');

// Good
const shadowCSS = useMemo(() => generateShadowCSS(layers), [layers]);
```

### 配列のインデックスをkeyにする

```jsx
// Bad
layers.map((layer, index) => <ShadowLayerItem key={index} ... />)

// Good
layers.map((layer) => <ShadowLayerItem key={layer.id} ... />)
```

### Sliderの重複実装

```jsx
// Bad - 各パラメータごとにスライダーを個別実装
<div className="flex items-center gap-3">
  <label>X</label>
  <input type="range" ... />
  <span>{value}px</span>
</div>

// Good - Sliderコンポーネントを再利用
<Slider label="X" value={offsetX} min={-100} max={100} onChange={...} />
```
