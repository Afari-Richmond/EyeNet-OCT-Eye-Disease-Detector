// ConfirmModal.jsx
import React from "react";

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold text-muted-foreground mb-3">
          Confirm Upload
        </h2>
        <p className="text-sm text-muted-foreground mb-5">
          If this is not an OCT scan, the prediction might be inaccurate. Do you still want to proceed?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-[#9bc9b2] text-[#0A1014] rounded hover:bg-background hover:text-white  transition cursor-pointer "
            onClick={onConfirm}
          >
            Yes, Proceed
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
