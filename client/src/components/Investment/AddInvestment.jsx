import { useState } from "react";
import StatementUpload from "./StatementUpload";
import ManualInvestmentForm from "./ManualInvestmentForm";

export default function AddInvestmentSection() {
  const [mode, setMode] = useState("upload"); // "upload" | "manual"

  return (
    <div className="w-full space-y-6">
      {/* Toggle */}
      <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
        <button
          onClick={() => setMode("upload")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition
            ${
              mode === "upload"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Upload PDF
        </button>

        <button
          onClick={() => setMode("manual")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition
            ${
              mode === "manual"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Fill Details
        </button>
      </div>

      {/* Content */}
      <div>
        {mode === "upload" && <StatementUpload />}
        {mode === "manual" && <ManualInvestmentForm />}
      </div>
    </div>
  );
}
