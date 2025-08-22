-- =============================
-- COMPREHENSIVE DATABASE SCHEMA FOR ADMIN MANAGEMENT SYSTEM
-- Normalized relational database design with proper foreign keys and RLS
-- =============================

-- ===============================
-- CORE SYSTEM TABLES
-- ===============================

-- 1. Organizations (Master entity)
CREATE TABLE public.organizations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    website TEXT,
    tax_id TEXT,
    registration_number TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Organization Units/Departments
CREATE TABLE public.organization_units (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    parent_unit_id UUID REFERENCES public.organization_units(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    manager_user_id UUID, -- Will reference users table (added later)
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(organization_id, code)
);

-- 3. User Roles and Permissions System
CREATE TYPE public.app_role AS ENUM ('super_admin', 'organization_admin', 'manager', 'user', 'viewer');

CREATE TABLE public.roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    role_type public.app_role NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    is_system_role BOOLEAN NOT NULL DEFAULT false,
    permissions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. User Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    organization_unit_id UUID REFERENCES public.organization_units(id) ON DELETE SET NULL,
    employee_id TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    display_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    position TEXT,
    manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    avatar_url TEXT,
    bio TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    timezone TEXT DEFAULT 'Asia/Bangkok',
    language TEXT DEFAULT 'th',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(organization_id, employee_id)
);

-- 5. User Role Assignments
CREATE TABLE public.user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- ===============================
-- DOMAIN AND EMAIL MANAGEMENT
-- ===============================

-- 6. Domains
CREATE TABLE public.domains (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'expired', 'suspended')),
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    spf_enabled BOOLEAN NOT NULL DEFAULT false,
    dkim_enabled BOOLEAN NOT NULL DEFAULT false,
    dmarc_enabled BOOLEAN NOT NULL DEFAULT false,
    routing_enabled BOOLEAN NOT NULL DEFAULT false,
    mx_records JSONB DEFAULT '[]',
    spf_record TEXT,
    dkim_selector TEXT,
    dmarc_policy TEXT,
    max_mailboxes INTEGER DEFAULT 1000,
    max_aliases INTEGER DEFAULT 500,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Mailboxes
CREATE TABLE public.mailboxes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    local_part TEXT NOT NULL,
    full_address TEXT GENERATED ALWAYS AS (local_part || '@' || (SELECT name FROM public.domains WHERE id = domain_id)) STORED,
    display_name TEXT,
    password_hash TEXT,
    quota_mb INTEGER DEFAULT 1024,
    used_quota_mb INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'suspended')),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(domain_id, local_part)
);

-- ===============================
-- LICENSE MANAGEMENT
-- ===============================

-- 8. License Management
CREATE TABLE public.licenses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    license_key TEXT NOT NULL UNIQUE,
    product_name TEXT NOT NULL,
    license_type TEXT NOT NULL CHECK (license_type IN ('user_based', 'feature_based', 'concurrent', 'site_wide')),
    max_users INTEGER NOT NULL DEFAULT 0,
    features JSONB NOT NULL DEFAULT '[]',
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'revoked')),
    auto_renew BOOLEAN NOT NULL DEFAULT false,
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. License User Assignments
CREATE TABLE public.license_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    license_id UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    assigned_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(license_id, user_id)
);

-- 10. License Usage Logs
CREATE TABLE public.license_usage_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    license_id UUID NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    ip_address INET,
    user_agent TEXT,
    features_used JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===============================
-- CONTACT MANAGEMENT
-- ===============================

-- 11. Address Book/Contacts
CREATE TABLE public.contacts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    contact_type TEXT NOT NULL CHECK (contact_type IN ('personal', 'business', 'emergency')),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    email TEXT,
    phone TEXT,
    company TEXT,
    department TEXT,
    position TEXT,
    address TEXT,
    notes TEXT,
    tags JSONB DEFAULT '[]',
    is_vip BOOLEAN NOT NULL DEFAULT false,
    last_contact_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===============================
