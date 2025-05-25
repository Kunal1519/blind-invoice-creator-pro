
import React, { createContext, useContext, useState } from 'react';

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  shade: string;
  shadeColor: string;
  operationType: string;
  quantity: number;
  widthInches: number;
  heightInches: number;
  widthCm: number;
  heightCm: number;
  unit: 'inches' | 'cm';
  sqFt: number;
  pricePerSqFt: number;
  amount: number;
}

export interface Invoice {
  id: string;
  vendorId: string;
  partyId: string;
  invoiceNumber: string;
  date: string;
  gstNo: string;
  items: InvoiceItem[];
  totalMaterial: number;
  totalSqFt: number;
  discountPercentage: number;
  discountAmount: number;
  packingCharges: number;
  pelmetCharges: number;
  courierCharges: number;
  installationCharges: number;
  totalAmountBeforeTax: number;
  gstEnabled: boolean;
  gstPercentage: number;
  gstAmount: number;
  grandTotal: number;
  totalPayment: number;
}

interface InvoiceContextType {
  currentInvoice: Invoice | null;
  createNewInvoice: () => void;
  updateInvoice: (invoice: Partial<Invoice>) => void;
  addInvoiceItem: (item: Omit<InvoiceItem, 'id' | 'sqFt' | 'amount'>) => void;
  updateInvoiceItem: (id: string, item: Partial<InvoiceItem>) => void;
  removeInvoiceItem: (id: string) => void;
  calculateTotals: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  const calculateSqFt = (width: number, height: number, unit: 'inches' | 'cm'): number => {
    if (unit === 'inches') {
      return (width * height) / 144;
    } else {
      return (width * height) / 929.0304;
    }
  };

  const createNewInvoice = () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      vendorId: '',
      partyId: '',
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      gstNo: '',
      items: [],
      totalMaterial: 0,
      totalSqFt: 0,
      discountPercentage: 0,
      discountAmount: 0,
      packingCharges: 0,
      pelmetCharges: 0,
      courierCharges: 0,
      installationCharges: 0,
      totalAmountBeforeTax: 0,
      gstEnabled: true,
      gstPercentage: 18,
      gstAmount: 0,
      grandTotal: 0,
      totalPayment: 0
    };
    setCurrentInvoice(newInvoice);
  };

  const updateInvoice = (invoice: Partial<Invoice>) => {
    if (currentInvoice) {
      setCurrentInvoice({ ...currentInvoice, ...invoice });
    }
  };

  const addInvoiceItem = (item: Omit<InvoiceItem, 'id' | 'sqFt' | 'amount'>) => {
    if (currentInvoice) {
      const width = item.unit === 'inches' ? item.widthInches : item.widthCm;
      const height = item.unit === 'inches' ? item.heightInches : item.heightCm;
      const sqFt = calculateSqFt(width, height, item.unit);
      const amount = sqFt * item.pricePerSqFt * item.quantity;

      const newItem: InvoiceItem = {
        ...item,
        id: Date.now().toString(),
        sqFt: parseFloat(sqFt.toFixed(2)),
        amount: parseFloat(amount.toFixed(2))
      };

      setCurrentInvoice({
        ...currentInvoice,
        items: [...currentInvoice.items, newItem]
      });
    }
  };

  const updateInvoiceItem = (id: string, item: Partial<InvoiceItem>) => {
    if (currentInvoice) {
      const updatedItems = currentInvoice.items.map(existingItem => {
        if (existingItem.id === id) {
          const updatedItem = { ...existingItem, ...item };
          const width = updatedItem.unit === 'inches' ? updatedItem.widthInches : updatedItem.widthCm;
          const height = updatedItem.unit === 'inches' ? updatedItem.heightInches : updatedItem.heightCm;
          const sqFt = calculateSqFt(width, height, updatedItem.unit);
          const amount = sqFt * updatedItem.pricePerSqFt * updatedItem.quantity;

          return {
            ...updatedItem,
            sqFt: parseFloat(sqFt.toFixed(2)),
            amount: parseFloat(amount.toFixed(2))
          };
        }
        return existingItem;
      });

      setCurrentInvoice({
        ...currentInvoice,
        items: updatedItems
      });
    }
  };

  const removeInvoiceItem = (id: string) => {
    if (currentInvoice) {
      setCurrentInvoice({
        ...currentInvoice,
        items: currentInvoice.items.filter(item => item.id !== id)
      });
    }
  };

  const calculateTotals = () => {
    if (currentInvoice) {
      const totalMaterial = currentInvoice.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalSqFt = currentInvoice.items.reduce((sum, item) => sum + (item.sqFt * item.quantity), 0);
      const itemsTotal = currentInvoice.items.reduce((sum, item) => sum + item.amount, 0);
      
      const discountAmount = (itemsTotal * currentInvoice.discountPercentage) / 100;
      const subtotal = itemsTotal - discountAmount;
      
      const totalAmountBeforeTax = subtotal + currentInvoice.packingCharges + 
                                   currentInvoice.pelmetCharges + currentInvoice.courierCharges + 
                                   currentInvoice.installationCharges;
      
      const gstAmount = currentInvoice.gstEnabled ? (totalAmountBeforeTax * currentInvoice.gstPercentage) / 100 : 0;
      const grandTotal = totalAmountBeforeTax + gstAmount;

      setCurrentInvoice({
        ...currentInvoice,
        totalMaterial,
        totalSqFt: parseFloat(totalSqFt.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        totalAmountBeforeTax: parseFloat(totalAmountBeforeTax.toFixed(2)),
        gstAmount: parseFloat(gstAmount.toFixed(2)),
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        totalPayment: parseFloat(grandTotal.toFixed(2))
      });
    }
  };

  return (
    <InvoiceContext.Provider value={{
      currentInvoice,
      createNewInvoice,
      updateInvoice,
      addInvoiceItem,
      updateInvoiceItem,
      removeInvoiceItem,
      calculateTotals
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
