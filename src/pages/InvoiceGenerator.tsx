
import { useState, useEffect } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';
import { useMasterData } from '../contexts/MasterDataContext';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';

const InvoiceGenerator = () => {
  const { currentInvoice, createNewInvoice } = useInvoice();

  useEffect(() => {
    if (!currentInvoice) {
      createNewInvoice();
    }
  }, [currentInvoice, createNewInvoice]);

  if (!currentInvoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Invoice</h1>
        <p className="text-gray-600">Create professional proforma invoices</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <InvoiceForm />
        </div>
        <div>
          <InvoicePreview />
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
