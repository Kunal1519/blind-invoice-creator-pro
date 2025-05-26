
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { InvoiceProvider } from "./contexts/InvoiceContext";
import { MasterDataProvider } from "./contexts/MasterDataContext";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Parties from "./pages/Parties";
import Products from "./pages/Products";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import SavedInvoices from "./pages/SavedInvoices";
import AdminSettings from "./pages/AdminSettings";
import AppSidebar from "./components/AppSidebar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MasterDataProvider>
        <InvoiceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gray-50">
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white">
                    <SidebarTrigger className="-ml-1" />
                    <div className="ml-auto"></div>
                  </header>
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/vendors" element={<Vendors />} />
                      <Route path="/parties" element={<Parties />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/invoice" element={<InvoiceGenerator />} />
                      <Route path="/saved-invoices" element={<SavedInvoices />} />
                      <Route path="/admin" element={<AdminSettings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </InvoiceProvider>
      </MasterDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