-- SECURITY AND POLICY MANAGEMENT
-- ===============================

-- 12. Security Policies
CREATE TABLE public.security_policies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    policy_type TEXT NOT NULL CHECK (policy_type IN ('firewall', 'ssl_tls', 'authentication', 'access_control', 'password', 'backup')),
    description TEXT,
    policy_rules JSONB NOT NULL DEFAULT '{}',
    applied_to JSONB DEFAULT '[]', -- Server IDs or scope
    status TEXT NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled', 'disabled')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    last_modified_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===============================
-- SYSTEM MANAGEMENT
-- ===============================

-- 13. Storage Management
CREATE TABLE public.storage_quotas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    quota_type TEXT NOT NULL CHECK (quota_type IN ('mailbox', 'file_storage', 'backup')),
    allocated_mb INTEGER NOT NULL DEFAULT 0,
    used_mb INTEGER NOT NULL DEFAULT 0,
    warning_threshold_mb INTEGER,
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 14. Billing and Payments
CREATE TABLE public.billing_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    account_name TEXT NOT NULL,
    billing_email TEXT NOT NULL,
    billing_address TEXT,
    payment_method TEXT CHECK (payment_method IN ('credit_card', 'bank_transfer', 'check', 'paypal')),
    currency TEXT NOT NULL DEFAULT 'THB',
    tax_rate DECIMAL(5,4) DEFAULT 0.07,
    payment_terms INTEGER DEFAULT 30, -- days
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 15. Master Data Types (for dropdowns, etc.)
CREATE TABLE public.master_data_types (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type_name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_system_type BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 16. Master Data Items
CREATE TABLE public.master_data_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type_id UUID NOT NULL REFERENCES public.master_data_types(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(type_id, organization_id, code)
);

-- ===============================
-- AUDIT AND LOGGING
-- ===============================

-- 17. Activity Logs
CREATE TABLE public.activity_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ===============================
-- INDEXES FOR PERFORMANCE
-- ===============================

-- Organizations indexes
CREATE INDEX idx_organizations_status ON public.organizations(status);
CREATE INDEX idx_organizations_type ON public.organizations(type);

-- Profiles indexes
CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_employee_id ON public.profiles(employee_id);

-- Domains indexes
CREATE INDEX idx_domains_organization_id ON public.domains(organization_id);
CREATE INDEX idx_domains_status ON public.domains(status);
CREATE INDEX idx_domains_expires_at ON public.domains(expires_at);

-- Licenses indexes  
CREATE INDEX idx_licenses_organization_id ON public.licenses(organization_id);
CREATE INDEX idx_licenses_status ON public.licenses(status);
CREATE INDEX idx_licenses_expiry_date ON public.licenses(expiry_date);

-- Contacts indexes
CREATE INDEX idx_contacts_organization_id ON public.contacts(organization_id);
CREATE INDEX idx_contacts_created_by ON public.contacts(created_by);
CREATE INDEX idx_contacts_type ON public.contacts(contact_type);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_organization_id ON public.activity_logs(organization_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_activity_logs_entity_type ON public.activity_logs(entity_type);

-- ===============================
-- UPDATE TRIGGERS
-- ===============================

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organization_units_updated_at BEFORE UPDATE ON public.organization_units FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mailboxes_updated_at BEFORE UPDATE ON public.mailboxes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON public.licenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_security_policies_updated_at BEFORE UPDATE ON public.security_policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_storage_quotas_updated_at BEFORE UPDATE ON public.storage_quotas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_billing_accounts_updated_at BEFORE UPDATE ON public.billing_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_master_data_items_updated_at BEFORE UPDATE ON public.master_data_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Fix foreign key reference for organization_units manager
ALTER TABLE public.organization_units ADD CONSTRAINT fk_organization_units_manager 
FOREIGN KEY (manager_user_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;