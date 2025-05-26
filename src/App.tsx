
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { InvoiceProvider } from "./contexts/InvoiceContext";
import { MasterDataProvider } from "./contexts/MasterDataContext";
import { useAuth } from "./hooks/useAuth";
import { Button } from "@/components/ui/button";
import Dashboard from "./pages/Dashboard";
import Vendors from "./pages/Vendors";
import Parties from "./pages/Parties";
import Products from "./pages/Products";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import SavedInvoices from "./pages/SavedInvoices";
import AdminSettings from "./pages/AdminSettings";
import AuthPage from "./pages/AuthPage";
import AppSidebar from "./components/AppSidebar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-white">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MasterDataProvider>
        <InvoiceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </InvoiceProvider>
      </MasterDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
