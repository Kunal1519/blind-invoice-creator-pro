import { useState } from 'react';
import { useInvoice } from '../contexts/InvoiceContext';
import { useMasterData } from '../contexts/MasterDataContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import InvoicePreviewModal from './InvoicePreviewModal';
import { generateInvoicePDF, shareViaWhatsApp } from '../utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';

const InvoicePreview = () => {
  const { currentInvoice, removeInvoiceItem } = useInvoice();
  const { vendors, parties } = useMasterData();
  const { toast } = useToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!currentInvoice) return null;

  const selectedVendor = vendors.find(v => v.id === currentInvoice.vendorId);
  const selectedParty = parties.find(p => p.id === currentInvoice.partyId);

  // Get company settings from localStorage
  const companySettings = JSON.parse(localStorage.getItem('companySettings') || '{}');

  const handlePrint = () => {
    const printContent = document.querySelector('.invoice-container');
    const originalContent = document.body.innerHTML;
    
    if (printContent) {
      document.body.innerHTML = printContent.outerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
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
    <>
      <Card className="p-6 bg-white">
        <div className="invoice-container print:p-0">
          {/* Header */}
          <div className="invoice-header text-center mb-6 border-2 border-black p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="mr-4">
                {companySettings.logo && companySettings.logo.startsWith('data:') ? (
                  <img 
                    src={companySettings.logo} 
                    alt="Company Logo" 
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{companySettings.logo || 'SONAL'}</span>
                  </div>
                )}
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

          {/* Buyer Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="border border-black">
              <div className="bg-blue-100 p-2 border-b border-black">
                <h3 className="font-bold text-blue-800">BUYER'S DETAILS</h3>
              </div>
              <div className="p-2 space-y-1">
                <p className="font-semibold">{selectedParty?.name || 'MAX WALLPAPER & INTERIOR'}</p>
                <p>S. No.: 1430</p>
                <p>GST No.: {currentInvoice.gstNo}</p>
                <p>Email id.: {selectedParty?.email}</p>
                <p>Contact Person.: {selectedParty?.contactPerson}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-black p-2">
                  <span className="font-semibold">GST No.:</span>
                </div>
                <div className="border border-black p-2">
                  {currentInvoice.gstNo || companySettings.gstNo || '07AFFPJ4441N1Z9'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-black p-2">
                  <span className="font-semibold">Date:</span>
                </div>
                <div className="border border-black p-2">
                  {new Date(currentInvoice.date).toLocaleDateString('en-GB')}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-black p-2">
                  <span className="font-semibold">Dispatch via:</span>
                </div>
                <div className="border border-black p-2"></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-black p-2">
                  <span className="font-semibold">Dispatch From:</span>
                </div>
                <div className="border border-black p-2"></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-black p-2">
                  <span className="font-semibold">Other Reference:</span>
                </div>
                <div className="border border-black p-2"></div>
              </div>
            </div>
          </div>

          {/* Warning Text */}
          <div className="bg-blue-100 p-2 mb-4 text-center border border-black">
            <p className="font-semibold">PLEASE CHECK SIZE CAREFULLY AFTER YOUR APPROVAL WILL NOT BE RESPONSIBLE.</p>
            <p className="text-sm">कृपया चौड़ाई (width) और ऊंचाई (height) को सही से जांचे</p>
          </div>

          {/* Items Table - Enhanced for A4 printing */}
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
                  <th className="border border-black p-1 w-20 print:hidden">Action</th>
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
                    <td className="border border-black p-1 text-center print:hidden">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeInvoiceItem(item.id)}
                        className="text-xs h-6"
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {/* Empty rows */}
                {Array.from({ length: Math.max(0, 4 - currentInvoice.items.length) }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className="border border-black p-1 h-8"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1"></td>
                    <td className="border border-black p-1 print:hidden"></td>
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
                  <td className="border border-black p-1 print:hidden"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <div className="bg-yellow-200 border border-black p-1 font-semibold">TOTAL</div>
                <div className="border border-black p-1 text-right">
                  {currentInvoice.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </div>
                
                {currentInvoice.discountPercentage > 0 && (
                  <>
                    <div className="bg-yellow-200 border border-black p-1 font-semibold">
                      DISCOUNT {currentInvoice.discountPercentage}%
                    </div>
                    <div className="border border-black p-1 text-right">
                      {currentInvoice.discountAmount.toFixed(2)}
                    </div>
                  </>
                )}

                <div className="bg-yellow-200 border border-black p-1 font-semibold">
                  TOTAL AMOUNT - AFTER DISCOUNT
                </div>
                <div className="border border-black p-1 text-right">
                  {(currentInvoice.items.reduce((sum, item) => sum + item.amount, 0) - currentInvoice.discountAmount).toFixed(2)}
                </div>

                {(companySettings.showPelmetCharges !== false && currentInvoice.pelmetCharges > 0) && (
                  <>
                    <div className="bg-yellow-200 border border-black p-1 font-semibold">
                      PELMET CHARGE- 150/ PER. R.FT
                    </div>
                    <div className="border border-black p-1 text-right">
                      {currentInvoice.pelmetCharges.toFixed(2)}
                    </div>
                  </>
                )}

                <div className="bg-yellow-200 border border-black p-1 font-semibold">BILTY</div>
                <div className="border border-black p-1 text-right"></div>

                {(companySettings.showPackingCharges !== false && currentInvoice.packingCharges > 0) && (
                  <>
                    <div className="bg-yellow-200 border border-black p-1 font-semibold">
                      PACKING CHARGES -
                    </div>
                    <div className="border border-black p-1 text-right">
                      {currentInvoice.packingCharges.toFixed(2)}
                    </div>
                  </>
                )}

                {(companySettings.showCourierCharges !== false && currentInvoice.courierCharges > 0) && (
                  <>
                    <div className="bg-yellow-200 border border-black p-1 font-semibold">
                      COURIER CHARGE -
                    </div>
                    <div className="border border-black p-1 text-right">
                      {currentInvoice.courierCharges.toFixed(2)}
                    </div>
                  </>
                )}

                {companySettings.showLocalCartageCharges !== false && (
                  <>
                    <div className="bg-yellow-200 border border-black p-1 font-semibold">
                      LOCAL CARTAGE CHARGE -
                    </div>
                    <div className="border border-black p-1 text-right"></div>
                  </>
                )}

                {(companySettings.showInstallationCharges !== false && currentInvoice.installationCharges > 0) && (
                  <>
                    <div className="bg-yellow-200 border border-black p-1 font-semibold">
                      INSTALLATION CHARGE/200-PER BLIND
                    </div>
                    <div className="border border-black p-1 text-right">
                      {currentInvoice.installationCharges.toFixed(2)}
                    </div>
                  </>
                )}

                <div className="bg-yellow-200 border border-black p-1 font-semibold">
                  TOTAL AMOUNT BEFORE TAX
                </div>
                <div className="border border-black p-1 text-right">
                  {currentInvoice.totalAmountBeforeTax.toFixed(2)}
                </div>

                {currentInvoice.gstEnabled && (
                  <>
                    {companySettings.gstOnMotorEnabled && (
                      <>
                        <div className="bg-yellow-200 border border-black p-1 font-semibold">
                          GST {companySettings.gstOnMotorPercentage || 18}% ON MOTOR
                        </div>
                        <div className="border border-black p-1 text-right"></div>
                      </>
                    )}
                    
                    <div className="bg-yellow-200 border border-black p-1 font-semibold">GST</div>
                    <div className="border border-black p-1 text-right font-semibold">
                      {currentInvoice.gstPercentage}%
                    </div>
                  </>
                )}

                <div className="bg-yellow-200 border border-black p-1 font-semibold">
                  TOTAL TAX AMOUNT -
                </div>
                <div className="border border-black p-1 text-right">
                  {currentInvoice.gstAmount.toFixed(2)}
                </div>

                <div className="bg-yellow-200 border border-black p-1 font-semibold">
                  PREVIOUS PAYMENT :-
                </div>
                <div className="border border-black p-1 text-right"></div>

                <div className="bg-blue-100 border border-black p-1 font-bold">Grand Total -</div>
                <div className="border border-black p-1 text-right font-bold">
                  {currentInvoice.grandTotal.toFixed(2)}
                </div>

                <div className="bg-blue-100 border border-black p-1 font-bold">
                  Total Payment To Be Paid-
                </div>
                <div className="border border-black p-1 text-right font-bold">
                  {currentInvoice.totalPayment.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center gap-2 print:hidden">
          <Button onClick={() => setIsPreviewOpen(true)} variant="outline">
            Preview
          </Button>
          <Button onClick={handlePrint} variant="outline">
            Print Invoice
          </Button>
          <Button 
            onClick={handleWhatsAppShare} 
            disabled={isGeneratingPDF}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGeneratingPDF ? 'Generating...' : 'Share via WhatsApp'}
          </Button>
        </div>
      </Card>

      <InvoicePreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </>
  );
};

export default InvoicePreview;
