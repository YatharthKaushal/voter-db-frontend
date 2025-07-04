// import React, { useState, useMemo, useRef } from "react";
// import {
//   Search,
//   Filter,
//   Plus,
//   Eye,
//   Printer,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   Share2,
//   RefreshCcw,
//   Upload,
// } from "lucide-react";
// import { useVoters } from "../../contexts/VoterContextOffline";
// import Modal from "../../components/ui/Modal";
// import VoterForm from "./VoterForm";
// import VoterDetails from "./VoterDetails";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import LoadingSpinner from "../../components/ui/LoadingSpinner";
// import toast from "react-hot-toast";

// const ITEMS_PER_PAGE = 25;

// const VotersPageOffline = () => {
//   const {
//     deleteVoter,
//     loading,
//     totalPageCount,
//     totalRecordsCount,
//     offlineData,
//     setOfflineData,
//   } = useVoters();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     gender: "",
//     ageRange: "",
//     caste: "",
//     district: "",
//     assemblyConstituency: "",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedVoter, setSelectedVoter] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);

//   // Filter and search voters
//   const filteredVoters = useMemo(() => {
//     return offlineData?.filter((voter) => {
//       const matchesSearch =
//         !searchTerm ||
//         voter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         voter.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         voter.mobileNumber.includes(searchTerm);

//       const matchesGender = !filters.gender || voter.gender === filters.gender;

//       const matchesAge =
//         !filters.ageRange ||
//         (() => {
//           const age = voter.age;
//           switch (filters.ageRange) {
//             case "18-25":
//               return age >= 18 && age <= 25;
//             case "26-35":
//               return age >= 26 && age <= 35;
//             case "36-50":
//               return age >= 36 && age <= 50;
//             case "51+":
//               return age >= 51;
//             default:
//               return true;
//           }
//         })();

//       const matchesCaste = !filters.caste || voter.caste === filters.caste;
//       const matchesDistrict =
//         !filters.district || voter.district === filters.district;
//       const matchesAssembly =
//         !filters.assemblyConstituency ||
//         voter.assemblyConstituencyName === filters.assemblyConstituency;

//       return (
//         matchesSearch &&
//         matchesGender &&
//         matchesAge &&
//         matchesCaste &&
//         matchesDistrict &&
//         matchesAssembly
//       );
//     });
//   }, [offlineData, searchTerm, filters]);

