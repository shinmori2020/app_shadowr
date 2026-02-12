import { useState } from 'react';

const ImportModal = ({ onImport, onClose }) => {
  const [cssInput, setCssInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cssInput.trim()) {
      onImport(cssInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-gray-800">CSSをインポート</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={cssInput}
            onChange={(e) => setCssInput(e.target.value)}
            placeholder="box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);"
            className="mb-4 h-32 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-gray-400 focus:outline-none"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
            >
              インポート
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportModal;
