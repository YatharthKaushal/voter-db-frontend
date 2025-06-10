import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Eye, Edit, Printer, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { useVoters } from '../../contexts/VoterContext';
import Modal from '../../components/ui/Modal';
import VoterForm from './VoterForm';
import VoterDetails from './VoterDetails';

const ITEMS_PER_PAGE = 25;

const VotersPage = () => {
  const { voters, deleteVoter } = useVoters();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    ageRange: '',
    caste: '',
    district: '',
    assemblyConstituency: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search voters
  const filteredVoters = useMemo(() => {
    return voters.filter(voter => {
      const matchesSearch = !searchTerm || 
        voter.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voter.mobileNumber.includes(searchTerm);
      
      const matchesGender = !filters.gender || voter.gender === filters.gender;
      
      const matchesAge = !filters.ageRange || (() => {
        const age = voter.age;
        switch (filters.ageRange) {
          case '18-25': return age >= 18 && age <= 25;
          case '26-35': return age >= 26 && age <= 35;
          case '36-50': return age >= 36 && age <= 50;
          case '51+': return age >= 51;
          default: return true;
        }
      })();
      
      const matchesCaste = !filters.caste || voter.caste === filters.caste;
      const matchesDistrict = !filters.district || voter.district === filters.district;
      const matchesAssembly = !filters.assemblyConstituency || voter.assemblyConstituencyName === filters.assemblyConstituency;
      
      return matchesSearch && matchesGender && matchesAge && matchesCaste && matchesDistrict && matchesAssembly;
    });
  }, [voters, searchTerm, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredVoters.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVoters = filteredVoters.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique values for filters
  const uniqueGenders = [...new Set(voters.map(v => v.gender))].filter(Boolean);
  const uniqueCastes = [...new Set(voters.map(v => v.caste))].filter(Boolean);
  const uniqueDistricts = [...new Set(voters.map(v => v.district))].filter(Boolean);
  const uniqueAssemblyConstituencies = [...new Set(voters.map(v => v.assemblyConstituencyName))].filter(Boolean);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
    const confirmDelete = window.confirm(`Are you sure you want to delete ${voter.fullName}?`);
    if (confirmDelete) {
      await deleteVoter(voter.id);
    }
  };


  const handlePrint = () => {
    window.print();
  };

  const resetFilters = () => {
    setFilters({ gender: '', ageRange: '', caste: '', district: '', assemblyConstituency: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '') || searchTerm !== '';

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Voters</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all voter information
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add voter
          </button>
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
                className={`btn-ghost flex items-center ${showFilters ? 'bg-gray-100' : ''}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-green-500 rounded-full">
                    {Object.values(filters).filter(f => f !== '').length + (searchTerm ? 1 : 0)}
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
              {/* Gender Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All genders</option>
                  {uniqueGenders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              {/* Age Range Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Age range
                </label>
                <select
                  value={filters.ageRange}
                  onChange={(e) => handleFilterChange('ageRange', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All ages</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51+">51+</option>
                </select>
              </div>

              {/* Caste Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Caste
                </label>
                <select
                  value={filters.caste}
                  onChange={(e) => handleFilterChange('caste', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All castes</option>
                  {uniqueCastes.map(caste => (
                    <option key={caste} value={caste}>{caste}</option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  District
                </label>
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All districts</option>
                  {uniqueDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Assembly Constituency Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Assembly constituency
                </label>
                <select
                  value={filters.assemblyConstituency}
                  onChange={(e) => handleFilterChange('assemblyConstituency', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All constituencies</option>
                  {uniqueAssemblyConstituencies.map(constituency => (
                    <option key={constituency} value={constituency}>{constituency}</option>
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
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredVoters.length)}</span> of{' '}
              <span className="font-medium">{filteredVoters.length}</span> results
            </p>
            <div className="text-sm text-gray-500">
              {filteredVoters.length} of {voters.length} voters
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-sm text-left text-gray-700 border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                <th className="w-32 px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Voter ID</span>
                </th>
                <th className="min-w-48 px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full Name</span>
                </th>
                <th className="w-24 px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Gender</span>
                </th>
                <th className="w-16 px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Age</span>
                </th>
                <th className="w-32 px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Mobile</span>
                </th>
                <th className="min-w-64 px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Address</span>
                </th>
                <th className="w-24 px-6 py-4">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">House No</span>
                </th>
                <th className="w-20 px-6 py-4 text-right">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginatedVoters.map((voter) => (
                <tr key={voter.id} className="hover:bg-gray-50 transition-colors duration-200 group">
                  {/* Voter ID */}
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{voter.voterId}</td>

                  {/* Full Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {voter.fullName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{voter.fullName}</span>
                    </div>
                  </td>

                  {/* Gender */}
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                      ${
                        voter.gender === 'Male'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : voter.gender === 'Female'
                          ? 'bg-pink-50 text-pink-700 border-pink-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }
                    `}>
                      {voter.gender}
                    </span>
                  </td>

                  {/* Age */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                      {voter.age}
                    </span>
                  </td>

                  {/* Mobile */}
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{voter.mobileNumber}</td>

                  {/* Address */}
                  <td className="px-6 py-4 max-w-xs">
                    <div className="truncate text-sm text-gray-900" title={`${voter.addressLine1}${voter.addressLine2 ? `, ${voter.addressLine2}` : ''}`}>
                      {voter.addressLine1}
                      {voter.addressLine2 && `, ${voter.addressLine2}`}
                    </div>
                  </td>

                  {/* House No */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {voter.houseNo}
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
                      <button
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
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Page</span>
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <option key={page} value={page}>{page}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">of {totalPages}</span>
              </div>

              <div className="flex items-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`pagination-btn ${
                        currentPage === page ? 'pagination-btn-active' : ''
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredVoters.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No voters found</h3>
          <p className="text-gray-500 mb-6">
            {hasActiveFilters 
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first voter"
            }
          </p>
          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="btn-secondary"
            >
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
  );
};

export default VotersPage;