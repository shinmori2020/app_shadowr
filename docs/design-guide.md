# ミニマルUIデザインガイドライン（Shadowr）

Swatchr / Gradientrと統一感のあるシンプル・ミニマルなUIを適用するためのルール。

---

## 1. デザイン原則

### プレビュー中心

シャドウの見た目がすべて。プレビューボックスをページ上部に大きく配置し、調整結果が即座に確認できるようにする。

### スライダー主体の操作性

すべてのパラメータをスライダーで操作する。数値入力は補助的な役割。直感的に動かして結果を見る体験を最優先する。

### Swatchr / Gradientrとの一貫性

カラーシステム、フォントサイズ、スペーシング、カードスタイルは完全に統一する。

---

## 2. カラーシステム（共通）

| 役割 | Tailwindクラス | 用途 |
| --- | --- | --- |
| 背景 | bg-gray-50 | ページ全体の背景 |
| カード背景 | bg-white | カード、レイヤーパネル |
| 枠線 | border-gray-200 | カード、セクション区切り |
| テキスト（主） | text-gray-800 | 見出し、重要テキスト |
| テキスト（副） | text-gray-500 | ラベル、補足テキスト |
| テキスト（薄） | text-gray-400 | プレースホルダー |
| ホバー | hover:bg-gray-100 | インタラクティブ要素 |
| アクティブ | bg-gray-800 text-white | 選択中のボタン、ONボタン |
| 非アクティブ | bg-gray-100 text-gray-600 | 未選択のボタン、OFFボタン |
| 無効化 | opacity-50 | OFFレイヤーの見た目 |
| スライダー | accent-gray-800 | range inputのつまみ |
| チェックボックス | accent-gray-800 | insetチェックボックス |

---

## 3. タイポグラフィ（共通）

| 用途 | Tailwindクラス |
| --- | --- |
| ページタイトル | text-lg font-semibold |
| セクション見出し | text-base font-medium |
| 本文・ラベル | text-sm |
| 補足・コード・値表示 | text-xs |

---

## 4. スペーシング（共通）

| 用途 | Tailwind |
| --- | --- |
| スライダー間の余白 | space-y-2 |
| コンポーネント内標準余白 | p-4, gap-3 |
| レイヤーパネル間 | space-y-3 |
| セクション間 | space-y-6 |
| ページ左右 | px-6 |
| ページ上下 | py-8 |
| コンテンツ最大幅 | mx-auto max-w-4xl |

---

## 5. Shadowr固有のコンポーネントスタイル

### プレビューエリア（外側コンテナ）

```jsx
<div className="flex h-48 items-center justify-center rounded-xl border border-gray-200 bg-white md:h-64">
```

- 高さ: モバイル h-48 / PC h-64
- 中央寄せで内側ボックスを配置
- 背景はPreviewSettingsで切り替え

### プレビューボックス（シャドウ適用対象）

```jsx
<div
  className="h-24 w-24 bg-white rounded-xl md:h-32 md:w-32"
  style={{ boxShadow: shadowCSS }}
/>
```

- サイズ: モバイル 96px / PC 128px
- 常に白背景（シャドウの視認性のため）
- 形状はPreviewSettingsで切り替え（rounded-none / rounded-xl / rounded-full）

### レイヤーパネル

```jsx
// 有効なレイヤー
<div className="rounded-xl border border-gray-200 bg-white p-4">

// 無効（OFF）なレイヤー
<div className="rounded-xl border border-gray-100 bg-white p-4 opacity-50">
```

- 有効/無効で枠線の色と不透明度を変える
- 無効化は `opacity-50` のみ。構造は変えない（再びONにしたとき違和感がないように）

### レイヤーヘッダー

```jsx
<div className="mb-3 flex items-center justify-between">
  <span className="text-sm font-medium text-gray-700">レイヤー</span>
  <div className="flex items-center gap-2">
    {/* ON/OFFボタン + 削除ボタン */}
  </div>
</div>
```

### ON/OFFボタン

