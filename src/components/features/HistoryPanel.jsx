import { useState } from 'react';

const SNAPSHOTS_KEY = 'shadowr-snapshots';
const MAX_SNAPSHOTS = 10;

const HistoryPanel = ({
  history,
  historyIndex,
  onRestore,
  currentLayers,
  darkMode = false,
}) => {
  const [snapshots, setSnapshots] = useState(() => {
    try {
      const saved = localStorage.getItem(SNAPSHOTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showSnapshots, setShowSnapshots] = useState(false);

  // スナップショット保存
  const saveSnapshot = () => {
    const name = prompt('スナップショット名を入力してください:');
    if (!name) return;

    const newSnapshot = {
      id: Date.now(),
      name,
      layers: currentLayers,
      createdAt: new Date().toISOString(),
    };

    const updated = [newSnapshot, ...snapshots].slice(0, MAX_SNAPSHOTS);
    setSnapshots(updated);
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
  };

  // スナップショット削除
  const deleteSnapshot = (id) => {
    const updated = snapshots.filter(s => s.id !== id);
    setSnapshots(updated);
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
  };

  // スナップショット復元
  const restoreSnapshot = (snapshot) => {
    if (confirm(`"${snapshot.name}" を復元しますか？`)) {
      onRestore(snapshot.layers);
    }
  };

  const baseClass = darkMode
    ? 'border-gray-600 bg-gray-700'
    : 'border-gray-200 bg-white';

  const textClass = darkMode ? 'text-gray-200' : 'text-gray-700';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-500';

  const btnClass = darkMode
    ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
    : 'border-gray-200 text-gray-600 hover:bg-gray-50';

  const formatTime = (index) => {
    const diff = historyIndex - index;
    if (diff === 0) return '現在';
    return `${diff}回前`;
  };

  return (
    <div className="space-y-3">
      {/* タブ切り替え */}
      <div className="flex gap-1">
        <button
          onClick={() => setShowSnapshots(false)}
          className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
            !showSnapshots
              ? 'bg-gray-800 text-white'
              : `border ${btnClass}`
          }`}
        >
          履歴
        </button>
        <button
          onClick={() => setShowSnapshots(true)}
          className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
            showSnapshots
              ? 'bg-gray-800 text-white'
              : `border ${btnClass}`
          }`}
        >
          スナップショット
        </button>
      </div>

      {showSnapshots ? (
        // スナップショット一覧
        <div className="space-y-2">
          <button
            onClick={saveSnapshot}
            className={`w-full rounded border border-dashed px-3 py-2 text-xs transition-colors ${btnClass}`}
          >
            + 現在の状態を保存
          </button>

          {snapshots.length === 0 ? (
            <p className={`text-center text-xs ${mutedClass}`}>
              スナップショットがありません
            </p>
          ) : (
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className={`flex items-center justify-between rounded border p-2 ${baseClass}`}
                >
                  <div>
                    <p className={`text-xs font-medium ${textClass}`}>
                      {snapshot.name}
                    </p>
                    <p className={`text-xs ${mutedClass}`}>
                      {new Date(snapshot.createdAt).toLocaleString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => restoreSnapshot(snapshot)}
                      className={`rounded px-2 py-1 text-xs ${btnClass}`}
                    >
                      復元
                    </button>
                    <button
                      onClick={() => deleteSnapshot(snapshot.id)}
                      className={`rounded px-2 py-1 text-xs ${btnClass}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // 履歴タイムライン
        <div className="space-y-1">
          {history.length === 0 ? (
            <p className={`text-center text-xs ${mutedClass}`}>
              履歴がありません
            </p>
          ) : (
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {history.map((item, index) => {
                const isCurrent = index === historyIndex;
                const layers = JSON.parse(item);

                return (
                  <button
                    key={index}
                    onClick={() => onRestore(layers, index)}
                    className={`w-full rounded border p-2 text-left text-xs transition-colors ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : `${baseClass} ${textClass}`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {formatTime(index)}
                      </span>
                      <span className={mutedClass}>
                        {layers.length}レイヤー
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
