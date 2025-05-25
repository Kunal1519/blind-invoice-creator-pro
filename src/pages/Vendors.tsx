
import { useState } from 'react';
import { useMasterData, Vendor } from '../contexts/MasterDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Vendors = () => {
  const { vendors, addVendor, deleteVendor } = useMasterData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    gstNo: '',
    email: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addVendor(formData);
    setFormData({ name: '', contact: '', gstNo: '', email: '', address: '' });
    toast({
      title: "Success",
      description: "Vendor added successfully"
    });
  };

  const handleDelete = (id: string) => {
    deleteVendor(id);
    toast({
      title: "Success",
      description: "Vendor deleted successfully"
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors</h1>
        <p className="text-gray-600">Manage your vendor information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Vendor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Vendor name"
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div>
                <Label htmlFor="gstNo">GST Number</Label>
                <Input
                  id="gstNo"
                  value={formData.gstNo}
                  onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                  placeholder="GST number"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                />
              </div>
              <Button type="submit" className="w-full">Add Vendor</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor List ({vendors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {vendors.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No vendors added yet</p>
              ) : (
                vendors.map((vendor) => (
                  <div key={vendor.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{vendor.name}</h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(vendor.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Contact: {vendor.contact}</p>
                    <p className="text-sm text-gray-600">Email: {vendor.email}</p>
                    {vendor.gstNo && <p className="text-sm text-gray-600">GST: {vendor.gstNo}</p>}
                    {vendor.address && <p className="text-sm text-gray-600">Address: {vendor.address}</p>}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vendors;
