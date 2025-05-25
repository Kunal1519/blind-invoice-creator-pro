
import { useState } from 'react';
import { useMasterData } from '../contexts/MasterDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Parties = () => {
  const { parties, addParty, deleteParty } = useMasterData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPerson: '',
    gstNo: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.contactPerson) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addParty(formData);
    setFormData({ name: '', email: '', contactPerson: '', gstNo: '', address: '' });
    toast({
      title: "Success",
      description: "Party added successfully"
    });
  };

  const handleDelete = (id: string) => {
    deleteParty(id);
    toast({
      title: "Success",
      description: "Party deleted successfully"
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Parties</h1>
        <p className="text-gray-600">Manage your customer information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Party</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Contact person name"
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
              <Button type="submit" className="w-full">Add Party</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Party List ({parties.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {parties.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No parties added yet</p>
              ) : (
                parties.map((party) => (
                  <div key={party.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{party.name}</h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(party.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Contact: {party.contactPerson}</p>
                    <p className="text-sm text-gray-600">Email: {party.email}</p>
                    {party.gstNo && <p className="text-sm text-gray-600">GST: {party.gstNo}</p>}
                    {party.address && <p className="text-sm text-gray-600">Address: {party.address}</p>}
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

export default Parties;
