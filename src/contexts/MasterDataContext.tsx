import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Master Data Types - Updated to match database structure
export interface MasterDataItem {
  id: string;
  code: string;
  name: string;
  name_en?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  type_id: string;
  organization_id?: string;
  created_at: string;
  updated_at: string;
}

interface MasterDataContextType {
  organizationTypes: MasterDataItem[];
  departments: MasterDataItem[];
  positions: MasterDataItem[];
  userRoles: MasterDataItem[];
  countries: MasterDataItem[];
  contactTypes: MasterDataItem[];
  licenseTypes: MasterDataItem[];
  licenseStatus: MasterDataItem[];
  currencies: MasterDataItem[];
  languages: MasterDataItem[];
  loading: boolean;
  getActiveItems: (type: string) => MasterDataItem[];
  getMasterDataByType: (typeName: string) => MasterDataItem[];
  refreshMasterData: () => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizationTypes, setOrganizationTypes] = useState<MasterDataItem[]>([]);
  const [departments, setDepartments] = useState<MasterDataItem[]>([]);
  const [positions, setPositions] = useState<MasterDataItem[]>([]);
  const [userRoles, setUserRoles] = useState<MasterDataItem[]>([]);
  const [countries, setCountries] = useState<MasterDataItem[]>([]);
  const [contactTypes, setContactTypes] = useState<MasterDataItem[]>([]);
  const [licenseTypes, setLicenseTypes] = useState<MasterDataItem[]>([]);
  const [licenseStatus, setLicenseStatus] = useState<MasterDataItem[]>([]);
  const [currencies, setCurrencies] = useState<MasterDataItem[]>([]);
  const [languages, setLanguages] = useState<MasterDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMasterDataByType = async (typeName: string): Promise<MasterDataItem[]> => {
    try {
      const { data: typeData, error: typeError } = await supabase
        .from('master_data_types')
        .select('id')
        .eq('type_name', typeName)
        .single();

      if (typeError || !typeData) {
        console.error(`Error fetching master data type ${typeName}:`, typeError);
        return [];
      }

      const { data: items, error: itemsError } = await supabase
        .from('master_data_items')
        .select('*')
        .eq('type_id', typeData.id)
        .order('sort_order');

      if (itemsError) {
        console.error(`Error fetching master data items for ${typeName}:`, itemsError);
        return [];
      }

      return items || [];
    } catch (error) {
      console.error(`Error in fetchMasterDataByType for ${typeName}:`, error);
      return [];
    }
  };

  const refreshMasterData = async () => {
    setLoading(true);
    try {
      const [
        orgTypesData,
        departmentsData,
        positionsData,
        userRolesData,
        countriesData,
        contactTypesData,
        licenseTypesData,
        licenseStatusData,
        currenciesData,
        languagesData
      ] = await Promise.all([
        fetchMasterDataByType('ประเภทองค์กร'),
        fetchMasterDataByType('แผนก'),
        fetchMasterDataByType('ตำแหน่ง'),
        fetchMasterDataByType('บทบาทผู้ใช้'),
        fetchMasterDataByType('ประเทศ'),
        fetchMasterDataByType('ประเภทของผู้ติดต่อ'),
        fetchMasterDataByType('ประเภทใบอนุญาต'),
        fetchMasterDataByType('สถานะใบอนุญาต'),
        fetchMasterDataByType('สกุลเงิน'),
        fetchMasterDataByType('ภาษา')
      ]);

      setOrganizationTypes(orgTypesData);
      setDepartments(departmentsData);
      setPositions(positionsData);
      setUserRoles(userRolesData);
      setCountries(countriesData);
      setContactTypes(contactTypesData);
      setLicenseTypes(licenseTypesData);
      setLicenseStatus(licenseStatusData);
      setCurrencies(currenciesData);
      setLanguages(languagesData);
    } catch (error) {
      console.error('Error refreshing master data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMasterData();
  }, []);

  const getActiveItems = (type: string): MasterDataItem[] => {
    let items: MasterDataItem[] = [];
    
    switch (type) {
      case 'organizationTypes':
        items = organizationTypes;
        break;
      case 'departments':
        items = departments;
        break;
      case 'positions':
        items = positions;
        break;
      case 'userRoles':
        items = userRoles;
        break;
      case 'countries':
        items = countries;
        break;
      case 'contactTypes':
        items = contactTypes;
        break;
      case 'licenseTypes':
        items = licenseTypes;
        break;
      case 'licenseStatus':
        items = licenseStatus;
        break;
      case 'currencies':
        items = currencies;
        break;
      case 'languages':
        items = languages;
        break;
      default:
        return [];
    }
    
    return items
      .filter(item => item.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  const getMasterDataByType = (typeName: string): MasterDataItem[] => {
    return getActiveItems(typeName);
  };

  const value: MasterDataContextType = {
    organizationTypes,
    departments,
    positions,
    userRoles,
    countries,
    contactTypes,
    licenseTypes,
    licenseStatus,
    currencies,
    languages,
    loading,
    getActiveItems,
    getMasterDataByType,
    refreshMasterData
  };

  return (
    <MasterDataContext.Provider value={value}>
      {children}
    </MasterDataContext.Provider>
  );
};

export const useMasterData = (): MasterDataContextType => {
  const context = useContext(MasterDataContext);
  if (context === undefined) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};