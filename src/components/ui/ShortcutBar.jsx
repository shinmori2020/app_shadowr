const SHORTCUTS = [
  { key: 'Z', modifier: 'Ctrl', label: '元に戻す' },
  { key: 'Y', modifier: 'Ctrl', label: 'やり直し' },
  { key: 'C', modifier: 'Ctrl', label: 'CSSコピー' },
  { key: 'D', modifier: '', label: 'ダーク' },
  { key: 'E', modifier: '', label: '折りたたみ' },
];

const ShortcutBar = ({ darkMode = false }) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-lg border px-3 py-1.5 ${
      darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
    }`}>
      {SHORTCUTS.map((shortcut, index) => (
        <div
          key={index}
          className="flex items-center gap-1 text-xs"
        >
          <span className={`rounded px-1 py-0.5 font-mono text-xs ${
            darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {shortcut.modifier && `${shortcut.modifier}+`}{shortcut.key}
          </span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{shortcut.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ShortcutBar;