//   // Pagination
//   // const totalPages = Math.ceil(filteredVoters.length / ITEMS_PER_PAGE);
//   const totalPages = totalPageCount;
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedVoters = filteredVoters.slice(
//     startIndex,
//     startIndex + ITEMS_PER_PAGE
//   );

//   // Get unique values for filters
//   const uniqueGenders = [...new Set(offlineData.map((v) => v.gender))].filter(
//     Boolean
//   );
//   const uniqueCastes = [...new Set(offlineData.map((v) => v.caste))].filter(
//     Boolean
//   );
//   const uniqueDistricts = [
//     ...new Set(offlineData.map((v) => v.district)),
//   ].filter(Boolean);
//   const uniqueAssemblyConstituencies = [
//     ...new Set(offlineData.map((v) => v.assemblyConstituencyName)),
//   ].filter(Boolean);

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//     setCurrentPage(1);
//   };

//   const handleView = (voter) => {
//     setSelectedVoter(voter);
//     setShowDetailsModal(true);
//   };

//   const handleEdit = (voter) => {
//     setSelectedVoter(voter);
//     setShowEditModal(true);
//   };

//   const handleDelete = async (voter) => {
//     const confirmDelete = window.confirm(
//       `Are you sure you want to delete ${voter.fullName}?`
//     );
//     if (confirmDelete) {
//       await deleteVoter(voter.id);
//     }
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const resetFilters = () => {
//     setFilters({
//       gender: "",
//       ageRange: "",
//       caste: "",
//       district: "",
//       assemblyConstituency: "",
//     });
//     setSearchTerm("");
//     setCurrentPage(1);
//   };

//   const hasActiveFilters =
//     Object.values(filters).some((filter) => filter !== "") || searchTerm !== "";

//   // Generate page numbers for pagination
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;

//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       const start = Math.max(1, currentPage - 2);
//       const end = Math.min(totalPages, start + maxVisiblePages - 1);

//       for (let i = start; i <= end; i++) {
//         pages.push(i);
//       }
//     }

//     return pages;
//   };

//   const fileInputRef = useRef(null);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [importLoading, setImportLoading] = useState(false);
//   const [exportLoading, setExportLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const handleImport = async () => {
//     if (!uploadedFile) {
//       setMessage({ type: "error", text: "Please select a file first" });
//       toast.error("Please select a file first");
//       return;
//     }

//     setImportLoading(true);
//     try {
//       // Read the JSON file
//       const text = await uploadedFile.text();
//       let parsedVoters;
//       try {
//         parsedVoters = JSON.parse(text);
//       } catch (parseError) {
//         throw new Error("Invalid JSON format");
//       }

//       // Validate that parsed data is an array
//       if (!Array.isArray(parsedVoters)) {
//         throw new Error("JSON file must contain an array of voter objects");
//       }

//       // Basic validation for required fields
//       const requiredFields = ["voterId", "fullName", "gender"];
//       for (const voter of parsedVoters) {
//         for (const field of requiredFields) {
//           if (!voter[field]) {
//             throw new Error(`Missing required field: ${field}`);
//           }
//         }
//       }

//       // Call importVoters from VoterContext
//       await setOfflineData(parsedVoters);

//       // Show success toast and message
//       toast.success(`Successfully imported ${parsedVoters.length} voters`);
//       setMessage({
//         type: "success",
//         text: `Successfully imported ${parsedVoters.length} voters`,
//       });
//       setUploadedFile(null);
//       fileInputRef.current.value = "";
//     } catch (error) {
//       console.error("Error importing voters:", error);
//       toast.error(error.message || "Failed to import voters");
//       setMessage({
//         type: "error",
//         text: error.message || "Failed to import voters",
//       });
//     } finally {
//       setImportLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">Voters</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage and view all voter information
//           </p>
//         </div>
//         {/* <div className="mt-4 sm:mt-0">
//           <button
//             onClick={handleImport}
//             disabled={importLoading}
//             className="btn-primary flex items-center"
//           >
//             {importLoading ? (
//               <LoadingSpinner size="small" className="mr-2" />
//             ) : (
//               <Upload className="h-4 w-4 mr-2" />
//             )}
//             Import Voters
//           </button>
//         </div> */}
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="bg-white border border-gray-200 rounded-lg">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             {/* Search */}
//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search voters..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 />
//               </div>
//             </div>

//             {/* Filter Toggle and Actions */}
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`btn-ghost flex items-center ${
//                   showFilters ? "bg-gray-100" : ""
//                 }`}
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 Filters
//                 {hasActiveFilters && (
//                   <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-green-500 rounded-full">
//                     {Object.values(filters).filter((f) => f !== "").length +
//                       (searchTerm ? 1 : 0)}
//                   </span>
//                 )}
//               </button>

//               <button
//                 onClick={handlePrint}
//                 className="btn-ghost flex items-center"
//               >
//                 <Printer className="h-4 w-4 mr-2" />
//                 Print
//               </button>

//               {hasActiveFilters && (
//                 <button
//                   onClick={resetFilters}
//                   className="btn-ghost flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
//                 >
//                   <X className="h-4 w-4 mr-1" />
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Filters Panel */}
//         {showFilters && (
//           <div className="p-4 bg-gray-50 border-b border-gray-200">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               {/* Gender Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                   Gender
//                 </label>
//                 <select
//                   value={filters.gender}
//                   onChange={(e) => handleFilterChange("gender", e.target.value)}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 >
//                   <option value="">All genders</option>
//                   {uniqueGenders.map((gender) => (
//                     <option key={gender} value={gender}>
//                       {gender}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Age Range Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                   Age range
//                 </label>
//                 <select
//                   value={filters.ageRange}
//                   onChange={(e) =>
//                     handleFilterChange("ageRange", e.target.value)
//                   }
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 >
//                   <option value="">All ages</option>
//                   <option value="18-25">18-25</option>
//                   <option value="26-35">26-35</option>
//                   <option value="36-50">36-50</option>
//                   <option value="51+">51+</option>
//                 </select>
//               </div>

