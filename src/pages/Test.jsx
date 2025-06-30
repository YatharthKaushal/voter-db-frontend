import React, { useState } from "react";
import axios from "axios";

import Dexie from "dexie";

const Test = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make GET request to the export endpoint
      const response = await axios.get(
        "http://localhost:5000/api/voters/getCSV",
        {
          responseType: "blob", // Important: Set responseType to 'blob' for file downloads
        }
      );

      // Create a Blob from the response
      const blob = new Blob([response.data], { type: "text/csv" });

      // Create a URL for the Blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Extract file name from Content-Disposition header if available, or use default
      const contentDisposition = response.headers["content-disposition"];
      let fileName = `voters_${new Date().toISOString()}.csv`; // Fallback name
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1]; // Use server-provided name (e.g., 56_12_26_06_2025.csv)
        }
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading CSV:", err);
      setError("Failed to download CSV file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-evenly min-h-screen">
      <div className="flex flex-col items-center justify-center minh-screen bg-gray-100 p-10">
        <div className="bg-white p-6 rounded-lg shadow w-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
            Export Voter Data
          </h2>
          <button
            onClick={handleExport}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors w-full`}
          >
            {loading ? "Exporting..." : "Export to CSV"}
          </button>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
      </div>

      <div className="w-full border-2 bg-gray-500 border-gray-50 shadow-xl p-0.5 rounded-full"></div>

      <ExportVoters />
    </div>
  );
};

//===

const ExportVoters = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  // Initialize Dexie database
  const db = new Dexie("VoterDatabase");
  db.version(1).stores({
    csvFiles: "++id,fileName,blob,createdAt",
  });

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      // Make GET request to the export endpoint
      const response = await axios.get(
        "http://localhost:5000/api/voters/getCSV",
        {
          responseType: "blob", // Treat response as a Blob
        }
      );

      // Extract file name from Content-Disposition or generate one
      const contentDisposition = response.headers["content-disposition"];
      let fileName = `voters_${new Date().toISOString()}.csv`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1]; // e.g., 56_12_26_06_2025.csv
        }
      }

      // Save the Blob to IndexedDB
      await db.csvFiles.add({
        fileName,
        blob: response.data,
        createdAt: new Date(),
      });

      setStatus(`CSV file "${fileName}" saved to IndexedDB successfully!`);
    } catch (err) {
      console.error("Error processing CSV:", err);
      setError("Failed to fetch or save CSV file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearIndexedDB = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      // Clear all records from the csvFiles store
      await db.csvFiles.clear();
      setStatus("IndexedDB cleared successfully!");
    } catch (err) {
      console.error("Error clearing IndexedDB:", err);
      setError("Failed to clear IndexedDB. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center minh-screen bg-gray-100 p-10">
      <div className="bg-white p-6 rounded-lg shadow w-[350px]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Export Voter Data
        </h2>
        <button
          onClick={handleExport}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors w-full`}
        >
          {loading ? "Processing..." : "Export and Save to IndexedDB"}
        </button>

        <button
          onClick={handleClearIndexedDB}
          disabled={loading}
          className={`px-4 py-2 mt-4 rounded-md text-white font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          } transition-colors w-full`}
        >
          {loading ? "Processing..." : "Clear IndexedDB"}
        </button>
        {status && <p className="mt-4 text-green-600">{status}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

// export default ExportVoters;

export default Test;
