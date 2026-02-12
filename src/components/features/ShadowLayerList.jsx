import { useState } from 'react';
import ShadowLayerItem, { DEFAULT_VALUES } from './ShadowLayerItem';

const MAX_LAYERS = 6;
const MIN_LAYERS = 1;

const ShadowLayerList = ({ layers, onChange, onReorder, darkMode = false }) => {
  const [dragIndex, setDragIndex] = useState(null);
  const [lockedLayers, setLockedLayers] = useState(new Set());

  const handleAdd = () => {
    if (layers.length >= MAX_LAYERS) return;
    const newLayer = {
      id: Date.now(),
      enabled: true,
      ...DEFAULT_VALUES,
    };
    onChange([...layers, newLayer]);
  };

  const handleRemove = (id) => {
    if (layers.length <= MIN_LAYERS) return;
    if (lockedLayers.has(id)) return; // ロックされていたら削除不可
    onChange(layers.filter((l) => l.id !== id));
  };

  const handleUpdate = (id, updates) => {
    if (lockedLayers.has(id)) return; // ロックされていたら更新不可
    onChange(
      layers.map((l) => l.id === id ? { ...l, ...updates } : l)
    );
  };

  const handleToggle = (id) => {
    onChange(
      layers.map((l) => l.id === id ? { ...l, enabled: !l.enabled } : l)
    );
  };

  const handleReset = (id) => {
    if (lockedLayers.has(id)) return;
    onChange(
      layers.map((l) => l.id === id ? { ...l, ...DEFAULT_VALUES, enabled: l.enabled } : l)
    );
  };

  // 複製
  const handleDuplicate = (id) => {
    if (layers.length >= MAX_LAYERS) return;
    const layerToDuplicate = layers.find(l => l.id === id);
    if (!layerToDuplicate) return;

    const newLayer = {
      ...layerToDuplicate,
      id: Date.now(),
    };
    const index = layers.findIndex(l => l.id === id);
    const newLayers = [...layers];
    newLayers.splice(index + 1, 0, newLayer);
    onChange(newLayers);
  };

  // ロック切り替え
  const handleToggleLock = (id) => {
    setLockedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDragStart = (index) => {
    // ロックされたレイヤーはドラッグ不可
    if (lockedLayers.has(layers[index].id)) return;
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    if (lockedLayers.has(layers[index].id)) return; // ロックされた位置には移動不可
    onReorder(dragIndex, index);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const btnClass = darkMode
    ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
    : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700';

  return (
    <div className="space-y-3">
      {layers.map((layer, index) => {
        const isLocked = lockedLayers.has(layer.id);

        // ドラッグハンドル用のprops
        const dragHandleProps = !isLocked ? {
          draggable: true,
          onDragStart: (e) => {
            e.stopPropagation();
            handleDragStart(index);
          },
        } : {};

        return (
          <div
            key={layer.id}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative transition-opacity ${
              dragIndex === index ? 'opacity-50' : ''
            }`}
          >
            <ShadowLayerItem
              layer={layer}
              index={index}
              onUpdate={(updates) => handleUpdate(layer.id, updates)}
              onRemove={() => handleRemove(layer.id)}
              onToggle={() => handleToggle(layer.id)}
              onReset={() => handleReset(layer.id)}
              onDuplicate={() => handleDuplicate(layer.id)}
              onToggleLock={() => handleToggleLock(layer.id)}
              canRemove={layers.length > MIN_LAYERS && !isLocked}
              canDuplicate={layers.length < MAX_LAYERS}
              isLocked={isLocked}
              darkMode={darkMode}
              dragHandleProps={dragHandleProps}
            />
          </div>
        );
      })}

      {layers.length < MAX_LAYERS && (
        <button
          onClick={handleAdd}
          className={`w-full rounded-lg border border-dashed px-4 py-2 text-xs transition-colors ${btnClass}`}
        >
          + レイヤーを追加
        </button>
      )}
    </div>
  );
};

export default ShadowLayerList;
