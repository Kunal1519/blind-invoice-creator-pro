
import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

interface MasterDataContextType {
  vendors: Vendor[];
  parties: Party[];
  products: Product[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  addParty: (party: Omit<Party, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  updateParty: (id: string, party: Partial<Party>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteVendor: (id: string) => void;
  deleteParty: (id: string) => void;
  deleteProduct: (id: string) => void;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVendors = localStorage.getItem('vendors');
    const savedParties = localStorage.getItem('parties');
    const savedProducts = localStorage.getItem('products');

    if (savedVendors) setVendors(JSON.parse(savedVendors));
    if (savedParties) setParties(JSON.parse(savedParties));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('parties', JSON.stringify(parties));
  }, [parties]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor = { ...vendor, id: Date.now().toString() };
    setVendors(prev => [...prev, newVendor]);
  };

  const addParty = (party: Omit<Party, 'id'>) => {
    const newParty = { ...party, id: Date.now().toString() };
    setParties(prev => [...prev, newParty]);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateVendor = (id: string, vendor: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...vendor } : v));
  };

  const updateParty = (id: string, party: Partial<Party>) => {
    setParties(prev => prev.map(p => p.id === id ? { ...p, ...party } : p));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteVendor = (id: string) => {
    setVendors(prev => prev.filter(v => v.id !== id));
  };

  const deleteParty = (id: string) => {
    setParties(prev => prev.filter(p => p.id !== id));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <MasterDataContext.Provider value={{
      vendors,
      parties,
      products,
      addVendor,
      addParty,
      addProduct,
      updateVendor,
      updateParty,
      updateProduct,
      deleteVendor,
      deleteParty,
      deleteProduct
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
