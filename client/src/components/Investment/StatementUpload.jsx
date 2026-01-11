import { useState } from "react";

export default function StatementUpload({ onBack }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    setLoading(true);

    // later: send to backend
    console.log("Uploading PDF:", file);

    setTimeout(() => {
      setLoading(false);
      alert("Statement uploaded & processing started");
    }, 1500);
  }

  return (
    <div className="bg-white p-8 rounded-2xl border shadow-sm">
      <button onClick={onBack} className="text-sm text-blue-600 mb-4">
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">Upload Investment Statement</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      {file && (
        <div className="text-sm text-gray-700 mb-4">
          {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}

      <button
        disabled={!file || loading}
        onClick={handleUpload}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Upload & Extract"}
      </button>
    </div>
  );
}
