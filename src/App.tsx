import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MasterDataProvider } from "@/contexts/MasterDataContext";
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
import StorageReports from "./pages/StorageReports";
import PackageManagement from "./pages/PackageManagement";
import BillingManagement from "./pages/BillingManagement";
import PaymentHistory from "./pages/PaymentHistory";
import LicenseManagement from "./pages/LicenseManagement";
import Reports from "./pages/Reports";
import ExecutiveDetail from "./pages/reports/ExecutiveDetail";
import LicenseDetail from "./pages/reports/LicenseDetail";
import ServiceDetail from "./pages/reports/ServiceDetail";
import MailRelayDetail from "./pages/reports/MailRelayDetail";
import InactiveAccountsDetail from "./pages/reports/InactiveAccountsDetail";
import AdminContactsDetail from "./pages/reports/AdminContactsDetail";
import SystemSettings from "./pages/SystemSettings";
import AccountSettings from "./pages/AccountSettings";
import MasterDataManagement from "./pages/MasterDataManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MasterDataProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Layout><Reports /></Layout>} />
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
          <Route path="/storage/reports" element={<Layout><StorageReports onBack={() => window.history.back()} /></Layout>} />
          <Route path="/packages" element={<Layout><PackageManagement /></Layout>} />
          <Route path="/billing" element={<Layout><BillingManagement /></Layout>} />
          <Route path="/billing/payment-history/:organizationId?" element={<Layout><PaymentHistory onBack={() => window.history.back()} /></Layout>} />
          <Route path="/licenses" element={<Layout><LicenseManagement /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/reports/executive-detail" element={<Layout><ExecutiveDetail /></Layout>} />
          <Route path="/reports/license-detail" element={<Layout><LicenseDetail /></Layout>} />
          <Route path="/reports/service-detail" element={<Layout><ServiceDetail /></Layout>} />
          <Route path="/reports/mail-relay-detail" element={<Layout><MailRelayDetail /></Layout>} />
          <Route path="/reports/inactive-detail" element={<Layout><InactiveAccountsDetail /></Layout>} />
          <Route path="/reports/contacts-detail" element={<Layout><AdminContactsDetail /></Layout>} />
          <Route path="/master-data" element={<Layout><MasterDataManagement /></Layout>} />
          <Route path="/system-settings" element={<Layout><SystemSettings /></Layout>} />
          <Route path="/account-settings" element={<Layout><AccountSettings /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ThemeProvider>
    </MasterDataProvider>
  </QueryClientProvider>
);

export default App;
