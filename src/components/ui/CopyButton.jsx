import { useState } from 'react';

const CopyButton = ({ text, darkMode = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
        copied
          ? 'bg-green-500 text-white'
          : darkMode
            ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {copied ? '✓' : 'Copy'}
    </button>
  );
};

export default CopyButton;
