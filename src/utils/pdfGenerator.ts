
import html2pdf from 'html2pdf.js';

export interface PDFOptions {
  filename?: string;
  quality?: number;
}

export const generateInvoicePDF = async (
  invoiceElement: HTMLElement,
  options: PDFOptions = {}
): Promise<Blob> => {
  const { filename = 'invoice.pdf', quality = 1.0 } = options;

  const opt = {
    margin: [0.3, 0.3, 0.3, 0.3],
    filename,
    image: { type: 'jpeg', quality },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      height: window.innerHeight,
      width: window.innerWidth
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  return html2pdf().set(opt).from(invoiceElement).toPdf().output('blob');
};

export const shareViaWhatsApp = (pdfBlob: Blob, message: string = '') => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // For mobile devices, we'll create a downloadable link and provide WhatsApp text
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice.pdf';
    link.click();
    
    // Open WhatsApp with message
    const whatsappMessage = encodeURIComponent(
      message || 'Please find the attached proforma invoice. Thank you for your business!'
    );
    window.open(`whatsapp://send?text=${whatsappMessage}`, '_blank');
  } else {
    // For desktop, open WhatsApp Web
    const whatsappMessage = encodeURIComponent(
      message || 'Proforma invoice has been generated. Please find the attachment.'
    );
    window.open(`https://web.whatsapp.com/send?text=${whatsappMessage}`, '_blank');
    
    // Also download the PDF
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice.pdf';
    link.click();
  }
};
