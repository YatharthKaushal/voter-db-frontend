import React, { useState, useRef } from "react";
import {
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useVoters } from "../contexts/VoterContext";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import StatsSection from "../components/ui/StatsSection";

const Dashboard = () => {
  const { voters, importVoters, setOfflineData, loading } = useVoters();
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Format current date and time for filename (hh_mm_DD_MM_YY)
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = String(now.getFullYear()).slice(-2); // Last two digits of year
      const timestamp = `${hours}_${minutes}_${day}_${month}_${year}`;

      // Convert voter data to JSON string with formatting
      const jsonData = JSON.stringify(voters, null, 2);

      // Create a Blob with the JSON data
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `voters_export_${timestamp}.json`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success toast
      toast.success("Voters exported successfully!");
    } catch (err) {
      console.error("Error exporting voters:", err);
      // Show error toast
      toast.error("Failed to export voters");
    } finally {
      setExportLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      setUploadedFile(file);
      setMessage({ type: "", text: "" });
    } else {
      setMessage({ type: "error", text: "Please select a valid JSON file" });
    }
  };

  const handleImport = async () => {
    if (!uploadedFile) {
      setMessage({ type: "error", text: "Please select a file first" });
      toast.error("Please select a file first");
      return;
    }

    setImportLoading(true);
    try {
      // Read the JSON file
      const text = await uploadedFile.text();
      let parsedVoters;
      try {
        parsedVoters = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Invalid JSON format");
      }

      // Validate that parsed data is an array
      if (!Array.isArray(parsedVoters)) {
        throw new Error("JSON file must contain an array of voter objects");
      }

      // Basic validation for required fields
      const requiredFields = ["voterId", "fullName", "gender"];
      for (const voter of parsedVoters) {
        for (const field of requiredFields) {
          if (!voter[field]) {
            throw new Error(`Missing required field: ${field}`);
          }
        }
      }

      // Call importVoters from VoterContext
      await setOfflineData(parsedVoters);

      // Show success toast and message
      toast.success(`Successfully imported ${parsedVoters.length} voters`);
      setMessage({
        type: "success",
        text: `Successfully imported ${parsedVoters.length} voters`,
      });
      setUploadedFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error importing voters:", error);
      toast.error(error.message || "Failed to import voters");
      setMessage({
        type: "error",
        text: error.message || "Failed to import voters",
      });
    } finally {
      setImportLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      setUploadedFile(file);
      setMessage({ type: "", text: "" });
    } else {
      setMessage({ type: "error", text: "Please drop a valid JSON file" });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="ml-12 sm:ml-0">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage voter data with import and export functionality
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`rounded-lg p-4 border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Export Voters
            </h2>
            <p className="text-gray-600">
              Download all voter data as JSON file
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exportLoading || voters.length === 0}
            className="btn-primary flex items-center"
          >
            {exportLoading ? (
              <LoadingSpinner size="small" className="mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export Voters (JSON)
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Bulk Import Voters
          </h2>
          <p className="text-gray-600">
            Upload JSON file to bulk import voter data
          </p>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              Drop your JSON file here, or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-500"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">
              Supports JSON files up to 10MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Selected File */}
        {uploadedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {uploadedFile.name}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  ({(uploadedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={handleImport}
                disabled={importLoading}
                className="btn-primary flex items-center"
              >
                {importLoading ? (
                  <LoadingSpinner size="small" className="mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Import Voters
              </button>
            </div>
          </div>
        )}

        {/* Sample Format Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Expected JSON Format:
          </h3>
          <p className="text-sm text-blue-700">
            Your JSON should be an array of objects with fields: voterId,
            fullName, firstName, lastName, relativeName, houseNo, addressLine1,
            addressLine2, gender, age, mobileNumber, caste, etc.
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Required fields: voterId, fullName, gender
          </p>
        </div>
      </div>
      {/* Header */}
      <div className="mt-12 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Stats</h1>
        <p className="mt-2 text-gray-600">View your stats</p>
      </div>

      {/* Stats */}
      <StatsSection voters={voters} />
    </div>
  );
};

export default Dashboard;

// import React, { useState, useRef } from "react";
// import {
//   Download,
//   Upload,
//   AlertCircle,
//   CheckCircle,
//   FileText,
// } from "lucide-react";
// import { useVoters } from "../contexts/VoterContext";
// import LoadingSpinner from "../components/ui/LoadingSpinner";
// import StatsSection from "../components/ui/StatsSection";

// const Dashboard = () => {
//   const { voters, importVoters, loading } = useVoters();
//   const fileInputRef = useRef(null);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const handleExport = async () => {
//     setExportLoading(true);
//     try {
//       // Format current date and time for filename (hh_mm_DD_MM_YY)
//       const now = new Date();
//       const hours = String(now.getHours()).padStart(2, "0");
//       const minutes = String(now.getMinutes()).padStart(2, "0");
//       const day = String(now.getDate()).padStart(2, "0");
//       const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//       const year = String(now.getFullYear()).slice(-2); // Last two digits of year
//       const timestamp = `${hours}_${minutes}_${day}_${month}_${year}`;

//       // Convert voter data to JSON string with formatting
//       const jsonData = JSON.stringify(voters, null, 2);

//       // Create a Blob with the JSON data
//       const blob = new Blob([jsonData], { type: "application/json" });

//       // Create a temporary URL for the Blob
//       const url = window.URL.createObjectURL(blob);

//       // Create a temporary anchor element to trigger download
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `voters_export_${timestamp}.json`;
//       document.body.appendChild(link);
//       link.click();

//       // Clean up
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       // Show success toast
//       toast.success("Voters exported successfully!");
//     } catch (err) {
//       console.error("Error exporting voters:", err);
//       // Show error toast
//       toast.error("Failed to export voters");
//     } finally {
//       setExportLoading(false);
//     }
//   };

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === "text/csv") {
//       setUploadedFile(file);
//       setMessage({ type: "", text: "" });
//     } else {
//       setMessage({ type: "error", text: "Please select a valid CSV file" });
//     }
//   };

//   const handleImport = async () => {
//     if (!uploadedFile) {
//       setMessage({ type: "error", text: "Please select a file first" });
//       return;
//     }

//     setImportLoading(true);
//     try {
//       // code here
//       setMessage({
//         type: "success",
//         text: `Successfully imported ${parsedVoters.length} voters`,
//       });
//       setUploadedFile(null);
//       fileInputRef.current.value = "";
//     } catch (error) {
//       setMessage({ type: "error", text: error.message });
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file && file.type === "text/csv") {
//       setUploadedFile(file);
//       setMessage({ type: "", text: "" });
//     } else {
//       setMessage({ type: "error", text: "Please drop a valid CSV file" });
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="ml-12 sm:ml-0">
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="mt-2 text-gray-600">
//           Manage voter data with import and export functionality
//         </p>
//       </div>

//       {/* Message */}
//       {message.text && (
//         <div
//           className={`rounded-lg p-4 border ${
//             message.type === "success"
//               ? "bg-green-50 border-green-200 text-green-700"
//               : "bg-red-50 border-red-200 text-red-700"
//           }`}
//         >
//           <div className="flex items-center">
//             {message.type === "success" ? (
//               <CheckCircle className="h-5 w-5 mr-2" />
//             ) : (
//               <AlertCircle className="h-5 w-5 mr-2" />
//             )}
//             {message.text}
//           </div>
//         </div>
//       )}

//       {/* Export Section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">
//               Export Voters
//             </h2>
//             <p className="text-gray-600">
//               Download all voter data as JSON file
//             </p>
//           </div>
//           <button
//             onClick={handleExport}
//             disabled={exportLoading || voters.length === 0}
//             className="btn-primary flex items-center"
//           >
//             {exportLoading ? (
//               <LoadingSpinner size="small" className="mr-2" />
//             ) : (
//               <Download className="h-4 w-4 mr-2" />
//             )}
//             Export Voters (JSON)
//           </button>
//         </div>
//       </div>

//       {/* Import Section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="mb-4">
//           <h2 className="text-lg font-semibold text-gray-900">Import Voters</h2>
//           <p className="text-gray-600">Upload JSON file to import voter data</p>
//         </div>

//         {/* Drag and Drop Zone */}
//         <div
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//           className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
//         >
//           <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <div className="space-y-2">
//             <p className="text-lg font-medium text-gray-900">
//               Drop your CSV file here, or{" "}
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="text-primary-600 hover:text-primary-500"
//               >
//                 browse
//               </button>
//             </p>
//             <p className="text-sm text-gray-500">
//               Supports CSV files up to 10MB
//             </p>
//           </div>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".csv"
//             onChange={handleFileSelect}
//             className="hidden"
//           />
//         </div>

//         {/* Selected File */}
//         {uploadedFile && (
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <FileText className="h-5 w-5 text-gray-500 mr-2" />
//                 <span className="text-sm font-medium text-gray-900">
//                   {uploadedFile.name}
//                 </span>
//                 <span className="text-sm text-gray-500 ml-2">
//                   ({(uploadedFile.size / 1024).toFixed(1)} KB)
//                 </span>
//               </div>
//               <button
//                 onClick={handleImport}
//                 disabled={importLoading}
//                 className="btn-primary flex items-center"
//               >
//                 {importLoading ? (
//                   <LoadingSpinner size="small" className="mr-2" />
//                 ) : (
//                   <Upload className="h-4 w-4 mr-2" />
//                 )}
//                 Import Voters
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Sample Format Info */}
//         <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//           <h3 className="text-sm font-medium text-blue-900 mb-2">
//             Expected CSV Format:
//           </h3>
//           <p className="text-sm text-blue-700">
//             Your CSV should include headers: Voter ID, Full Name, First Name,
//             Last Name, Relative Name, House No, Address Line 1, Address Line 2,
//             Gender, Age, Mobile Number, Caste, etc.
//           </p>
//           <p className="text-sm text-blue-700 mt-1">
//             Required fields: Voter ID, Full Name, Gender
//           </p>
//         </div>
//       </div>
//       {/* Header */}
//       <div className="  mt-12 mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Stats</h1>
//         <p className="mt-2 text-gray-600">View your stats</p>
//       </div>

//       {/* Stats */}
//       <StatsSection voters={voters} />
//     </div>
//   );
// };

// export default Dashboard;
