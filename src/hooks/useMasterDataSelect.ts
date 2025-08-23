import { useMasterData } from '@/contexts/MasterDataContext';

export const useMasterDataSelect = () => {
  const { 
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
    getActiveItems 
  } = useMasterData();

  const getOptionsForSelect = (type: string) => {
    const items = getActiveItems(type);
    return items.map(item => ({
      value: item.code,
      label: item.name,
      labelEn: item.name_en || item.name
    }));
  };

  const getOrganizationTypeOptions = () => getOptionsForSelect('organizationTypes');
  const getDepartmentOptions = () => getOptionsForSelect('departments');
  const getPositionOptions = () => getOptionsForSelect('positions');
  const getUserRoleOptions = () => getOptionsForSelect('userRoles');
  const getCountryOptions = () => getOptionsForSelect('countries');
  const getContactTypeOptions = () => getOptionsForSelect('contactTypes');
  const getLicenseTypeOptions = () => getOptionsForSelect('licenseTypes');
  const getLicenseStatusOptions = () => getOptionsForSelect('licenseStatus');
  const getCurrencyOptions = () => getOptionsForSelect('currencies');
  const getLanguageOptions = () => getOptionsForSelect('languages');

  return {
    loading,
    getOrganizationTypeOptions,
    getDepartmentOptions,
    getPositionOptions,
    getUserRoleOptions,
    getCountryOptions,
    getContactTypeOptions,
    getLicenseTypeOptions,
    getLicenseStatusOptions,
    getCurrencyOptions,
    getLanguageOptions,
    // Raw data access
    organizationTypes,
    departments,
    positions,
    userRoles,
    countries,
    contactTypes,
    licenseTypes,
    licenseStatus,
    currencies,
    languages
  };
};