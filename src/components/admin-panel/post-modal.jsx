// components/admin-panel/PostModal.jsx
export default function PostModal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
