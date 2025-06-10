import React, { useState } from 'react';
import { useVoters } from '../../contexts/VoterContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const VoterForm = ({ voter, onClose, onSuccess }) => {
  const { addVoter, updateVoter, loading } = useVoters();
  const [formData, setFormData] = useState({
    voterId: voter?.voterId || '',
    fullName: voter?.fullName || '',
    firstName: voter?.firstName || '',
    lastName: voter?.lastName || '',
    relativeName: voter?.relativeName || '',
    houseNo: voter?.houseNo || '',
    addressLine1: voter?.addressLine1 || '',
    addressLine2: voter?.addressLine2 || '',
    gender: voter?.gender || '',
    age: voter?.age || '',
    mobileNumber: voter?.mobileNumber || '',
    caste: voter?.caste || '',
    sectionDetails: voter?.sectionDetails || '',
    yadiNumber: voter?.yadiNumber || '',
    assemblyConstituencyNumber: voter?.assemblyConstituencyNumber || '',
    assemblyConstituencyName: voter?.assemblyConstituencyName || '',
    assemblyReservationStatus: voter?.assemblyReservationStatus || '',
    lokSabhaConstituencyNumber: voter?.lokSabhaConstituencyNumber || '',
    lokSabhaConstituencyName: voter?.lokSabhaConstituencyName || '',
    lokSabhaReservationStatus: voter?.lokSabhaReservationStatus || '',
    hometown: voter?.hometown || '',
    policeStation: voter?.policeStation || '',
    taluka: voter?.taluka || '',
    district: voter?.district || '',
    pinCode: voter?.pinCode || ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.voterId) newErrors.voterId = 'Voter ID is required';
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    if (formData.age && (isNaN(formData.age) || formData.age < 18 || formData.age > 120)) {
      newErrors.age = 'Age must be between 18 and 120';
    }
    
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }
    
    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Pin code must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (voter) {
        await updateVoter(voter.id, formData);
      } else {
        await addVoter(formData);
      }
      onSuccess();
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formFields = [
    // Basic Information
    {
      section: 'Basic Information',
      fields: [
        { name: 'voterId', label: 'Voter ID', type: 'text', required: true, colSpan: 'col-span-1' },
        { name: 'fullName', label: 'Full Name', type: 'text', required: true, colSpan: 'col-span-2' },
        { name: 'firstName', label: 'First Name', type: 'text', colSpan: 'col-span-1' },
        { name: 'lastName', label: 'Last Name', type: 'text', colSpan: 'col-span-1' },
        { name: 'relativeName', label: 'Relative Name', type: 'text', colSpan: 'col-span-1' },
        { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'], colSpan: 'col-span-1' },
        { name: 'age', label: 'Age', type: 'number', colSpan: 'col-span-1' },
        { name: 'mobileNumber', label: 'Mobile Number', type: 'tel', colSpan: 'col-span-1' }
      ]
    },
    // Address Information
    {
      section: 'Address Information',
      fields: [
        { name: 'houseNo', label: 'House No', type: 'text', colSpan: 'col-span-1' },
        { name: 'addressLine1', label: 'Address Line 1', type: 'text', colSpan: 'col-span-2' },
        { name: 'addressLine2', label: 'Address Line 2', type: 'text', colSpan: 'col-span-2' },
        { name: 'hometown', label: 'Hometown', type: 'text', colSpan: 'col-span-1' },
        { name: 'district', label: 'District', type: 'text', colSpan: 'col-span-1' },
        { name: 'taluka', label: 'Taluka', type: 'text', colSpan: 'col-span-1' },
        { name: 'policeStation', label: 'Police Station', type: 'text', colSpan: 'col-span-1' },
        { name: 'pinCode', label: 'Pin Code', type: 'text', colSpan: 'col-span-1' }
      ]
    },
    // Administrative Details
    {
      section: 'Administrative Details',
      fields: [
        { name: 'caste', label: 'Caste', type: 'text', colSpan: 'col-span-1' },
        { name: 'sectionDetails', label: 'Section Details', type: 'text', colSpan: 'col-span-1' },
        { name: 'yadiNumber', label: 'Yadi Number', type: 'text', colSpan: 'col-span-1' },
        { name: 'assemblyConstituencyNumber', label: 'Assembly Constituency Number', type: 'text', colSpan: 'col-span-1' },
        { name: 'assemblyConstituencyName', label: 'Assembly Constituency Name', type: 'text', colSpan: 'col-span-2' },
        { name: 'assemblyReservationStatus', label: 'Assembly Reservation Status', type: 'select', options: ['General', 'SC', 'ST', 'OBC'], colSpan: 'col-span-1' },
        { name: 'lokSabhaConstituencyNumber', label: 'Lok Sabha Constituency Number', type: 'text', colSpan: 'col-span-1' },
        { name: 'lokSabhaConstituencyName', label: 'Lok Sabha Constituency Name', type: 'text', colSpan: 'col-span-2' },
        { name: 'lokSabhaReservationStatus', label: 'Lok Sabha Reservation Status', type: 'select', options: ['General', 'SC', 'ST'], colSpan: 'col-span-1' }
      ]
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {formFields.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{section.section}</h3>
          <div className="grid grid-cols-3 gap-4">
            {section.fields.map((field) => (
              <div key={field.name} className={field.colSpan}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`input-field ${errors[field.name] ? 'border-red-300 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`input-field ${errors[field.name] ? 'border-red-300 focus:ring-red-500' : ''}`}
                    placeholder={`Enter ${field.label}`}
                  />
                )}
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center"
        >
          {loading && <LoadingSpinner size="small\" className="mr-2" />}
          {voter ? 'Update Voter' : 'Add Voter'}
        </button>
      </div>
    </form>
  );
};

export default VoterForm;