//               {/* Caste Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                   Caste
//                 </label>
//                 <select
//                   value={filters.caste}
//                   onChange={(e) => handleFilterChange("caste", e.target.value)}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 >
//                   <option value="">All castes</option>
//                   {uniqueCastes.map((caste) => (
//                     <option key={caste} value={caste}>
//                       {caste}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* District Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                   District
//                 </label>
//                 <select
//                   value={filters.district}
//                   onChange={(e) =>
//                     handleFilterChange("district", e.target.value)
//                   }
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 >
//                   <option value="">All districts</option>
//                   {uniqueDistricts.map((district) => (
//                     <option key={district} value={district}>
//                       {district}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Assembly Constituency Filter */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                   Assembly constituency
//                 </label>
//                 <select
//                   value={filters.assemblyConstituency}
//                   onChange={(e) =>
//                     handleFilterChange("assemblyConstituency", e.target.value)
//                   }
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 >
//                   <option value="">All constituencies</option>
//                   {uniqueAssemblyConstituencies.map((constituency) => (
//                     <option key={constituency} value={constituency}>
//                       {constituency}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Results Summary */}
//         <div className="px-4 py-3 bg-white border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-gray-700">
//               Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
//               <span className="font-medium">
//                 {Math.min(startIndex + ITEMS_PER_PAGE, filteredVoters.length)}
//               </span>{" "}
//               of <span className="font-medium">{totalRecordsCount}</span>{" "}
//               results
//             </p>
//             {/* <button className="btn-ghost group">
//               <RefreshCcw
//                 size={16}
//                 className="inline mr-1 group-hover:rotate-180 transition-transform duration-200"
//               />
//               <span
//                 className="cursor-pointer"
//                 // onClick={resetFilters}
//               >
//                 Sync Database
//               </span>
//             </button> */}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-full text-sm text-left text-gray-700 border-collapse">
//             <thead>
//               <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
//                 <th className="w-32 px-6 py-4 hidden sm:table-cell">
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     VoterID
//                   </span>
//                 </th>
//                 <th className="min-w-48 px-6 py-4">
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Full Name
//                   </span>
//                 </th>
//                 <th className="w-24 px-6 py-4 hidden sm:table-cell">
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Gender
//                   </span>
//                 </th>
//                 <th className="w-16 px-6 py-4 hidden sm:table-cell">
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Age
//                   </span>
//                 </th>
//                 <th className="w-32 px-6 py-4 hidden sm:table-cell">
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Mobile
//                   </span>
//                 </th>
//                 <th className="min-w-64 px-6 py-4 hidden sm:table-cell">
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Address
//                   </span>
//                 </th>
//                 <th className="w-24 px-6 py-4 hidden sm:table-cell">
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Caste
//                   </span>
//                 </th>
//                 <th className="w-20 px-6 py-4 text-center">
//                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                     Actions
//                   </span>
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100">
//               {paginatedVoters.map((voter) => (
//                 <tr
//                   key={voter.id || voter._id}
//                   className="hover:bg-gray-50 transition-colors duration-200 group hover:cursor-pointer"
//                 >
//                   {/* Voter ID */}
//                   <td
//                     className="px-6 py-4 font-mono text-xs text-gray-600 hidden sm:table-cell"
//                     onClick={() => handleView(voter)}
//                   >
//                     {voter.voterId}
//                   </td>

//                   {/* Full Name */}
//                   <td className="px-6 py-4" onClick={() => handleView(voter)}>
//                     <div className="flex items-center space-x-4">
//                       {/* <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
//                         <span className="text-white text-sm font-semibold">
//                           {voter.fullName.charAt(0)}
//                         </span>
//                       </div> */}
//                       <span className="text-sm font-medium text-gray-900 flex flex-col">
//                         {voter.fullName || "N/A"}
//                         <span className="text-xs font-medium text-gray-700">
//                           {voter.voterId}
//                         </span>
//                       </span>
//                     </div>
//                   </td>

//                   {/* Gender */}
//                   <td
//                     className="px-6 py-4 hidden sm:table-cell"
//                     onClick={() => handleView(voter)}
//                   >
//                     <span
//                       className={`
//                       inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
//                       ${
//                         voter.gender === "Male"
//                           ? "bg-blue-50 text-blue-700 border-blue-200"
//                           : voter.gender === "Female"
//                           ? "bg-pink-50 text-pink-700 border-pink-200"
//                           : "bg-gray-50 text-gray-700 border-gray-200"
//                       }
//                     `}
//                     >
//                       {voter.gender || "N/A"}
//                     </span>
//                   </td>

