import React, { use, useState } from "react";
import CustomModal from "./customModal"; // import your custom modal component
import { jsPDF } from "jspdf"; // import jsPDF for PDF generation
import { useRouter } from "next/navigation"; // import useRouter for navigation



// Define types for prediction result and modal props
interface PredictionResult {
  prediction: string;
  confidence: number;
}
// Define the props for the PredictionResultModal component
interface PredictionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionResult: PredictionResult | null;
}
// create the PredictionResultModal component
const PredictionResultModal: React.FC<PredictionResultModalProps> = ({
  isOpen,
  onClose,
  predictionResult,
}) => {
  // define the states for the form and PDF generation
  const [showForm, setShowForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [stage, setStage] = useState("Moderate");

  // if there is no prediction result, return null to avoid rendering
  // the modal when there is no data
  if (!predictionResult) return null;

  // Function to generate PDF with details
  // This function creates a PDF document with the prediction details
  const generatePDFWithDetails = () => {

  // Validate that all required fields are filled
  if (!patientName || !remarks || !stage) {
    alert('Please fill in all patient details before generating the report.');
    return;
  }

   
    const doc = new jsPDF();
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    doc.setFontSize(18);
    doc.text(`${patientName} Diagnosis Report`, 20, 20);

    doc.setFontSize(12);
    doc.text(`Date: ${dateStr}`, 20, 35);
    doc.text(`Time: ${timeStr}`, 120, 35);
    doc.text(`Doctor: Dr. [Name Placeholder]`, 20, 45); // This placeholder will be replaced with the actual name when authentication is completed
    doc.text(`Patient Name: ${patientName}`, 20, 55);
    doc.text(`Disease: ${predictionResult.prediction}`, 20, 65);
    doc.text(`Confidence: ${predictionResult.confidence.toFixed(2)}%`, 20, 75);

    // Stage indicator color
    let color = "#000000";
    if (stage === "Critical") color = "#FF0000";
    else if (stage === "Moderate") color = "#FFA500";
    else if (stage === "Early") color = "#000000";

    doc.setTextColor(color);
    doc.text(`Stage: ${stage}`, 20, 85);
    doc.setTextColor(0, 0, 0);

    // Remarks
    doc.text("Doctor's Remarks:", 20, 100);
    doc.text(doc.splitTextToSize(remarks || "N/A", 170), 20, 110);

    // Recommendation
    doc.text(
      doc.splitTextToSize(
        "Recommendation: Follow up with a licensed ophthalmologist. Lifestyle changes may be advised depending on the severity.",
        170
      ),
      20,
      130
    );

    doc.save(`${patientName}_Diagnosis_Report.pdf`);
  // Allow enough time for download to start
  };

  return (
    <CustomModal isOpen={isOpen} onConfirm={onClose} confirmText="Close">
      <div className="text-center pt-10">
        <h2 className="text-xl font-bold text-green-700 mb-2">
          👁️ Eye Net AI Prediction Result
        </h2>

        <p className="text-lg text-gray-800">
          <span className="font-medium">Disease:</span>{" "}
          {predictionResult.prediction}
        </p>

        <p className="text-md text-gray-600">
          <span className="font-medium">Confidence:</span>{" "}
          {predictionResult.confidence.toFixed(2)}%
        </p>

        <div className="mt-6 space-y-3 flex flex-col items-center">
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2 bg-[#2a3d29] text-white rounded hover:bg-green-700 transition cursor-pointer"
          >
            Download Diagnosis Report (PDF)
          </button>

          <button
            onClick={() => {
              onClose();
              window.location.reload();
            }}
            className="px-5 py-2 bg-[#9bc9b2] text-white rounded hover:bg-[#2a3d29] transition cursor-pointer"
          >
            Upload New Image
          </button>
        </div>
        <p className="text-sm text-black text-center mt-4 whitespace-normal">
          © 2025 EyeNet 1.0 – AI Vision Diagnostics
        </p>
      </div>

      {/* ✅ Form Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-black">
              Enter Patient Details
            </h3>

            <input
              type="text"
              placeholder="Patient Name"
              className="w-full border p-2 mb-3 rounded text-black  placeholder-gray-800"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />

            <textarea
              placeholder="Doctor's Remarks"
              className="w-full border p-2 mb-3 rounded placeholder-gray-800 text-black"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
            />

            <select
              className="w-full border p-2 mb-4 rounded text-gray-800"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              required
            >
              <option value="" disabled hidden className="text-gray-800 cursor-pointer ">
                Select Stage
              </option>
              <option className="text-black bg-[#FF0000] hover:bg-gray-800 cursor-pointer">Critical</option>
              <option className="text-black">Moderate</option>
              <option className="text-black">Early</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-red-700 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  generatePDFWithDetails();
                }}
                className="px-4 py-2 bg-[#9bc9b2] hover:bg-[#2a3d29] transition cursor-pointer text-white rounded"
              >
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default PredictionResultModal;
