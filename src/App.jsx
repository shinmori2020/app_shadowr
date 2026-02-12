import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import AppLayout from './components/layout/AppLayout';
import ShadowPreview from './components/features/ShadowPreview';
import SettingsPanel from './components/features/SettingsPanel';
import ShadowLayerList from './components/features/ShadowLayerList';
import CustomPresetList from './components/features/CustomPresetList';
import TransitionSettings from './components/features/TransitionSettings';
import HistoryPanel from './components/features/HistoryPanel';
import CodeBlock from './components/ui/CodeBlock';
import ShortcutBar from './components/ui/ShortcutBar';
import ImportModal from './components/ui/ImportModal';
import ExportModal from './components/ui/ExportModal';
import { generateShadowCSS, generateTailwindCSS, parseShadowCSS } from './utils/shadowGenerator';

const STORAGE_KEY = 'shadowr-state';
const CUSTOM_PRESETS_KEY = 'shadowr-custom-presets';
const MAX_HISTORY = 50;

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

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
};

const loadFromURL = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('s');
    if (data) {
      return JSON.parse(atob(data));
    }
  } catch (e) {
    console.error('Failed to load from URL:', e);
  }
  return null;
};

const loadCustomPresets = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_PRESETS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load custom presets:', e);
  }
  return [];
};

// 折りたたみ可能なセクションコンポーネント
const CollapsibleSection = ({ title, children, defaultOpen = true, darkMode = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-lg border ${
      darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left"
      >
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{title}</span>
        <span className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className={`border-t px-3 py-2 ${
        darkMode ? 'border-gray-600' : 'border-gray-100'
      }`}>{children}</div>}
    </div>
  );
};