//                   {/* Age */}
//                   <td
//                     className="px-6 py-4 hidden sm:table-cell"
//                     onClick={() => handleView(voter)}
//                   >
//                     <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
//                       {voter.age}
//                     </span>
//                   </td>

//                   {/* Mobile */}
//                   <td
//                     className="px-6 py-4 font-mono text-xs text-gray-600 hidden sm:table-cell"
//                     onClick={() => handleView(voter)}
//                   >
//                     {voter.mobileNumber || "N/A"}
//                   </td>

//                   {/* Address */}
//                   <td
//                     className="gap-1 px-6 py-4 max-w-xs hidden sm:tablecell sm:flex"
//                     onClick={() => handleView(voter)}
//                   >
//                     <span className="inline-flex itemscenter py1 rounded-md text-sm font-medium text-gray-900">
//                       {voter.houseNo || "N/A"},
//                     </span>
//                     <div
//                       className="truncate text-sm text-gray-900"
//                       title={`${voter.addressLine1}${
//                         voter.addressLine2 ? `, ${voter.addressLine2}` : ""
//                       }`}
//                     >
//                       {voter.addressLine1}
//                       {voter.addressLine2 && `, ${voter.addressLine2}`}
//                     </div>
//                   </td>

//                   {/* House No */}
//                   <td
//                     className="px-6 py-4 hidden sm:table-cell"
//                     onClick={() => handleView(voter)}
//                   >
//                     <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
//                       {voter.caste}
//                     </span>
//                   </td>

//                   {/* Actions */}
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex items-center justify-end space-x-1 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
//                       <button
//                         onClick={() => handleView(voter)}
//                         className="p-2 rounded-lg text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 hover:scale-110"
//                         title="View details"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       {/* <button
//                         onClick={() => handleEdit(voter)}
//                         className="p-2 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
//                         title="Edit voter"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(voter)}
//                         className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110"
//                         title="Delete voter"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button> */}
//                       <button
//                         onClick={() => handleDelete(voter)}
//                         className="p-2 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
//                         title="Delete voter"
//                       >
//                         <Printer className="h-4 w-4" />
//                       </button>
//                       <a
//                         // onClick={() => handleDelete(voter)}
//                         href={`https://wa.me/${voter.mobileNumber}?text=custom%message`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         // to={`https://google.com`}
//                         className="p-2 rounded-lg text-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all duration-200 hover:scale-110"
//                         title="Delete voter"
//                       >
//                         <Share2 className="h-4 w-4" />
//                       </a>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="px-4 py-3 bg-white border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-700">Page</span>
//                 <select
//                   value={currentPage}
//                   onChange={(e) => setCurrentPage(Number(e.target.value))}
//                   className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                 >
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                     (page) => (
//                       <option key={page} value={page}>
//                         {page}
//                       </option>
//                     )
//                   )}
//                 </select>
//                 <span className="text-sm text-gray-700">of {totalPages}</span>
//               </div>

//               <div className="flex items-center">
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                   <button
//                     onClick={() =>
//                       setCurrentPage((prev) => Math.max(prev - 1, 1))
//                     }
//                     disabled={currentPage === 1}
//                     className="pagination-btn"
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                   </button>

//                   {getPageNumbers().map((page) => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`pagination-btn ${
//                         currentPage === page ? "pagination-btn-active" : ""
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}

//                   <button
//                     onClick={() =>
//                       setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                     }
//                     disabled={currentPage === totalPages}
//                     className="pagination-btn"
//                   >
//                     <ChevronRight className="h-4 w-4" />
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="p-8 text-center text-gray-500">
//           <div
//             className="animate-spin rounded-full h-12 w-12 border-4 border-y-green-300 border-x-green-500 mx-auto"
//             key={0}
//           ></div>
//           <p className="mt-4">Loading voters...</p>
//         </div>
//       )}

