
import { useState, useEffect } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';
import { useMasterData } from '../contexts/MasterDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const InvoiceForm = () => {
  const { currentInvoice, updateInvoice, addInvoiceItem, calculateTotals, saveInvoice, createNewInvoice } = useInvoice();
  const { vendors, parties, products } = useMasterData();
  const { toast } = useToast();

  // Get company settings
  const [companySettings, setCompanySettings] = useState(() => {
    const saved = localStorage.getItem('companySettings');
    return saved ? JSON.parse(saved) : {};
  });

  const [itemForm, setItemForm] = useState({
    productId: '',
    quantity: 1,
    widthInches: 0,
    heightInches: 0,
    widthCm: 0,
    heightCm: 0,
    unit: 'inches' as 'inches' | 'cm'
  });

  const [pelmetGstEnabled, setPelmetGstEnabled] = useState(false);

  useEffect(() => {
    calculateTotals();
  }, [currentInvoice?.items, currentInvoice?.discountPercentage, currentInvoice?.packingCharges, 
      currentInvoice?.pelmetCharges, currentInvoice?.courierCharges, currentInvoice?.installationCharges,
      currentInvoice?.gstEnabled, currentInvoice?.gstPercentage, calculateTotals]);

  const handleAddItem = () => {
    const selectedProduct = products.find(p => p.id === itemForm.productId);
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive"
      });
      return;
    }

    const width = itemForm.unit === 'inches' ? itemForm.widthInches : itemForm.widthCm;
    const height = itemForm.unit === 'inches' ? itemForm.heightInches : itemForm.heightCm;

    if (width <= 0 || height <= 0 || itemForm.quantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid dimensions and quantity",
        variant: "destructive"
      });
      return;
    }

    addInvoiceItem({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      shade: selectedProduct.shade,
      shadeColor: selectedProduct.shadeColor,
      operationType: selectedProduct.operationType,
      quantity: itemForm.quantity,
      widthInches: itemForm.widthInches,
      heightInches: itemForm.heightInches,
      widthCm: itemForm.widthCm,
      heightCm: itemForm.heightCm,
      unit: itemForm.unit,
      pricePerSqFt: selectedProduct.pricePerSqFt
    });

    setItemForm({
      productId: '',
      quantity: 1,
      widthInches: 0,
      heightInches: 0,
      widthCm: 0,
      heightCm: 0,
      unit: 'inches'
    });

    toast({
      title: "Success",
      description: "Item added to invoice"
    });
  };

  const handleSaveInvoice = () => {
    if (!currentInvoice?.vendorId || !currentInvoice?.partyId) {
      toast({
        title: "Error",
        description: "Please select vendor and party before saving",
        variant: "destructive"
      });
      return;
    }

    if (currentInvoice.items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item before saving",
        variant: "destructive"
      });
      return;
    }

    saveInvoice();
    toast({
      title: "Success",
      description: "Invoice saved successfully"
    });
  };

  const handleNewInvoice = () => {
    createNewInvoice();
    toast({
      title: "Success",
      description: "New invoice created"
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons - Only New Invoice */}
      <div className="flex gap-2 mb-4">
        <Button onClick={handleNewInvoice} variant="outline">
          New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={currentInvoice?.invoiceNumber || ''}
                onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={currentInvoice?.date || ''}
                onChange={(e) => updateInvoice({ date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Select
              value={currentInvoice?.vendorId || ''}
              onValueChange={(value) => updateInvoice({ vendorId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="party">Party</Label>
            <Select
              value={currentInvoice?.partyId || ''}
              onValueChange={(value) => {
                const selectedParty = parties.find(p => p.id === value);
                updateInvoice({ 
                  partyId: value,
                  gstNo: selectedParty?.gstNo || ''
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select party" />
              </SelectTrigger>
              <SelectContent>
                {parties.map((party) => (
                  <SelectItem key={party.id} value={party.id}>
                    {party.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="product">Product</Label>
            <Select
              value={itemForm.productId}
              onValueChange={(value) => setItemForm({ ...itemForm, productId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.shade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={itemForm.unit}
                onValueChange={(value: 'inches' | 'cm') => setItemForm({ ...itemForm, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inches">Inches</SelectItem>
                  <SelectItem value="cm">Centimeters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={itemForm.unit === 'inches' ? itemForm.widthInches : itemForm.widthCm}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (itemForm.unit === 'inches') {
                    setItemForm({ ...itemForm, widthInches: value });
                  } else {
                    setItemForm({ ...itemForm, widthCm: value });
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={itemForm.unit === 'inches' ? itemForm.heightInches : itemForm.heightCm}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (itemForm.unit === 'inches') {
                    setItemForm({ ...itemForm, heightInches: value });
                  } else {
                    setItemForm({ ...itemForm, heightCm: value });
                  }
                }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={itemForm.quantity}
              onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) || 1 })}
            />
          </div>

          <Button onClick={handleAddItem} className="w-full">Add Item</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Charges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              step="0.01"
              value={currentInvoice?.discountPercentage || 0}
              onChange={(e) => updateInvoice({ discountPercentage: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {companySettings.showPackingCharges !== false && (
              <div>
                <Label htmlFor="packing">Packing Charges</Label>
                <Input
                  id="packing"
                  type="number"
                  step="0.01"
                  value={currentInvoice?.packingCharges || 0}
                  onChange={(e) => updateInvoice({ packingCharges: parseFloat(e.target.value) || 0 })}
                />
              </div>
            )}
            
            {companySettings.showPelmetCharges !== false && (
              <div>
                <Label htmlFor="pelmet">Pelmet Charges</Label>
                <Input
                  id="pelmet"
                  type="number"
                  step="0.01"
                  value={currentInvoice?.pelmetCharges || 0}
                  onChange={(e) => updateInvoice({ pelmetCharges: parseFloat(e.target.value) || 0 })}
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="pelmetGst"
                    checked={pelmetGstEnabled}
                    onCheckedChange={(checked) => setPelmetGstEnabled(checked === true)}
                  />
                  <Label htmlFor="pelmetGst" className="text-sm">Apply GST on Pelmet</Label>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {companySettings.showCourierCharges !== false && (
              <div>
                <Label htmlFor="courier">Courier Charges</Label>
                <Input
                  id="courier"
                  type="number"
                  step="0.01"
                  value={currentInvoice?.courierCharges || 0}
                  onChange={(e) => updateInvoice({ courierCharges: parseFloat(e.target.value) || 0 })}
                />
              </div>
            )}
            
            {companySettings.showInstallationCharges !== false && (
              <div>
                <Label htmlFor="installation">Installation Charges</Label>
                <Input
                  id="installation"
                  type="number"
                  step="0.01"
                  value={currentInvoice?.installationCharges || 0}
                  onChange={(e) => updateInvoice({ installationCharges: parseFloat(e.target.value) || 0 })}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="gst"
              checked={currentInvoice?.gstEnabled || false}
              onCheckedChange={(checked) => updateInvoice({ gstEnabled: checked })}
            />
            <Label htmlFor="gst">Enable GST</Label>
          </div>

          {currentInvoice?.gstEnabled && (
            <div>
              <Label htmlFor="gstPercent">GST Percentage</Label>
              <Input
                id="gstPercent"
                type="number"
                step="0.01"
                value={currentInvoice?.gstPercentage || 18}
                onChange={(e) => updateInvoice({ gstPercentage: parseFloat(e.target.value) || 18 })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button moved to bottom */}
      <div className="flex justify-center">
        <Button onClick={handleSaveInvoice} className="bg-green-600 hover:bg-green-700 px-8">
          Save Invoice
        </Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
