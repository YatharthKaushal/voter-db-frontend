import React, { useState, useRef } from 'react';
import { Download, Upload, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useVoters } from '../contexts/VoterContext';
import { downloadCSV, parseCSV } from '../utils/csvUtils';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatsSection from '../components/ui/StatsSection';

const Dashboard = () => {
  const { voters, importVoters, loading } = useVoters();
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      downloadCSV(voters, 'voters-export.csv');
      setMessage({ type: 'success', text: `Successfully exported ${voters.length} voters to CSV` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export voters' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Please select a valid CSV file' });
    }
  };

  const handleImport = async () => {
    if (!uploadedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setImportLoading(true);
    try {
      const csvText = await uploadedFile.text();
      const parsedVoters = parseCSV(csvText);
      await importVoters(parsedVoters);
      setMessage({ type: 'success', text: `Successfully imported ${parsedVoters.length} voters` });
      setUploadedFile(null);
      fileInputRef.current.value = '';
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
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
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      setMessage({ type: '', text: '' });
    } else {
      setMessage({ type: 'error', text: 'Please drop a valid CSV file' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage voter data with import and export functionality
        </p>
      </div>

      {/* Stats */}
      <StatsSection voters={voters} />

      {/* Message */}
      {message.text && (
        <div className={`rounded-lg p-4 border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
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
            <h2 className="text-lg font-semibold text-gray-900">Export Voters</h2>
            <p className="text-gray-600">Download all voter data as CSV file</p>
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
            Export Voters (CSV)
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Import Voters</h2>
          <p className="text-gray-600">Upload CSV file to import voter data</p>
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
              Drop your CSV file here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-600 hover:text-primary-500"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">Supports CSV files up to 10MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
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
                <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
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
          <h3 className="text-sm font-medium text-blue-900 mb-2">Expected CSV Format:</h3>
          <p className="text-sm text-blue-700">
            Your CSV should include headers: Voter ID, Full Name, First Name, Last Name,
            Relative Name, House No, Address Line 1, Address Line 2, Gender, Age,
            Mobile Number, Caste, etc.
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Required fields: Voter ID, Full Name, Gender
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