function App() {
  const initialState = loadFromURL() || loadFromStorage() || {};

  const [layers, setLayers] = useState(initialState.layers || INITIAL_LAYERS);
  const [previewBg, setPreviewBg] = useState(initialState.previewBg || 'light');
  const [customBg, setCustomBg] = useState(initialState.customBg || '#f0f0f0');
  const [previewShape, setPreviewShape] = useState(initialState.previewShape || 'rounded');
  const [previewSize, setPreviewSize] = useState(initialState.previewSize || 'medium');
  const [activePreset, setActivePreset] = useState(initialState.activePreset || null);
  const [darkMode, setDarkMode] = useState(initialState.darkMode || false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonShadow, setComparisonShadow] = useState(null);
  const [customPresets, setCustomPresets] = useState(loadCustomPresets);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [hoverShadow, setHoverShadow] = useState(null);
  const [transitionSettings, setTransitionSettings] = useState({
    enabled: false,
    duration: 300,
    easing: 'ease',
    hoverShadow: null,
  });
  const [settingsCollapsed, setSettingsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileTab, setMobileTab] = useState('settings'); // 'settings' | 'preview'

  // Undo履歴
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  const shadowCSS = useMemo(() => generateShadowCSS(layers), [layers]);
  const cssCode = `box-shadow: ${shadowCSS};`;
  const tailwindCode = generateTailwindCSS(layers);

  // レスポンシブ対応
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // localStorageに保存
  useEffect(() => {
    const state = { layers, previewBg, customBg, previewShape, previewSize, activePreset, darkMode };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [layers, previewBg, customBg, previewShape, previewSize, activePreset, darkMode]);

  // カスタムプリセットを保存
  useEffect(() => {
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(customPresets));
  }, [customPresets]);

  // 履歴に追加
  useEffect(() => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.stringify(layers));
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [layers]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      setHistoryIndex(prev => prev - 1);
      setLayers(JSON.parse(history[historyIndex - 1]));
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      setHistoryIndex(prev => prev + 1);
      setLayers(JSON.parse(history[historyIndex + 1]));
    }
  }, [history, historyIndex]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + C: CSSコピー
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection()?.toString()) {
        navigator.clipboard.writeText(cssCode);
      }
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
      // D: ダークモード切替
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        setDarkMode(prev => !prev);
      }
      // E: 設定パネル折りたたみ
      if (e.key === 'e' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
        setSettingsCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cssCode, handleUndo, handleRedo]);

  const handlePresetSelect = (preset) => {
    setLayers(preset.layers.map((layer, i) => ({
      ...layer,
      id: Date.now() + i,
      enabled: true,
    })));
    setActivePreset(preset.name);
  };

  const handleLayersChange = (newLayers) => {
    setLayers(newLayers);
    setActivePreset(null);
  };

  const handleShare = () => {
    const state = { layers, previewBg, customBg, previewShape, previewSize };
    const encoded = btoa(JSON.stringify(state));
    const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;
    navigator.clipboard.writeText(url);
    alert('URLをコピーしました！');
  };

  // 比較機能
  const handleToggleComparison = () => {
    if (showComparison) {
      setShowComparison(false);
      setComparisonShadow(null);
    } else {
      setComparisonShadow(shadowCSS);
      setShowComparison(true);
    }
  };

  // カスタムプリセット保存
  const handleSaveCustomPreset = () => {
    const name = prompt('プリセット名を入力してください:');
    if (!name) return;

    const newPreset = {
      id: Date.now(),
      name,
      layers: layers.map(({ id, ...rest }) => rest),
    };
    setCustomPresets(prev => [...prev, newPreset]);
  };

  const handleDeleteCustomPreset = (id) => {
    setCustomPresets(prev => prev.filter(p => p.id !== id));
  };

  // CSSインポート
  const handleImportCSS = (css) => {
    const parsed = parseShadowCSS(css);
    if (parsed) {
      setLayers(parsed);
      setActivePreset(null);
      setShowImportModal(false);
    } else {
      alert('CSSをパースできませんでした。形式を確認してください。');
    }
  };

  // ドラッグ並べ替え
  const handleReorderLayers = (fromIndex, toIndex) => {
    const newLayers = [...layers];
    const [moved] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, moved);
    setLayers(newLayers);
  };

  // 履歴から復元
  const handleRestoreFromHistory = (restoredLayers, index) => {
    if (index !== undefined) {
      isUndoRedo.current = true;
      setHistoryIndex(index);
    }
    setLayers(restoredLayers);
  };

  return (
    <AppLayout
      title="Shadowr"
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      onShare={handleShare}
      onImport={() => setShowImportModal(true)}
      onUndo={handleUndo}
      onRedo={handleRedo}
      canUndo={historyIndex > 0}
      canRedo={historyIndex < history.length - 1}
      showComparison={showComparison}
      onToggleComparison={handleToggleComparison}
    >
      {/* モバイルタブ切り替え */}
      {isMobile && (
        <div className={`flex border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <button
            onClick={() => setMobileTab('settings')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'settings'
                ? darkMode ? 'border-b-2 border-white text-white' : 'border-b-2 border-gray-800 text-gray-800'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            設定
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'preview'
                ? darkMode ? 'border-b-2 border-white text-white' : 'border-b-2 border-gray-800 text-gray-800'
                : darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            プレビュー
          </button>
        </div>
      )}

      {/* 2カラムレイアウト - 1:1 (デスクトップ) / タブ切替 (モバイル) */}
      <div className={`flex ${isMobile ? 'h-[calc(100vh-100px)]' : 'h-[calc(100vh-52px)]'}`}>
        {/* 左カラム: 操作部分 */}
        <div className={`overflow-y-auto border-r p-4 ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } ${isMobile ? (mobileTab === 'settings' ? 'w-full' : 'hidden') : 'w-1/2'}`}>
          <div className="space-y-3">
            {/* ショートカットバー (デスクトップのみ) */}
            {!isMobile && <ShortcutBar darkMode={darkMode} />}

            {/* 設定パネル */}
            <SettingsPanel
              activePreset={activePreset}
              onPresetSelect={handlePresetSelect}
              onPresetHover={setHoverShadow}
              background={previewBg}
              onBackgroundChange={setPreviewBg}
              customBg={customBg}
              onCustomBgChange={setCustomBg}
              shape={previewShape}
              onShapeChange={setPreviewShape}
              size={previewSize}
              onSizeChange={setPreviewSize}
              collapsed={settingsCollapsed}
              onToggleCollapse={() => setSettingsCollapsed(!settingsCollapsed)}
              darkMode={darkMode}
            />

            {/* コード出力 */}
            <CollapsibleSection title="コード出力" defaultOpen={false} darkMode={darkMode}>
              <CodeBlock cssCode={cssCode} tailwindCode={tailwindCode} darkMode={darkMode} />
            </CollapsibleSection>

            {/* レイヤー編集 */}
            <CollapsibleSection title="レイヤー編集" defaultOpen={true} darkMode={darkMode}>
              <ShadowLayerList
                layers={layers}
                onChange={handleLayersChange}
                onReorder={handleReorderLayers}
                darkMode={darkMode}
              />
            </CollapsibleSection>

            {/* トランジション設定 */}
            <CollapsibleSection title="トランジション設定" defaultOpen={false} darkMode={darkMode}>
              <TransitionSettings
                baseShadow={shadowCSS}
                darkMode={darkMode}
                onSettingsChange={setTransitionSettings}
              />
            </CollapsibleSection>

            {/* 履歴・スナップショット */}
            <CollapsibleSection title="履歴・スナップショット" defaultOpen={false} darkMode={darkMode}>
              <HistoryPanel
                history={history}
                historyIndex={historyIndex}
                onRestore={handleRestoreFromHistory}
                currentLayers={layers}
                darkMode={darkMode}
              />
            </CollapsibleSection>

            {/* カスタムプリセット */}
            <CollapsibleSection title="カスタムプリセット" defaultOpen={false} darkMode={darkMode}>
              <CustomPresetList
                presets={customPresets}
                onSelect={handlePresetSelect}
                onDelete={handleDeleteCustomPreset}
                onSave={handleSaveCustomPreset}
                darkMode={darkMode}
              />
            </CollapsibleSection>

            {/* エクスポートボタン */}
            <button
              onClick={() => setShowExportModal(true)}
              className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              エクスポート
            </button>
          </div>
        </div>

        {/* 右カラム: プレビュー */}
        <div className={`overflow-hidden ${
          isMobile ? (mobileTab === 'preview' ? 'w-full' : 'hidden') : 'w-1/2'
        }`}>
          {showComparison ? (
            <div className="grid h-full grid-cols-2">
              <div className="flex flex-col items-center justify-center p-4">
                <p className={`mb-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>変更前</p>
                <ShadowPreview
                  shadow={comparisonShadow}
                  background={previewBg}
                  customBg={customBg}
                  shape={previewShape}
                  size={previewSize}
                  fullHeight
                  darkMode={darkMode}
                />
              </div>
              <div className={`flex flex-col items-center justify-center border-l p-4 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <p className={`mb-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>変更後</p>
                <ShadowPreview
                  shadow={shadowCSS}
                  background={previewBg}
                  customBg={customBg}
                  shape={previewShape}
                  size={previewSize}
                  fullHeight
                  darkMode={darkMode}
                />
              </div>
            </div>
          ) : (
            <ShadowPreview
              shadow={hoverShadow || shadowCSS}
              background={previewBg}
              customBg={customBg}
              shape={previewShape}
              size={previewSize}
              showAnimation={hoverShadow !== null}
              hoverShadow={hoverShadow}
              baseShadow={shadowCSS}
              fullHeight
              darkMode={darkMode}
              transitionSettings={transitionSettings}
            />
          )}
        </div>
      </div>

      {/* CSSインポートモーダル */}
      {showImportModal && (
        <ImportModal
          onImport={handleImportCSS}
          onClose={() => setShowImportModal(false)}
          darkMode={darkMode}
        />
      )}

      {/* エクスポートモーダル */}
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          shadowCSS={shadowCSS}
          darkMode={darkMode}
        />
      )}
    </AppLayout>
  );
}

export default App;
