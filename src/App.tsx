import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import OrganizationManagement from "./pages/OrganizationManagement";
import OrganizationUnits from "./pages/OrganizationUnits";
import DomainManagement from "./pages/DomainManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/users" element={<Layout><UserManagement /></Layout>} />
          <Route path="/organizations" element={<Layout><OrganizationManagement /></Layout>} />
          <Route path="/organization-units" element={<Layout><OrganizationUnits /></Layout>} />
          <Route path="/domains" element={<Layout><DomainManagement /></Layout>} />
          <Route path="/roles" element={<Layout><Index /></Layout>} />
          <Route path="/quotas" element={<Layout><Index /></Layout>} />
          <Route path="/mail-service" element={<Layout><Index /></Layout>} />
          <Route path="/mail-relay" element={<Layout><Index /></Layout>} />
          <Route path="/address-book" element={<Layout><Index /></Layout>} />
          <Route path="/calendar" element={<Layout><Index /></Layout>} />
          <Route path="/chat" element={<Layout><Index /></Layout>} />
          <Route path="/meetings" element={<Layout><Index /></Layout>} />
          <Route path="/storage" element={<Layout><Index /></Layout>} />
          <Route path="/packages" element={<Layout><Index /></Layout>} />
          <Route path="/billing" element={<Layout><Index /></Layout>} />
          <Route path="/licenses" element={<Layout><Index /></Layout>} />
          <Route path="/reports" element={<Layout><Index /></Layout>} />
          <Route path="/system-settings" element={<Layout><Index /></Layout>} />
          <Route path="/account-settings" element={<Layout><Index /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
