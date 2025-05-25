
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from "./contexts/InvoiceContext";
import { MasterDataProvider } from "./contexts/MasterDataContext";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Parties from "./pages/Parties";
import Products from "./pages/Products";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import Navigation from "./components/Navigation";
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
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/parties" element={<Parties />} />
                <Route path="/products" element={<Products />} />
                <Route path="/invoice" element={<InvoiceGenerator />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </InvoiceProvider>
      </MasterDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
