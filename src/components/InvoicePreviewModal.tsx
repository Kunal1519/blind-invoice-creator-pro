
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useInvoice } from '../contexts/InvoiceContext';
import { useMasterData } from '../contexts/MasterDataContext';
import { generateInvoicePDF, shareViaWhatsApp } from '../utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InvoicePreviewModal = ({ isOpen, onClose }: InvoicePreviewModalProps) => {
  const { currentInvoice } = useInvoice();
  const { vendors, parties } = useMasterData();
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!currentInvoice) return null;

  const selectedVendor = vendors.find(v => v.id === currentInvoice.vendorId);
  const selectedParty = parties.find(p => p.id === currentInvoice.partyId);

  // Get company settings from localStorage
  const companySettings = JSON.parse(localStorage.getItem('companySettings') || '{}');

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const invoiceElement = document.querySelector('.invoice-container') as HTMLElement;
      if (invoiceElement) {
        const pdfBlob = await generateInvoicePDF(invoiceElement, {
          filename: `invoice-${currentInvoice.invoiceNumber}.pdf`
        });
        
        // Create download link
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${currentInvoice.invoiceNumber}.pdf`;
        link.click();
        
        toast({
          title: "Success",
          description: "PDF generated successfully"
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleWhatsAppShare = async () => {
    setIsGeneratingPDF(true);
    try {
      const invoiceElement = document.querySelector('.invoice-container') as HTMLElement;
      if (invoiceElement) {
        const pdfBlob = await generateInvoicePDF(invoiceElement);
        const message = `Proforma Invoice #${currentInvoice.invoiceNumber} from ${companySettings.companyName || 'Creative Interiors'}. Total Amount: ₹${currentInvoice.grandTotal.toFixed(2)}`;
        shareViaWhatsApp(pdfBlob, message);
        
        toast({
          title: "Success",
          description: "Opening WhatsApp for sharing"
        });
      }
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast({
        title: "Error",
        description: "Failed to share via WhatsApp",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2 justify-end print:hidden">
            <Button onClick={handlePrint} variant="outline">
              Print
            </Button>
            <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button onClick={handleWhatsAppShare} disabled={isGeneratingPDF} className="bg-green-600 hover:bg-green-700">
              Share via WhatsApp
            </Button>
          </div>

          {/* Invoice Content */}
          <div className="invoice-container bg-white p-6 border">
            {/* Header */}
            <div className="invoice-header text-center mb-6 border-2 border-black p-4">
              <div className="flex items-center justify-center mb-2">
                <div className="mr-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{companySettings.logo || 'SONAL'}</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-red-600">{companySettings.companyName || 'CREATIVE INTERIORS'}</h1>
              </div>
              <div className="text-sm">
                <p>ADDRESS: {companySettings.address || 'H.NO.-174, OPP. YADAV BAKERY, VILLAGE BHALSWA, JAHANGIR PURI DELHI'}</p>
                <div className="flex justify-between">
                  <span>TEL. NO. - {companySettings.phone || '+919811400093, 9811200093'}</span>
                  <span>Email Id: {companySettings.email || 'sonatablinds@gmail.com'}</span>
                </div>
              </div>
            </div>

            {/* Invoice Title */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-red-600 border-b-2 border-black inline-block px-4">
                PROFORMA INVOICE
              </h2>
            </div>

            {/* Items Table */}
            <div className="border border-black mb-4 overflow-x-auto">
              <table className="invoice-table w-full text-xs">
                <thead>
                  <tr className="bg-yellow-200">
                    <th className="col-sno border border-black p-1">S. No.</th>
                    <th className="col-description border border-black p-1">Description of Goods</th>
                    <th className="col-shade border border-black p-1">Shade Name</th>
                    <th className="col-color border border-black p-1">Shade Color</th>
                    <th className="col-operation border border-black p-1">Operation of Chain Etc</th>
                    <th className="col-qty border border-black p-1">Qty</th>
                    <th className="col-size border border-black p-1">SIZE IN INCH<br/>WIDTH(3) LENGTH</th>
                    <th className="col-sqft border border-black p-1">Sq. Ft.</th>
                    <th className="col-price border border-black p-1">Price per Sq.Ft.</th>
                    <th className="col-amount border border-black p-1">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoice.items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-black p-1 text-center">{index + 1}</td>
                      <td className="border border-black p-1">{item.productName}</td>
                      <td className="border border-black p-1">{item.shade}</td>
                      <td className="border border-black p-1">{item.shadeColor}</td>
                      <td className="border border-black p-1">{item.operationType}</td>
                      <td className="border border-black p-1 text-center">{item.quantity}</td>
                      <td className="border border-black p-1 text-center">
                        {item.unit === 'inches' 
                          ? `${item.widthInches} x ${item.heightInches}` 
                          : `${item.widthCm} x ${item.heightCm}`
                        }
                      </td>
                      <td className="border border-black p-1 text-center">{item.sqFt}</td>
                      <td className="border border-black p-1 text-center">{item.pricePerSqFt}</td>
                      <td className="border border-black p-1 text-center">{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  
                  {/* Total Material Row */}
                  <tr className="bg-blue-100">
                    <td className="border border-black p-1" colSpan={5}></td>
                    <td className="border border-black p-1 text-center font-semibold">TOTAL MATERIAL -</td>
                    <td className="border border-black p-1 text-center font-semibold">{currentInvoice.totalMaterial}</td>
                    <td className="border border-black p-1 text-center font-semibold">{currentInvoice.totalSqFt}</td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="invoice-totals grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-black">
                <div className="bg-yellow-200 p-2 border-b border-black">
                  <h3 className="font-semibold">Payment Should Be Payable To :-</h3>
                </div>
                <div className="p-2 space-y-2">
                  <div className="grid grid-cols-2">
                    <span className="font-semibold">A/C No :-</span>
                    <span>{companySettings.accountNumber || '9811200093'}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold">A/C Name :-</span>
                    <span>{companySettings.accountName || 'CREATIVE INTERIORS'}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold">Bank Name :-</span>
                    <span>{companySettings.bankName || 'KOTAK MAHINDRA BANK'}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold">Branch Name :-</span>
                    <span>{companySettings.branchName || 'RANA PRATAP BAGH DELHI'}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="bg-yellow-200 border border-black p-1 font-semibold">Grand Total -</div>
                  <div className="border border-black p-1 text-right font-bold">
                    ₹{currentInvoice.grandTotal.toFixed(2)}
                  </div>
                  <div className="bg-blue-100 border border-black p-1 font-bold">
                    Total Payment To Be Paid-
                  </div>
                  <div className="border border-black p-1 text-right font-bold">
                    ₹{currentInvoice.totalPayment.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewModal;
