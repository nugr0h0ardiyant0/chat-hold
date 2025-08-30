import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "@/components/Dashboard";
import HoldManager from "@/components/HoldManager";
import CustomerJourneyManager from "@/components/CustomerJourneyManager";
import KeluhaneManager from "@/components/KeluhaneManager";
import ProductManager from "@/components/ProductManager";
import PromoManager from "@/components/PromoManager";
import PembelianManager from "@/components/PembelianManager";
import TokenUsageManager from "@/components/TokenUsageManager";
import StyleCSManager from "@/components/StyleCSManager";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <HoldManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/customer-journey" element={
              <ProtectedRoute>
                <AppLayout>
                  <CustomerJourneyManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/keluhan" element={
              <ProtectedRoute>
                <AppLayout>
                  <KeluhaneManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/produk" element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/promo" element={
              <ProtectedRoute>
                <AppLayout>
                  <PromoManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/pembelian" element={
              <ProtectedRoute>
                <AppLayout>
                  <PembelianManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/token-usage" element={
              <ProtectedRoute>
                <AppLayout>
                  <TokenUsageManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/style-cs" element={
              <ProtectedRoute>
                <AppLayout>
                  <StyleCSManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
