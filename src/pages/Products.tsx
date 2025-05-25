
import { useState } from 'react';
import { useMasterData } from '../contexts/MasterDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Products = () => {
  const { products, addProduct, deleteProduct } = useMasterData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    shade: '',
    shadeColor: '',
    pricePerSqFt: 0,
    operationType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.shade || formData.pricePerSqFt <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addProduct(formData);
    setFormData({ name: '', shade: '', shadeColor: '', pricePerSqFt: 0, operationType: '' });
    toast({
      title: "Success",
      description: "Product added successfully"
    });
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast({
      title: "Success",
      description: "Product deleted successfully"
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">Manage your window blinds catalog</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., VERTICAL BLINDS"
                />
              </div>
              <div>
                <Label htmlFor="shade">Shade *</Label>
                <Input
                  id="shade"
                  value={formData.shade}
                  onChange={(e) => setFormData({ ...formData, shade: e.target.value })}
                  placeholder="e.g., NR-220/221"
                />
              </div>
              <div>
                <Label htmlFor="shadeColor">Shade Color</Label>
                <Input
                  id="shadeColor"
                  value={formData.shadeColor}
                  onChange={(e) => setFormData({ ...formData, shadeColor: e.target.value })}
                  placeholder="Color description"
                />
              </div>
              <div>
                <Label htmlFor="pricePerSqFt">Price per Sq.Ft *</Label>
                <Input
                  id="pricePerSqFt"
                  type="number"
                  step="0.01"
                  value={formData.pricePerSqFt}
                  onChange={(e) => setFormData({ ...formData, pricePerSqFt: parseFloat(e.target.value) || 0 })}
                  placeholder="Price per square feet"
                />
              </div>
              <div>
                <Label htmlFor="operationType">Operation Type</Label>
                <Input
                  id="operationType"
                  value={formData.operationType}
                  onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                  placeholder="e.g., Chain Operation"
                />
              </div>
              <Button type="submit" className="w-full">Add Product</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product List ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products added yet</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{product.name}</h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Shade: {product.shade}</p>
                    {product.shadeColor && <p className="text-sm text-gray-600">Color: {product.shadeColor}</p>}
                    <p className="text-sm text-gray-600">Price: ₹{product.pricePerSqFt}/sq.ft</p>
                    {product.operationType && <p className="text-sm text-gray-600">Operation: {product.operationType}</p>}
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

export default Products;
