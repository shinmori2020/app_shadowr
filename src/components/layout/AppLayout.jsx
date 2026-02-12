// アイコンコンポーネント
const UndoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

const RedoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
  </svg>
);

const CompareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ImportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// アイコンボタンコンポーネント
const IconButton = ({ onClick, disabled, active, darkMode, title, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-30 ${
      active
        ? 'bg-gray-800 text-white'
        : darkMode
          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`}
  >
    {children}
  </button>
);

const AppLayout = ({
  title,
  children,
  darkMode,
  onToggleDarkMode,
  onShare,
  onImport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  showComparison,
  onToggleComparison,
}) => {
  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Swatchr風ヘッダー - 全幅 */}
      <header className={`flex items-center justify-between px-4 py-2 ${
        darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
      }`}>
        {/* 左: ロゴ */}
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div
              className="h-6 w-6 rounded bg-white"
              style={{ boxShadow: '3px 3px 6px rgba(0,0,0,0.25)' }}
            />
          </div>
          <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h1>
        </div>

        {/* 右: アクションボタン */}
        <div className="flex items-center gap-1">
          <IconButton onClick={onUndo} disabled={!canUndo} darkMode={darkMode} title="元に戻す (Ctrl+Z)">
            <UndoIcon />
          </IconButton>
          <IconButton onClick={onRedo} disabled={!canRedo} darkMode={darkMode} title="やり直し (Ctrl+Y)">
            <RedoIcon />
          </IconButton>

          <div className={`mx-2 h-5 w-px ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />

          <IconButton onClick={onToggleComparison} active={showComparison} darkMode={darkMode} title="比較">
            <CompareIcon />
          </IconButton>
          <IconButton onClick={onImport} darkMode={darkMode} title="CSSインポート">
            <ImportIcon />
          </IconButton>
          <IconButton onClick={onShare} darkMode={darkMode} title="URLで共有">
            <ShareIcon />
          </IconButton>

          <div className={`mx-2 h-5 w-px ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />

          <IconButton onClick={onToggleDarkMode} darkMode={darkMode} title="テーマ切替 (D)">
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </div>
      </header>

      {/* メインコンテンツ - 全幅 */}
      <main className="w-full">{children}</main>
    </div>
  );
};

export default AppLayout;
