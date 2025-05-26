
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseVendor {
  id: string;
  name: string;
  contact: string | null;
  email: string | null;
  gst_no: string | null;
  address: string | null;
}

export interface SupabaseParty {
  id: string;
  name: string;
  email: string | null;
  contact_person: string | null;
  gst_no: string | null;
  address: string | null;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  shade: string | null;
  shade_color: string | null;
  price_per_sq_ft: number | null;
  operation_type: string | null;
  category: string | null;
  is_motor_item: boolean | null;
}

export const useSupabaseMasterData = () => {
  const [vendors, setVendors] = useState<SupabaseVendor[]>([]);
  const [parties, setParties] = useState<SupabaseParty[]>([]);
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all master data
  const fetchMasterData = async () => {
    try {
      setLoading(true);
      
      const [vendorsResult, partiesResult, productsResult] = await Promise.all([
        supabase.from('vendors').select('*').order('name'),
        supabase.from('parties').select('*').order('name'),
        supabase.from('products').select('*').order('name')
      ]);

      if (vendorsResult.error) throw vendorsResult.error;
      if (partiesResult.error) throw partiesResult.error;
      if (productsResult.error) throw productsResult.error;

      setVendors(vendorsResult.data || []);
      setParties(partiesResult.data || []);
      setProducts(productsResult.data || []);
    } catch (error) {
      console.error('Error fetching master data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch master data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Vendor CRUD operations
  const addVendor = async (vendor: Omit<SupabaseVendor, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendor])
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => [...prev, data]);
      toast({ title: "Success", description: "Vendor added successfully" });
      return data;
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        title: "Error",
        description: "Failed to add vendor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateVendor = async (id: string, vendor: Partial<SupabaseVendor>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(vendor)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVendors(prev => prev.map(v => v.id === id ? data : v));
      toast({ title: "Success", description: "Vendor updated successfully" });
      return data;
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVendors(prev => prev.filter(v => v.id !== id));
      toast({ title: "Success", description: "Vendor deleted successfully" });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Party CRUD operations
  const addParty = async (party: Omit<SupabaseParty, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('parties')
        .insert([party])
        .select()
        .single();

      if (error) throw error;

      setParties(prev => [...prev, data]);
      toast({ title: "Success", description: "Party added successfully" });
      return data;
    } catch (error) {
      console.error('Error adding party:', error);
      toast({
        title: "Error",
        description: "Failed to add party",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateParty = async (id: string, party: Partial<SupabaseParty>) => {
    try {
      const { data, error } = await supabase
        .from('parties')
        .update(party)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setParties(prev => prev.map(p => p.id === id ? data : p));
      toast({ title: "Success", description: "Party updated successfully" });
      return data;
    } catch (error) {
      console.error('Error updating party:', error);
      toast({
        title: "Error",
        description: "Failed to update party",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteParty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('parties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setParties(prev => prev.filter(p => p.id !== id));
      toast({ title: "Success", description: "Party deleted successfully" });
    } catch (error) {
      console.error('Error deleting party:', error);
      toast({
        title: "Error",
        description: "Failed to delete party",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Product CRUD operations
  const addProduct = async (product: Omit<SupabaseProduct, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [...prev, data]);
      toast({ title: "Success", description: "Product added successfully" });
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<SupabaseProduct>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === id ? data : p));
      toast({ title: "Success", description: "Product updated successfully" });
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: "Success", description: "Product deleted successfully" });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  return {
    vendors,
    parties,
    products,
    loading,
    fetchMasterData,
    addVendor,
    updateVendor,
    deleteVendor,
    addParty,
    updateParty,
    deleteParty,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
