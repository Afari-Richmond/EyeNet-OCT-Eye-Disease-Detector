import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
        <ClipLoader size={40} color="#9bc9b2" /> 
        <p className="mt-4 text-gray-700 font-medium"> 👁️ Hold on... AI is scanning for retinal disease</p>
      </div>
    </div>
  );
};

export default LoadingModal;
