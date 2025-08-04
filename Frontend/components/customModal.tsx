import React from "react";

const CustomModal = ({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div>{children}</div>
        <div className="mt-6 flex justify-end space-x-4">
          {onCancel && (
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              className="px-4 py-2 b text-white rounded hover:bg-blue-700"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
