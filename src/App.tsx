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
import RoleManagement from "./pages/RoleManagement";
import QuotaManagement from "./pages/QuotaManagement";
import MailService from "./pages/MailService";
import MailRelay from "./pages/MailRelay";
import AddressBook from "./pages/AddressBook";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import Meeting from "./pages/Meeting";
import Storage from "./pages/Storage";
import PackageManagement from "./pages/PackageManagement";
import BillingManagement from "./pages/BillingManagement";
import LicenseManagement from "./pages/LicenseManagement";
import Reports from "./pages/Reports";
import SystemSettings from "./pages/SystemSettings";
import AccountSettings from "./pages/AccountSettings";
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
          <Route path="/roles" element={<Layout><RoleManagement /></Layout>} />
          <Route path="/quotas" element={<Layout><QuotaManagement /></Layout>} />
          <Route path="/mail-service" element={<Layout><MailService /></Layout>} />
          <Route path="/mail-relay" element={<Layout><MailRelay /></Layout>} />
          <Route path="/address-book" element={<Layout><AddressBook /></Layout>} />
          <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
          <Route path="/chat" element={<Layout><Chat /></Layout>} />
          <Route path="/meetings" element={<Layout><Meeting /></Layout>} />
          <Route path="/storage" element={<Layout><Storage /></Layout>} />
          <Route path="/packages" element={<Layout><PackageManagement /></Layout>} />
          <Route path="/billing" element={<Layout><BillingManagement /></Layout>} />
          <Route path="/licenses" element={<Layout><LicenseManagement /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/system-settings" element={<Layout><SystemSettings /></Layout>} />
          <Route path="/account-settings" element={<Layout><AccountSettings /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
