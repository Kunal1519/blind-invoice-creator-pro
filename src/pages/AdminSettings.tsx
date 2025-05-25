
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
      branchName: 'RANA PRATAP BAGH DELHI'
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
      branchName: 'RANA PRATAP BAGH DELHI'
    };
    setSettings(defaultSettings);
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
                <Label htmlFor="logo">Logo Text</Label>
                <Input
                  id="logo"
                  value={settings.logo}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                />
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
