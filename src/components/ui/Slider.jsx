import { useState, useRef, useEffect } from 'react';

const Slider = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  defaultValue,
  onChange,
  darkMode = false,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const inputRef = useRef(null);

  // 値が外部から変わったら入力値も更新
  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(value));
    }
  }, [value, isEditing]);

  const handleDoubleClick = () => {
    if (defaultValue !== undefined && !disabled) {
      onChange(defaultValue);
    }
  };

  const handleValueClick = () => {
    if (disabled) return;
    setIsEditing(true);
    setInputValue(String(value));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    commitValue();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitValue();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(String(value));
    }
  };

  const commitValue = () => {
    setIsEditing(false);
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      // min/maxの範囲内に収める
      const clampedValue = Math.min(max, Math.max(min, numValue));
      onChange(clampedValue);
      setInputValue(String(clampedValue));
    } else {
      setInputValue(String(value));
    }
  };

  // 編集モードになったらinputにフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const labelClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const valueClass = darkMode
    ? 'text-gray-300 hover:text-white'
    : 'text-gray-600 hover:text-gray-800';
  const inputClass = darkMode
    ? 'bg-gray-600 text-white border-gray-500'
    : 'bg-white text-gray-700 border-gray-300';

  return (
    <div className={`flex items-center gap-3 py-1 ${disabled ? 'opacity-50' : ''}`}>
      <label className={`w-14 shrink-0 text-sm ${labelClass}`}>
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => !disabled && onChange(Number(e.target.value))}
        onDoubleClick={handleDoubleClick}
        disabled={disabled}
        className="flex-1 cursor-pointer accent-gray-800 disabled:cursor-not-allowed h-2"
        style={{
          background: disabled
            ? undefined
            : `linear-gradient(to right, rgb(31 41 55) 0%, rgb(31 41 55) ${((value - min) / (max - min)) * 100}%, ${darkMode ? 'rgb(75 85 99)' : 'rgb(229 231 235)'} ${((value - min) / (max - min)) * 100}%, ${darkMode ? 'rgb(75 85 99)' : 'rgb(229 231 235)'} 100%)`,
          borderRadius: '9999px',
        }}
        title={defaultValue !== undefined ? 'ダブルクリックでリセット' : undefined}
      />
      {isEditing ? (
        <div className="flex w-16 items-center gap-0.5">
          <input
            ref={inputRef}
            type="number"
            min={min}
            max={max}
            step={step}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className={`w-11 rounded border px-1.5 py-1 text-sm text-right ${inputClass}`}
          />
          <span className={`text-sm ${labelClass}`}>{unit}</span>
        </div>
      ) : (
        <span
          onClick={handleValueClick}
          className={`w-16 cursor-pointer text-right text-sm ${valueClass} ${disabled ? 'cursor-not-allowed' : ''}`}
          onDoubleClick={handleDoubleClick}
          title={disabled ? undefined : 'クリックで数値入力'}
        >
          {value}{unit}
        </span>
      )}
    </div>
  );
};

export default Slider;
