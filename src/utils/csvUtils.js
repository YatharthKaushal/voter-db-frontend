// Utility functions for CSV import/export

export const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = [
    'Sr. No.',
    'Voter ID',
    'Full Name',
    'First Name',
    'Last Name',
    'Relative Name',
    'House No',
    'Address Line 1',
    'Address Line 2',
    'Gender',
    'Age',
    'Mobile Number',
    'Caste',
    'Section Details',
    'Yadi Number',
    'Assembly Constituency Number',
    'Assembly Constituency Name',
    'Assembly Reservation Status',
    'Lok Sabha Constituency Number',
    'Lok Sabha Constituency Name',
    'Lok Sabha Reservation Status',
    'Hometown',
    'Police Station',
    'Taluka',
    'District',
    'Pin Code'
  ];
  
  const csvContent = [
    headers.join(','),
    ...data.map((voter, index) => [
      index + 1,
      voter.voterId,
      voter.fullName,
      voter.firstName,
      voter.lastName,
      voter.relativeName,
      voter.houseNo,
      voter.addressLine1,
      voter.addressLine2,
      voter.gender,
      voter.age,
      voter.mobileNumber,
      voter.caste,
      voter.sectionDetails,
      voter.yadiNumber,
      voter.assemblyConstituencyNumber,
      voter.assemblyConstituencyName,
      voter.assemblyReservationStatus,
      voter.lokSabhaConstituencyNumber,
      voter.lokSabhaConstituencyName,
      voter.lokSabhaReservationStatus,
      voter.hometown,
      voter.policeStation,
      voter.taluka,
      voter.district,
      voter.pinCode
    ].map(field => `"${field || ''}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (data, filename = 'voters.csv') => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) throw new Error('Invalid CSV format');
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
    if (values.length < headers.length) continue;
    
    const voter = {
      id: Date.now() + i,
      voterId: values[headers.indexOf('Voter ID')] || '',
      fullName: values[headers.indexOf('Full Name')] || '',
      firstName: values[headers.indexOf('First Name')] || '',
      lastName: values[headers.indexOf('Last Name')] || '',
      relativeName: values[headers.indexOf('Relative Name')] || '',
      houseNo: values[headers.indexOf('House No')] || '',
      addressLine1: values[headers.indexOf('Address Line 1')] || '',
      addressLine2: values[headers.indexOf('Address Line 2')] || '',
      gender: values[headers.indexOf('Gender')] || '',
      age: parseInt(values[headers.indexOf('Age')]) || 0,
      mobileNumber: values[headers.indexOf('Mobile Number')] || '',
      caste: values[headers.indexOf('Caste')] || '',
      sectionDetails: values[headers.indexOf('Section Details')] || '',
      yadiNumber: values[headers.indexOf('Yadi Number')] || '',
      assemblyConstituencyNumber: values[headers.indexOf('Assembly Constituency Number')] || '',
      assemblyConstituencyName: values[headers.indexOf('Assembly Constituency Name')] || '',
      assemblyReservationStatus: values[headers.indexOf('Assembly Reservation Status')] || '',
      lokSabhaConstituencyNumber: values[headers.indexOf('Lok Sabha Constituency Number')] || '',
      lokSabhaConstituencyName: values[headers.indexOf('Lok Sabha Constituency Name')] || '',
      lokSabhaReservationStatus: values[headers.indexOf('Lok Sabha Reservation Status')] || '',
      hometown: values[headers.indexOf('Hometown')] || '',
      policeStation: values[headers.indexOf('Police Station')] || '',
      taluka: values[headers.indexOf('Taluka')] || '',
      district: values[headers.indexOf('District')] || '',
      pinCode: values[headers.indexOf('Pin Code')] || ''
    };
    
    // Validate required fields
    if (!voter.voterId || !voter.fullName || !voter.gender) {
      throw new Error(`Invalid voter data at line ${i + 1}: Missing required fields`);
    }
    
    data.push(voter);
  }
  
  return data;
};