import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface CompanySettings {
  companyName: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  gstNo: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchName: string;
  // Charge options
  showPackingCharges: boolean;
  showPelmetCharges: boolean;
  showCourierCharges: boolean;
  showInstallationCharges: boolean;
  showLocalCartageCharges: boolean;
  // GST options
  gstOnMotorEnabled: boolean;
  gstOnMotorPercentage: number;
  gstOnItemsEnabled: boolean;
  gstOnItemsPercentage: number;
}

const AdminSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('companySettings');
    return saved ? JSON.parse(saved) : {
      companyName: 'CREATIVE INTERIORS',
      logo: 'SONAL',
      address: 'H.NO.-174, OPP. YADAV BAKERY, VILLAGE BHALSWA, JAHANGIR PURI DELHI',
      phone: '+919811400093, 9811200093',
      email: 'sonatablinds@gmail.com',
      gstNo: '07AFFPJ4441N1Z9',
      bankName: 'KOTAK MAHINDRA BANK',
      accountNumber: '9811200093',
      accountName: 'CREATIVE INTERIORS',
      branchName: 'RANA PRATAP BAGH DELHI',
      showPackingCharges: true,
      showPelmetCharges: true,
      showCourierCharges: true,
      showInstallationCharges: true,
      showLocalCartageCharges: true,
      gstOnMotorEnabled: true,
      gstOnMotorPercentage: 18,
      gstOnItemsEnabled: true,
      gstOnItemsPercentage: 18
    };
  });

  const handleSave = () => {
    localStorage.setItem('companySettings', JSON.stringify(settings));
    toast({
      title: "Success",
      description: "Settings saved successfully"
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      companyName: 'CREATIVE INTERIORS',
      logo: 'SONAL',
      address: 'H.NO.-174, OPP. YADAV BAKERY, VILLAGE BHALSWA, JAHANGIR PURI DELHI',
      phone: '+919811400093, 9811200093',
      email: 'sonatablinds@gmail.com',
      gstNo: '07AFFPJ4441N1Z9',
      bankName: 'KOTAK MAHINDRA BANK',
      accountNumber: '9811200093',
      accountName: 'CREATIVE INTERIORS',
      branchName: 'RANA PRATAP BAGH DELHI',
      showPackingCharges: true,
      showPelmetCharges: true,
      showCourierCharges: true,
      showInstallationCharges: true,
      showLocalCartageCharges: true,
      gstOnMotorEnabled: true,
      gstOnMotorPercentage: 18,
      gstOnItemsEnabled: true,
      gstOnItemsPercentage: 18
    };
    setSettings(defaultSettings);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSettings({ 
          ...settings, 
          logo: result
        });
        toast({
          title: "Success",
          description: "Logo uploaded successfully"
        });
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to upload logo",
          variant: "destructive"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setSettings({ ...settings, logo: 'SONAL' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Settings</h1>
        <p className="text-gray-600">Customize your invoice layout and company details</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="logo">Company Logo</Label>
                <div className="space-y-2">
                  <Input
                    id="logo"
                    value={typeof settings.logo === 'string' && !settings.logo.startsWith('data:') ? settings.logo : ''}
                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                    placeholder="Logo text (e.g., SONAL) or upload image below"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="flex-1"
                    />
                    {settings.logo && settings.logo.startsWith('data:') && (
                      <Button onClick={clearLogo} variant="outline" size="sm">
                        Clear
                      </Button>
                    )}
                  </div>
                  {settings.logo && settings.logo.startsWith('data:') && (
                    <div className="mt-2">
                      <img 
                        src={settings.logo} 
                        alt="Logo preview" 
                        className="w-20 h-20 object-contain border rounded p-2" 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Numbers</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gstNo">GST Number</Label>
              <Input
                id="gstNo"
                value={settings.gstNo}
                onChange={(e) => setSettings({ ...settings, gstNo: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={settings.bankName}
                  onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={settings.accountNumber}
                  onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input
                  id="accountName"
                  value={settings.accountName}
                  onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="branchName">Branch Name</Label>
                <Input
                  id="branchName"
                  value={settings.branchName}
                  onChange={(e) => setSettings({ ...settings, branchName: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>GST Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="gstOnMotor"
                    checked={settings.gstOnMotorEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, gstOnMotorEnabled: checked })}
                  />
                  <Label htmlFor="gstOnMotor">GST on Motor</Label>
                </div>
                {settings.gstOnMotorEnabled && (
                  <div>
                    <Label htmlFor="gstMotorPercent">GST Percentage for Motor</Label>
                    <Input
                      id="gstMotorPercent"
                      type="number"
                      step="0.01"
                      value={settings.gstOnMotorPercentage}
                      onChange={(e) => setSettings({ ...settings, gstOnMotorPercentage: parseFloat(e.target.value) || 18 })}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="gstOnItems"
                    checked={settings.gstOnItemsEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, gstOnItemsEnabled: checked })}
                  />
                  <Label htmlFor="gstOnItems">GST on Items</Label>
                </div>
                {settings.gstOnItemsEnabled && (
                  <div>
                    <Label htmlFor="gstItemsPercent">GST Percentage for Items</Label>
                    <Input
                      id="gstItemsPercent"
                      type="number"
                      step="0.01"
                      value={settings.gstOnItemsPercentage}
                      onChange={(e) => setSettings({ ...settings, gstOnItemsPercentage: parseFloat(e.target.value) || 18 })}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Charges Display Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showPacking"
                  checked={settings.showPackingCharges}
                  onCheckedChange={(checked) => setSettings({ ...settings, showPackingCharges: checked })}
                />
                <Label htmlFor="showPacking">Show Packing Charges</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showPelmet"
                  checked={settings.showPelmetCharges}
                  onCheckedChange={(checked) => setSettings({ ...settings, showPelmetCharges: checked })}
                />
                <Label htmlFor="showPelmet">Show Pelmet Charges</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showCourier"
                  checked={settings.showCourierCharges}
                  onCheckedChange={(checked) => setSettings({ ...settings, showCourierCharges: checked })}
                />
                <Label htmlFor="showCourier">Show Courier Charges</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showInstallation"
                  checked={settings.showInstallationCharges}
                  onCheckedChange={(checked) => setSettings({ ...settings, showInstallationCharges: checked })}
                />
                <Label htmlFor="showInstallation">Show Installation Charges</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="showLocalCartage"
                  checked={settings.showLocalCartageCharges}
                  onCheckedChange={(checked) => setSettings({ ...settings, showLocalCartageCharges: checked })}
                />
                <Label htmlFor="showLocalCartage">Show Local Cartage Charges</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Vendor Usage Clarification:</h4>
              <p className="text-sm text-gray-700">
                In a <strong>Proforma Invoice</strong> for blinds business, <strong>Vendors</strong> are typically your suppliers (fabric manufacturers, hardware suppliers, etc.). 
                However, in the invoice itself, you represent yourself as the seller to your customers (Parties/Buyers).
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                <li><strong>Parties/Buyers:</strong> Your customers who are purchasing blinds</li>
                <li><strong>Vendors:</strong> Used internally for cost calculation and inventory management</li>
                <li><strong>Products:</strong> The blinds you sell, which may be sourced from vendors</li>
              </ul>
              <p className="text-sm text-gray-700 mt-2">
                The vendor information helps you track costs and margins but doesn't appear on customer invoices.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Settings
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset to Default
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