//       {/* Empty State */}
//       {filteredVoters.length === 0 && !loading && (
//         <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
//           <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//             <Search className="h-8 w-8 text-gray-400" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No voters found
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {hasActiveFilters
//               ? "Try adjusting your search or filter criteria"
//               : "Get started by adding your first voter"}
//           </p>
//           {hasActiveFilters ? (
//             <button onClick={resetFilters} className="btn-secondary">
//               Clear filters
//             </button>
//           ) : (
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="btn-primary"
//             >
//               Add voter
//             </button>
//           )}
//         </div>
//       )}

//       {/* Modals */}
//       <Modal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         title="Add new voter"
//         size="large"
//       >
//         <VoterForm
//           onClose={() => setShowAddModal(false)}
//           onSuccess={() => {
//             setShowAddModal(false);
//           }}
//         />
//       </Modal>

//       <Modal
//         isOpen={showEditModal}
//         onClose={() => setShowEditModal(false)}
//         title="Edit voter"
//         size="large"
//       >
//         <VoterForm
//           voter={selectedVoter}
//           onClose={() => setShowEditModal(false)}
//           onSuccess={() => {
//             setShowEditModal(false);
//             setSelectedVoter(null);
//           }}
//         />
//       </Modal>

//       <Modal
//         isOpen={showDetailsModal}
//         onClose={() => setShowDetailsModal(false)}
//         title="Voter details"
//         size="large"
//       >
//         <VoterDetails
//           voter={selectedVoter}
//           onEdit={() => {
//             setShowDetailsModal(false);
//             setShowEditModal(true);
//           }}
//         />
//       </Modal>
//     </div>
//   );
// };

// export default VotersPageOffline;
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  RefreshCcw,
  Upload,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import VoterForm from "./VoterForm";
import VoterDetails from "./VoterDetails";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import Dexie from "dexie";
import Papa from "papaparse";
import { registerSW } from "virtual:pwa-register";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import axios from "axios";

const ITEMS_PER_PAGE = 25;

const VotersPageOffline = () => {
  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://voter-backend-y6hw.onrender.com";

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm("New version available. Reload to update?")) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log("PWA is ready to work offline.");
      },
    });
  }, []);

  // State management (replacing context variables)
  const [offlineData, setOfflineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);
  const totalPageCount = Math.ceil(totalRecordsCount / ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    ageRange: "",
    caste: "",
    district: "",
    assemblyConstituency: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize Dexie database
  const db = new Dexie("VoterDatabase");
  db.version(1).stores({
    csvFiles: "++id,fileName,blob,createdAt",
  });

  // Fetch and parse CSV from IndexedDB
  useEffect(() => {
    const fetchCSVFromIndexedDB = async () => {
      setLoading(true);
      try {
        // Get the latest CSV file (sort by createdAt descending)
        const latestFile = await db.csvFiles.orderBy("createdAt").last();
        if (latestFile && latestFile.blob) {
          // Convert Blob to text for parsing
          const text = await latestFile.blob.text();
          // Parse CSV using PapaParse
          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const parsedData = result.data.map((row) => ({
                // Map CSV headers to schema fields
                id:
                  row["Voter ID"] ||
                  `temp-${Math.random().toString(36).substr(2, 9)}`, // Generate temp ID if not present
                voterId: row["Voter ID"] || "",
                fullName: row["Full Name"] || "",
                firstName: row["First Name"] || "",
                lastName: row["Last Name"] || "",
                relativeName: row["Relative Name"] || "",
                houseNo: row["House Number"] || "",
                addressLine1: row["Address Line 1"] || "",
                addressLine2: row["Address Line 2"] || "",
                gender: row["Gender"] || "",
                age: parseInt(row["Age"]) || 0,
                mobileNumber: row["Mobile Number"] || "",
                caste: row["Caste"] || "",
                sectionDetails: row["Section Details"] || "",
                yadiNumber: row["Yadi Number"] || "",
                assemblyConstituencyNumber:
                  parseInt(row["Assembly Constituency Number"]) || 0,
                assemblyConstituencyName:
                  row["Assembly Constituency Name"] || "",
                assemblyReservationStatus:
                  row["Assembly Reservation Status"] || "",
                lokSabhaConstituencyNumber:
                  parseInt(row["Lok Sabha Constituency Number"]) || 0,
                lokSabhaConstituencyName:
                  row["Lok Sabha Constituency Name"] || "",
                lokSabhaReservationStatus:
                  row["Lok Sabha Reservation Status"] || "",
                hometown: row["Hometown"] || "",
                policeStation: row["Police Station"] || "",
                taluka: row["Taluka"] || "",
                district: row["District"] || "",
                pinCode: row["Pin Code"] || "",
              }));
              setOfflineData(parsedData);
              setTotalRecordsCount(parsedData.length);
              // toast.success(
              //   `Loaded ${parsedData.length} voters from IndexedDB`
              // );
            },
            error: (error) => {
              console.error("Error parsing CSV:", error);
              toast.error("Failed to parse CSV from IndexedDB");
            },
          });
        } else {
          toast.error("No CSV file found in IndexedDB");
        }
      } catch (error) {
        console.error("Error fetching CSV from IndexedDB:", error);
        toast.error("Failed to load data from IndexedDB");
      } finally {
        setLoading(false);
      }
    };

    fetchCSVFromIndexedDB();
  }, []);

  // Delete voter function
  const deleteVoter = async (voterId) => {
    try {
      setLoading(true);
      const updatedData = offlineData.filter((voter) => voter.id !== voterId);
      setOfflineData(updatedData);
      setTotalRecordsCount(updatedData.length);
      toast.success("Voter deleted successfully");
    } catch (error) {
      console.error("Error deleting voter:", error);
      toast.error("Failed to delete voter");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search voters
  const filteredVoters = useMemo(() => {
    return offlineData.filter((voter) => {
      const matchesSearch =
        !searchTerm ||
        voter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.mobileNumber.includes(searchTerm);

      const matchesGender = !filters.gender || voter.gender === filters.gender;

      const matchesAge =
        !filters.ageRange ||
        (() => {
          const age = voter.age;
          switch (filters.ageRange) {
            case "18-25":
              return age >= 18 && age <= 25;
            case "26-35":
              return age >= 26 && age <= 35;
            case "36-50":
              return age >= 36 && age <= 50;
            case "51+":
              return age >= 51;
            default:
              return true;
          }
        })();

      const matchesCaste = !filters.caste || voter.caste === filters.caste;
      const matchesDistrict =
        !filters.district || voter.district === filters.district;
      const matchesAssembly =
        !filters.assemblyConstituency ||
        voter.assemblyConstituencyName === filters.assemblyConstituency;

      return (
        matchesSearch &&
        matchesGender &&
        matchesAge &&
        matchesCaste &&
        matchesDistrict &&
        matchesAssembly
      );
    });
  }, [offlineData, searchTerm, filters]);

  // Pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVoters = filteredVoters.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Get unique values for filters
  const uniqueGenders = [...new Set(offlineData.map((v) => v.gender))].filter(
    Boolean
  );
  const uniqueCastes = [...new Set(offlineData.map((v) => v.caste))].filter(
    Boolean
  );
  const uniqueDistricts = [
    ...new Set(offlineData.map((v) => v.district)),
  ].filter(Boolean);
  const uniqueAssemblyConstituencies = [
    ...new Set(offlineData.map((v) => v.assemblyConstituencyName)),
  ].filter(Boolean);

  const isOnline = useOnlineStatus();
  const handleSyncDB = async () => {
    setLoading(true);

    try {
      // Make GET request to the export endpoint
      const response = await axios.get(`${BASE_URL}/api/voters/getCSV`, {
        responseType: "blob", // Treat response as a Blob
      });

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

      // setStatus(`CSV file "${fileName}" saved to IndexedDB successfully!`);
    } catch (err) {
      console.error("Error processing CSV:", err);
      // setError("Failed to fetch or save CSV file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleView = (voter) => {
    setSelectedVoter(voter);
    setShowDetailsModal(true);
  };

  const handleEdit = (voter) => {
    setSelectedVoter(voter);
    setShowEditModal(true);
  };

  const handleDelete = async (voter) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${voter.fullName}?`
    );
    if (confirmDelete) {
      await deleteVoter(voter.id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setFilters({
      gender: "",
      ageRange: "",
      caste: "",
      district: "",
      assemblyConstituency: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Object.values(filters).some((filter) => filter !== "") || searchTerm !== "";

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPageCount, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);

  const handleImport = async () => {
    if (!uploadedFile) {
      toast.error("Please select a file first");
      return;
    }

    setImportLoading(true);
    try {
      const text = await uploadedFile.text();
      let parsedVoters;
      try {
        parsedVoters = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Invalid JSON format");
      }

      if (!Array.isArray(parsedVoters)) {
        throw new Error("JSON file must contain an array of voter objects");
      }

      const requiredFields = ["voterId", "fullName", "gender"];
      for (const voter of parsedVoters) {
        for (const field of requiredFields) {
          if (!voter[field]) {
            throw new Error(`Missing required field: ${field}`);
          }
        }
      }

      setOfflineData(parsedVoters);
      setTotalRecordsCount(parsedVoters.length);
      toast.success(`Successfully imported ${parsedVoters.length} voters`);
      setUploadedFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error importing voters:", error);
      toast.error(error.message || "Failed to import voters");
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-12">
      {/* <div className="absolute top-2 right-1/2 bg-emerald-600">
        <nav className="fixed bg-emerald-600 text-white px-6 py-2 rounded-md">
          <a href="/voters">Online Mode</a>
        </nav>
      </div> */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Voters</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all voter information
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0">
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
        </div> */}
        <div className="mt-4 sm:mt-0">
          <a
            href="/voters"
            // disabled={importLoading}
            className="btn-primary flex items-center"
          >
            {/* {importLoading ? (
              <LoadingSpinner size="small" className="mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )} */}
            Online Mode
          </a>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search voters..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle and Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-ghost flex items-center ${
                  showFilters ? "bg-gray-100" : ""
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-green-500 rounded-full">
                    {Object.values(filters).filter((f) => f !== "").length +
                      (searchTerm ? 1 : 0)}
                  </span>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="btn-ghost flex items-center"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="btn-ghost flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All genders</option>
                  {uniqueGenders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Age range
                </label>
                <select
                  value={filters.ageRange}
                  onChange={(e) =>
                    handleFilterChange("ageRange", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All ages</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51+">51+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Caste
                </label>
                <select
                  value={filters.caste}
                  onChange={(e) => handleFilterChange("caste", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All castes</option>
                  {uniqueCastes.map((caste) => (
                    <option key={caste} value={caste}>
                      {caste}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  District
                </label>
                <select
                  value={filters.district}
                  onChange={(e) =>
                    handleFilterChange("district", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">AllRosario</option>
                  {uniqueDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Assembly constituency
                </label>
                <select
                  value={filters.assemblyConstituency}
                  onChange={(e) =>
                    handleFilterChange("assemblyConstituency", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All constituencies</option>
                  {uniqueAssemblyConstituencies.map((constituency) => (
                    <option key={constituency} value={constituency}>
                      {constituency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredVoters.length)}
              </span>{" "}
              of <span className="font-medium">{totalRecordsCount}</span>{" "}
              results
            </p>
            <button
              className={`${isOnline ? "" : "hidden"} btn-ghost group`}
              onClick={handleSyncDB}
            >
              <RefreshCcw
                size={16}
                className="inline mr-1 group-hover:rotate-180 transition-transform duration-200"
              />
              <span className="cursor-pointer">Sync Database</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-sm text-left text-gray-700 border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <th className="w-32 px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    VoterID
                  </span>
                </th>
                <th className="min-w-48 px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Full Name
                  </span>
                </th>
                <th className="w-24 px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Gender
                  </span>
                </th>
                <th className="w-16 px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Age
                  </span>
                </th>
                <th className="w-32 px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Mobile
                  </span>
                </th>
                <th className="min-w-64 px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Address
                  </span>
                </th>
                <th className="w-24 px-6 py-4 hidden sm:table-cell">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Caste
                  </span>
                </th>
                <th className="w-20 px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedVoters.map((voter) => (
                <tr
                  key={voter.id || voter._id}
                  className="hover:bg-gray-50 transition-colors duration-200 group hover:cursor-pointer"
                >
                  {/* Voter ID */}
                  <td
                    className="px-6 py-4 font-mono text-xs text-gray-600 hidden sm:table-cell"
                    onClick={() => handleView(voter)}
                  >
                    {voter.voterId}
                  </td>

                  {/* Full Name */}
                  <td className="px-6 py-4" onClick={() => handleView(voter)}>
                    <div className="flex items-center space-x-4">
                      {/* <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {voter.fullName.charAt(0)}
                        </span>
                      </div> */}
                      <span className="text-sm font-medium text-gray-900 flex flex-col">
                        {voter.fullName || "N/A"}
                        <span className="text-xs font-medium text-gray-700">
                          {voter.voterId}
                        </span>
                      </span>
                    </div>
                  </td>

                  {/* Gender */}
                  <td
                    className="px-6 py-4 hidden sm:table-cell"
                    onClick={() => handleView(voter)}
                  >
                    <span
                      className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                      ${
                        voter.gender === "Male"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : voter.gender === "Female"
                          ? "bg-pink-50 text-pink-700 border-pink-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    `}
                    >
                      {voter.gender || "N/A"}
                    </span>
                  </td>

                  {/* Age */}
                  <td
                    className="px-6 py-4 hidden sm:table-cell"
                    onClick={() => handleView(voter)}
                  >
                    <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                      {voter.age}
                    </span>
                  </td>

                  {/* Mobile */}
                  <td
                    className="px-6 py-4 font-mono text-xs text-gray-600 hidden sm:table-cell"
                    onClick={() => handleView(voter)}
                  >
                    {voter.mobileNumber || "N/A"}
                  </td>

                  {/* Address */}
                  <td
                    className="gap-1 px-6 py-4 max-w-xs hidden sm:tablecell sm:flex"
                    onClick={() => handleView(voter)}
                  >
                    <span className="inline-flex itemscenter py1 rounded-md text-sm font-medium text-gray-900">
                      {voter.houseNo || "N/A"},
                    </span>
                    <div
                      className="truncate text-sm text-gray-900"
                      title={`${voter.addressLine1}${
                        voter.addressLine2 ? `, ${voter.addressLine2}` : ""
                      }`}
                    >
                      {voter.addressLine1}
                      {voter.addressLine2 && `, ${voter.addressLine2}`}
                    </div>
                  </td>

                  {/* House No */}
                  <td
                    className="px-6 py-4 hidden sm:table-cell"
                    onClick={() => handleView(voter)}
                  >
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {voter.caste}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleView(voter)}
                        className="p-2 rounded-lg text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 hover:scale-110"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {/* <button
                        onClick={() => handleEdit(voter)}
                        className="p-2 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                        title="Edit voter"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(voter)}
                        className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 hover:scale-110"
                        title="Delete voter"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button> */}
                      <button
                        onClick={() => handleDelete(voter)}
                        className="p-2 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                        title="Delete voter"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <a
                        // onClick={() => handleDelete(voter)}
                        href={`https://wa.me/${voter.mobileNumber}?text=custom%message`}
                        target="_blank"
                        rel="noopener noreferrer"
                        // to={`https://google.com`}
                        className="p-2 rounded-lg text-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all duration-200 hover:scale-110"
                        title="Delete voter"
                      >
                        <Share2 className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPageCount > 1 && (
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 col-span-6">
                <span className="text-sm text-gray-700">Page</span>
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {Array.from({ length: totalPageCount }, (_, i) => i + 1).map(
                    (page) => (
                      <option key={page} value={page}>
                        {page}
                      </option>
                    )
                  )}
                </select>
                <span className="text-sm text-gray-700">
                  of {totalPageCount}
                </span>
              </div>

              <div className="flex items-center col-span-6 justify-end">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`pagination-btn ${
                        currentPage === page ? "pagination-btn-active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPageCount)
                      )
                    }
                    disabled={currentPage === totalPageCount}
                    className="pagination-btn"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center text-gray-500">
            <div
              className="animate-spin rounded-full h-12 w-12 border-4 border-y-green-300 border-x-green-500 mx-auto"
              key={0}
            ></div>
            <p className="mt-4">Loading voters...</p>
          </div>
        )}

        {/* Empty State */}
        {filteredVoters.length === 0 && !loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No voters found
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first voter"}
            </p>
            {hasActiveFilters ? (
              <button onClick={resetFilters} className="btn-secondary">
                Clear filters
              </button>
            ) : (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                Add voter
              </button>
            )}
          </div>
        )}

        {/* Modals */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add new voter"
          size="large"
        >
          <VoterForm
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
            }}
          />
        </Modal>

        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit voter"
          size="large"
        >
          <VoterForm
            voter={selectedVoter}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedVoter(null);
            }}
          />
        </Modal>

        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Voter details"
          size="large"
        >
          <VoterDetails
            voter={selectedVoter}
            onEdit={() => {
              setShowDetailsModal(false);
              setShowEditModal(true);
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default VotersPageOffline;
