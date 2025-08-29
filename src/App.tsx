import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { MasterDataProvider } from "./contexts/MasterDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { LoadingSpinner } from "./components/ui/loading-spinner";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const UserRoleAssignment = lazy(() => import("./pages/UserRoleAssignment"));
const GroupManagement = lazy(() => import("./pages/GroupManagement"));
const OrganizationManagement = lazy(() => import("./pages/OrganizationManagement"));
const OrganizationUnits = lazy(() => import("./pages/OrganizationUnits"));
const TenantManagement = lazy(() => import("./pages/TenantManagement"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"));
const DomainManagement = lazy(() => import("./pages/DomainManagement"));
const LicenseManagement = lazy(() => import("./pages/LicenseManagement"));
const BillingManagement = lazy(() => import("./pages/BillingManagement"));
const SystemSettings = lazy(() => import("./pages/SystemSettings"));
const Reports = lazy(() => import("./pages/Reports"));
const MailService = lazy(() => import("./pages/MailService"));
const MailRelay = lazy(() => import("./pages/MailRelay"));
const AddressBook = lazy(() => import("./pages/AddressBook"));
const Chat = lazy(() => import("./pages/Chat"));
const Meeting = lazy(() => import("./pages/Meeting"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Storage = lazy(() => import("./pages/Storage"));
const QuotaManagement = lazy(() => import("./pages/QuotaManagement"));
const PackageManagement = lazy(() => import("./pages/PackageManagement"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));
const StorageReports = lazy(() => import("./pages/StorageReports"));
const MasterDataManagement = lazy(() => import("./pages/MasterDataManagement"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Report detail pages
const ExecutiveDetail = lazy(() => import("./pages/reports/ExecutiveDetail"));
const LicenseDetail = lazy(() => import("./pages/reports/LicenseDetail"));
const ServiceDetail = lazy(() => import("./pages/reports/ServiceDetail"));
const MailRelayDetail = lazy(() => import("./pages/reports/MailRelayDetail"));
const InactiveAccountsDetail = lazy(() => import("./pages/reports/InactiveAccountsDetail"));
const AdminContactsDetail = lazy(() => import("./pages/reports/AdminContactsDetail"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <MasterDataProvider>
            <TooltipProvider>
              <Routes>
                  <Route path="/" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Index />
                    </Suspense>
                  } />
                  <Route path="/auth" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Auth />
                    </Suspense>
                  } />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <Layout>
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback />}>
                          <Reports />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/users" element={
                    <Layout>
                      <ProtectedRoute requiredModule="users">
                        <Suspense fallback={<LoadingFallback />}>
                          <UserManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/user-roles" element={
                    <Layout>
                      <ProtectedRoute requiredModule="roles">
                        <Suspense fallback={<LoadingFallback />}>
                          <UserRoleAssignment />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/groups" element={
                    <Layout>
                      <ProtectedRoute requiredModule="users">
                        <Suspense fallback={<LoadingFallback />}>
                          <GroupManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/organizations" element={
                    <Layout>
                      <ProtectedRoute requiredModule="organizations">
                        <Suspense fallback={<LoadingFallback />}>
                          <OrganizationManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/organization-units" element={
                    <Layout>
                      <ProtectedRoute requiredModule="organizations">
                        <Suspense fallback={<LoadingFallback />}>
                          <OrganizationUnits />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/tenants" element={
                    <Layout>
                      <ProtectedRoute requiredModule="system">
                        <Suspense fallback={<LoadingFallback />}>
                          <TenantManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/roles" element={
                    <Layout>
                      <ProtectedRoute requiredModule="roles">
                        <Suspense fallback={<LoadingFallback />}>
                          <RoleManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/domains" element={
                    <Layout>
                      <ProtectedRoute requiredModule="domains">
                        <Suspense fallback={<LoadingFallback />}>
                          <DomainManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/quotas" element={
                    <Layout>
                      <ProtectedRoute requiredModule="storage">
                        <Suspense fallback={<LoadingFallback />}>
                          <QuotaManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/licenses" element={
                    <Layout>
                      <ProtectedRoute requiredModule="system">
                        <Suspense fallback={<LoadingFallback />}>
                          <LicenseManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/billing" element={
                    <Layout>
                      <ProtectedRoute requiredModule="billing">
                        <Suspense fallback={<LoadingFallback />}>
                          <BillingManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/billing/payment-history/:organizationId?" element={
                    <Layout>
                      <ProtectedRoute requiredModule="billing">
                        <Suspense fallback={<LoadingFallback />}>
                          <PaymentHistory onBack={() => window.history.back()} />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/packages" element={
                    <Layout>
                      <ProtectedRoute requiredModule="billing">
                        <Suspense fallback={<LoadingFallback />}>
                          <PackageManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/system-settings" element={
                    <Layout>
                      <ProtectedRoute requiredModule="system">
                        <Suspense fallback={<LoadingFallback />}>
                          <SystemSettings />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/reports" element={
                    <Layout>
                      <ProtectedRoute requiredModule="reports">
                        <Suspense fallback={<LoadingFallback />}>
                          <Reports />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/reports/executive-detail" element={
                    <Layout>
                      <ProtectedRoute requiredModule="reports">
                        <Suspense fallback={<LoadingFallback />}>
                          <ExecutiveDetail />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/reports/license-detail" element={
                    <Layout>
                      <ProtectedRoute requiredModule="reports">
                        <Suspense fallback={<LoadingFallback />}>
                          <LicenseDetail />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/reports/service-detail" element={
                    <Layout>
                      <ProtectedRoute requiredModule="reports">
                        <Suspense fallback={<LoadingFallback />}>
                          <ServiceDetail />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/reports/mail-relay-detail" element={
                    <Layout>
                      <ProtectedRoute requiredModule="reports">
                        <Suspense fallback={<LoadingFallback />}>
                          <MailRelayDetail />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/reports/inactive-detail" element={
                    <Layout>
                      <ProtectedRoute requiredModule="reports">
                        <Suspense fallback={<LoadingFallback />}>
                          <InactiveAccountsDetail />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/reports/contacts-detail" element={
                    <Layout>
                      <ProtectedRoute requiredModule="reports">
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminContactsDetail />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  /*  
                  <Route path="/mail-service" element={
                    <Layout>
                      <ProtectedRoute requiredModule="domains">
                        <Suspense fallback={<LoadingFallback />}>
                          <MailService />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/mail-relay" element={
                    <Layout>
                      <ProtectedRoute requiredModule="domains">
                        <Suspense fallback={<LoadingFallback />}>
                          <MailRelay />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/address-book" element={
                    <Layout>
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback />}>
                          <AddressBook />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/chat" element={
                    <Layout>
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback />}>
                          <Chat />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/meetings" element={
                    <Layout>
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback />}>
                          <Meeting />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                
                  <Route path="/calendar" element={
                    <Layout>
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback />}>
                          <Calendar />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  */
                  <Route path="/storage" element={
                    <Layout>
                      <ProtectedRoute requiredModule="storage">
                        <Suspense fallback={<LoadingFallback />}>
                          <Storage />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/storage/reports" element={
                    <Layout>
                      <ProtectedRoute requiredModule="storage">
                        <Suspense fallback={<LoadingFallback />}>
                          <StorageReports onBack={() => window.history.back()} />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/master-data" element={
                    <Layout>
                      <ProtectedRoute requiredModule="system">
                        <Suspense fallback={<LoadingFallback />}>
                          <MasterDataManagement />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="/account-settings" element={
                    <Layout>
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingFallback />}>
                          <AccountSettings />
                        </Suspense>
                      </ProtectedRoute>
                    </Layout>
                  } />
                  
                  <Route path="*" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <NotFound />
                    </Suspense>
                  } />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </MasterDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;