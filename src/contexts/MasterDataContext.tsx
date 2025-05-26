
import React, { createContext, useContext } from 'react';
import { useSupabaseMasterData, SupabaseVendor, SupabaseParty, SupabaseProduct } from '../hooks/useSupabaseMasterData';

// Create interfaces that match the original format for backward compatibility
export interface Vendor {
  id: string;
  name: string;
  contact: string;
  gstNo: string;
  email: string;
  address: string;
}

export interface Party {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  gstNo: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  shade: string;
  shadeColor: string;
  pricePerSqFt: number;
  operationType: string;
  isMotorItem?: boolean;
}

interface MasterDataContextType {
  vendors: Vendor[];
  parties: Party[];
  products: Product[];
  loading: boolean;
  addVendor: (vendor: Omit<Vendor, 'id'>) => Promise<void>;
  addParty: (party: Omit<Party, 'id'>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateVendor: (id: string, vendor: Partial<Vendor>) => Promise<void>;
  updateParty: (id: string, party: Partial<Party>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  deleteParty: (id: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

// Helper functions to convert between formats
const convertSupabaseVendor = (vendor: SupabaseVendor): Vendor => ({
  id: vendor.id,
  name: vendor.name,
  contact: vendor.contact || '',
  gstNo: vendor.gst_no || '',
  email: vendor.email || '',
  address: vendor.address || ''
});

const convertToSupabaseVendor = (vendor: Omit<Vendor, 'id'>): Omit<SupabaseVendor, 'id'> => ({
  name: vendor.name,
  contact: vendor.contact || null,
  gst_no: vendor.gstNo || null,
  email: vendor.email || null,
  address: vendor.address || null
});

const convertSupabaseParty = (party: SupabaseParty): Party => ({
  id: party.id,
  name: party.name,
  email: party.email || '',
  contactPerson: party.contact_person || '',
  gstNo: party.gst_no || '',
  address: party.address || ''
});

const convertToSupabaseParty = (party: Omit<Party, 'id'>): Omit<SupabaseParty, 'id'> => ({
  name: party.name,
  email: party.email || null,
  contact_person: party.contactPerson || null,
  gst_no: party.gstNo || null,
  address: party.address || null
});

const convertSupabaseProduct = (product: SupabaseProduct): Product => ({
  id: product.id,
  name: product.name,
  shade: product.shade || '',
  shadeColor: product.shade_color || '',
  pricePerSqFt: product.price_per_sq_ft || 0,
  operationType: product.operation_type || '',
  isMotorItem: product.is_motor_item || false
});

const convertToSupabaseProduct = (product: Omit<Product, 'id'>): Omit<SupabaseProduct, 'id'> => ({
  name: product.name,
  shade: product.shade || null,
  shade_color: product.shadeColor || null,
  price_per_sq_ft: product.pricePerSqFt || null,
  operation_type: product.operationType || null,
  category: 'general',
  is_motor_item: product.isMotorItem || false
});

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseHook = useSupabaseMasterData();

  // Convert Supabase data to legacy format
  const vendors = supabaseHook.vendors.map(convertSupabaseVendor);
  const parties = supabaseHook.parties.map(convertSupabaseParty);
  const products = supabaseHook.products.map(convertSupabaseProduct);

  const addVendor = async (vendor: Omit<Vendor, 'id'>) => {
    await supabaseHook.addVendor(convertToSupabaseVendor(vendor));
  };

  const addParty = async (party: Omit<Party, 'id'>) => {
    await supabaseHook.addParty(convertToSupabaseParty(party));
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await supabaseHook.addProduct(convertToSupabaseProduct(product));
  };

  const updateVendor = async (id: string, vendor: Partial<Vendor>) => {
    const supabaseUpdate: Partial<SupabaseVendor> = {};
    if (vendor.name !== undefined) supabaseUpdate.name = vendor.name;
    if (vendor.contact !== undefined) supabaseUpdate.contact = vendor.contact || null;
    if (vendor.gstNo !== undefined) supabaseUpdate.gst_no = vendor.gstNo || null;
    if (vendor.email !== undefined) supabaseUpdate.email = vendor.email || null;
    if (vendor.address !== undefined) supabaseUpdate.address = vendor.address || null;
    
    await supabaseHook.updateVendor(id, supabaseUpdate);
  };

  const updateParty = async (id: string, party: Partial<Party>) => {
    const supabaseUpdate: Partial<SupabaseParty> = {};
    if (party.name !== undefined) supabaseUpdate.name = party.name;
    if (party.email !== undefined) supabaseUpdate.email = party.email || null;
    if (party.contactPerson !== undefined) supabaseUpdate.contact_person = party.contactPerson || null;
    if (party.gstNo !== undefined) supabaseUpdate.gst_no = party.gstNo || null;
    if (party.address !== undefined) supabaseUpdate.address = party.address || null;
    
    await supabaseHook.updateParty(id, supabaseUpdate);
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    const supabaseUpdate: Partial<SupabaseProduct> = {};
    if (product.name !== undefined) supabaseUpdate.name = product.name;
    if (product.shade !== undefined) supabaseUpdate.shade = product.shade || null;
    if (product.shadeColor !== undefined) supabaseUpdate.shade_color = product.shadeColor || null;
    if (product.pricePerSqFt !== undefined) supabaseUpdate.price_per_sq_ft = product.pricePerSqFt || null;
    if (product.operationType !== undefined) supabaseUpdate.operation_type = product.operationType || null;
    if (product.isMotorItem !== undefined) supabaseUpdate.is_motor_item = product.isMotorItem || false;
    
    await supabaseHook.updateProduct(id, supabaseUpdate);
  };

  const deleteVendor = async (id: string) => {
    await supabaseHook.deleteVendor(id);
  };

  const deleteParty = async (id: string) => {
    await supabaseHook.deleteParty(id);
  };

  const deleteProduct = async (id: string) => {
    await supabaseHook.deleteProduct(id);
  };

  const refreshData = async () => {
    await supabaseHook.fetchMasterData();
  };

  return (
    <MasterDataContext.Provider value={{
      vendors,
      parties,
      products,
      loading: supabaseHook.loading,
      addVendor,
      addParty,
      addProduct,
      updateVendor,
      updateParty,
      updateProduct,
      deleteVendor,
      deleteParty,
      deleteProduct,
      refreshData
    }}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};
