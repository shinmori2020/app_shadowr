import { useState } from 'react';
import CopyButton from './CopyButton';

const CodeBlock = ({ cssCode, tailwindCode, darkMode = false }) => {
  const [activeTab, setActiveTab] = useState('css');

  // シャドウ値を抽出
  const shadowValue = cssCode.replace('box-shadow: ', '').replace(';', '');

  // 各形式のコード生成
  const formats = {
    css: cssCode,
    tailwind: tailwindCode,
    scss: `$shadow-custom: ${shadowValue};\n\n.element {\n  box-shadow: $shadow-custom;\n}`,
    cssVar: `:root {\n  --shadow-custom: ${shadowValue};\n}\n\n.element {\n  box-shadow: var(--shadow-custom);\n}`,
    react: `const styles = {\n  boxShadow: '${shadowValue}',\n};`,
  };

  const tabs = [
    { id: 'css', label: 'CSS' },
    { id: 'tailwind', label: 'Tailwind' },
    { id: 'scss', label: 'SCSS' },
    { id: 'cssVar', label: 'CSS変数' },
    { id: 'react', label: 'React' },
  ];

  const code = formats[activeTab];

  const btnActive = 'bg-gray-800 text-white';
  const btnInactive = darkMode
    ? 'border border-gray-600 text-gray-300 hover:bg-gray-600'
    : 'border border-gray-200 text-gray-600 hover:bg-gray-50';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                activeTab === tab.id ? btnActive : btnInactive
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <CopyButton text={code} darkMode={darkMode} />
      </div>
      <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <pre className={`overflow-x-auto whitespace-pre-wrap break-all text-xs ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
