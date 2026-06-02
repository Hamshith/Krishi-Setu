// Just reuse the FarmerEarnings component structure as it fetches the exact same endpoint
import React from 'react';
import FarmerEarnings from '../farmer/FarmerEarnings';

const VendorEarnings = () => {
  return (
    <FarmerEarnings /> // the API endpoint /api/earnings serves both roles perfectly
  );
};

export default VendorEarnings;