```jsx
// ON状態
<button className="rounded px-2 py-1 text-xs bg-gray-800 text-white transition-colors">ON</button>

// OFF状態
<button className="rounded px-2 py-1 text-xs bg-gray-100 text-gray-500 transition-colors">OFF</button>
```

### スライダー行（Sliderコンポーネント）

```
[ラベル w-16] [──────スライダー flex-1──────] [値 w-14]
```

- ラベル: 固定幅 `w-16 text-sm text-gray-500`
- スライダー: `flex-1 accent-gray-800`
- 値表示: 固定幅 `w-14 text-right text-sm text-gray-600`
- 行間: `space-y-2`

すべてのスライダーでこのレイアウトを統一する。ラベルと値が縦に揃うことで視認性を高める。

### 色選択行

```
[ラベル w-16] [カラーピッカー] [HEX入力 w-20]
```

- スライダー行と同じラベル幅で揃える
- カラーピッカー: `h-8 w-8 cursor-pointer rounded border-none`
- HEX入力: `w-20 rounded border border-gray-200 px-2 py-1 text-xs`

### insetチェックボックス

```jsx
<label className="flex items-center gap-2 pl-16">
  <input type="checkbox" className="accent-gray-800" />
  <span className="text-sm text-gray-600">inset（内側シャドウ）</span>
</label>
```

- `pl-16` でラベル幅分インデントし、スライダーの値と縦位置を揃える

### レイヤー追加ボタン

```jsx
<button className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700">
  + レイヤーを追加
</button>
```

- `w-full` で全幅
- 破線ボーダー（`border-dashed`）

### プリセットサムネイル

```jsx
<button className="group flex flex-col items-center gap-1">
  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-white">
    <div className="h-8 w-8 rounded-md bg-white" style={{ boxShadow: shadow }} />
  </div>
  <span className="text-xs text-gray-500">Subtle</span>
</button>
```

- 外枠（w-16 h-16）の中に小さなボックス（w-8 h-8）でシャドウをプレビュー
- Gradientrのプリセットと同じサイズ感で統一

---

## 6. インタラクション

### スライダー操作

- リアルタイムでプレビューに反映（onChange で即時更新）
- デバウンスは不要（box-shadowの計算は軽量）

### レイヤーON/OFF

- クリックで即座に切り替え
- OFFにしたレイヤーはパネル全体を `opacity-50` で薄くする
- OFF状態でもスライダー操作は可能（ONに戻したとき値が保持される）

### ホバー

- ボタン: `hover:bg-gray-100` または `hover:bg-gray-200`
- 必ず `transition-colors` を付与

### フィードバック

- コピー成功: 「Copied!」一時表示（1.5秒）

---

## 7. レスポンシブ

| 要素 | モバイル | PC |
| --- | --- | --- |
| プレビューエリア高さ | h-48 | md:h-64 |
| プレビューボックス | h-24 w-24 | md:h-32 md:w-32 |
| ページ左右パディング | px-4 | md:px-6 |
| スライダー行 | そのまま（flex で伸縮） | そのまま |
| レイヤーパネル | 全幅 | 全幅 |

---

## 8. チェックリスト

- [ ] プレビューエリアがページ上部に大きく表示されている
- [ ] スライダー操作でプレビューがリアルタイム更新される
- [ ] 全スライダーのラベルと値が縦に揃っている
- [ ] ページ背景が bg-gray-50 になっている
- [ ] カードスタイルが Swatchr / Gradientr と統一されている
- [ ] レイヤーのON/OFFが視覚的に明確に区別できる
- [ ] レイヤーは最大4つ、最低1つが守られている
- [ ] insetチェックボックスが正しく動作する
- [ ] 複数レイヤーのCSSコードが正しく結合されている
- [ ] コピー機能にフィードバックがある
- [ ] プレビュー背景の切り替え（ライト/ダーク/カスタム）が動作する
- [ ] プレビューボックスの形状切り替えが動作する
- [ ] モバイルで横スクロールが発生しない
