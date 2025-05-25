
import { useInvoice } from '../contexts/InvoiceContext';
import { useMasterData } from '../contexts/MasterDataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SavedInvoices = () => {
  const { savedInvoices, loadInvoice, deleteInvoice } = useInvoice();
  const { vendors, parties } = useMasterData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLoadInvoice = (id: string) => {
    loadInvoice(id);
    navigate('/invoice');
    toast({
      title: "Success",
      description: "Invoice loaded successfully"
    });
  };

  const handleDeleteInvoice = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
      toast({
        title: "Success",
        description: "Invoice deleted successfully"
      });
    }
  };

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor?.name || 'Unknown Vendor';
  };

  const getPartyName = (partyId: string) => {
    const party = parties.find(p => p.id === partyId);
    return party?.name || 'Unknown Party';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Invoices</h1>
        <p className="text-gray-600">Manage your saved proforma invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          {savedInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No saved invoices found</p>
              <Button 
                onClick={() => navigate('/invoice')} 
                className="mt-4"
              >
                Create New Invoice
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getVendorName(invoice.vendorId)}</TableCell>
                    <TableCell>{getPartyName(invoice.partyId)}</TableCell>
                    <TableCell>{invoice.items.length}</TableCell>
                    <TableCell>₹{invoice.grandTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'saved' ? 'default' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleLoadInvoice(invoice.id)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedInvoices;
