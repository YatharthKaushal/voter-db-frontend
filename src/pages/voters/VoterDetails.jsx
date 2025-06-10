import React from 'react';
import { Edit, User, MapPin, FileText } from 'lucide-react';

const VoterDetails = ({ voter, onEdit }) => {
  if (!voter) return null;

  const sections = [
    {
      title: 'Basic Information',
      icon: User,
      fields: [
        { label: 'Voter ID', value: voter.voterId },
        { label: 'Full Name', value: voter.fullName },
        { label: 'First Name', value: voter.firstName },
        { label: 'Last Name', value: voter.lastName },
        { label: 'Relative Name', value: voter.relativeName },
        { label: 'Gender', value: voter.gender },
        { label: 'Age', value: voter.age },
        { label: 'Mobile Number', value: voter.mobileNumber }
      ]
    },
    {
      title: 'Address Information',
      icon: MapPin,
      fields: [
        { label: 'House No', value: voter.houseNo },
        { label: 'Address Line 1', value: voter.addressLine1 },
        { label: 'Address Line 2', value: voter.addressLine2 },
        { label: 'Hometown', value: voter.hometown },
        { label: 'District', value: voter.district },
        { label: 'Taluka', value: voter.taluka },
        { label: 'Police Station', value: voter.policeStation },
        { label: 'Pin Code', value: voter.pinCode }
      ]
    },
    {
      title: 'Administrative Details',
      icon: FileText,
      fields: [
        { label: 'Caste', value: voter.caste },
        { label: 'Section Details', value: voter.sectionDetails },
        { label: 'Yadi Number', value: voter.yadiNumber },
        { label: 'Assembly Constituency Number', value: voter.assemblyConstituencyNumber },
        { label: 'Assembly Constituency Name', value: voter.assemblyConstituencyName },
        { label: 'Assembly Reservation Status', value: voter.assemblyReservationStatus },
        { label: 'Lok Sabha Constituency Number', value: voter.lokSabhaConstituencyNumber },
        { label: 'Lok Sabha Constituency Name', value: voter.lokSabhaConstituencyName },
        { label: 'Lok Sabha Reservation Status', value: voter.lokSabhaReservationStatus }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Icon className="h-5 w-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {field.value || '-'}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onEdit}
          className="btn-primary flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Voter
        </button>
      </div>
    </div>
  );
};

export default VoterDetails;