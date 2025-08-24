import React, { createContext, useContext, useState, ReactNode } from 'react';

// Master Data Types
export interface MasterDataItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  order: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface MasterDataContextType {
  organizationTypes: MasterDataItem[];
  departments: MasterDataItem[];
  positions: MasterDataItem[];
  userRoles: MasterDataItem[];
  countries: MasterDataItem[];
  getActiveItems: (type: string) => MasterDataItem[];
}

// Initial master data
const initialOrganizationTypes: MasterDataItem[] = [
  { id: 1, code: "PUBLIC", name: "บริษัทมหาชน", description: "บริษัทจดทะเบียนในตลาดหลักทรัพย์", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "LIMITED", name: "บริษัทจำกัด", description: "บริษัทจำกัดทั่วไป", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "PARTNERSHIP", name: "ห้างหุ้นส่วน", description: "ห้างหุ้นส่วนจำกัด", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const initialDepartments: MasterDataItem[] = [
  { id: 1, code: "IT", name: "แผนกเทคโนโลยีสารสนเทศ", description: "จัดการระบบและเทคโนโลยี", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "HR", name: "แผนกทรัพยากรบุคคล", description: "จัดการบุคลากรและสวัสดิการ", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "FINANCE", name: "แผนกการเงิน", description: "จัดการเงินและบัญชี", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "MARKETING", name: "แผนกการตลาด", description: "จัดการการตลาดและประชาสัมพันธ์", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 5, code: "SALES", name: "แผนกขาย", description: "จัดการการขายและบริการลูกค้า", isActive: true, order: 5, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const initialPositions: MasterDataItem[] = [
  { id: 1, code: "CEO", name: "ประธานเจ้าหน้าที่บริหาร", description: "ผู้บริหารสูงสุด", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "MANAGER", name: "ผู้จัดการ", description: "ผู้จัดการระดับกลาง", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "SUPERVISOR", name: "หัวหน้างาน", description: "หัวหน้าทีมงาน", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "SENIOR_STAFF", name: "พนักงานอาวุโส", description: "พนักงานระดับอาวุโส", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 5, code: "STAFF", name: "พนักงาน", description: "พนักงานทั่วไป", isActive: true, order: 5, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const initialUserRoles: MasterDataItem[] = [
  { id: 1, code: "SUPER_ADMIN", name: "ผู้ดูแลระบบสูงสุด", description: "สิทธิ์เต็มทั้งระบบ", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "ORG_ADMIN", name: "ผู้ดูแลองค์กร", description: "จัดการผู้ใช้ในองค์กร", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "HR_MANAGER", name: "ผู้จัดการทรัพยากรบุคคล", description: "จัดการข้อมูลบุคลากร", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "DEPARTMENT_HEAD", name: "หัวหน้าแผนก", description: "จัดการผู้ใช้ในแผนก", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 5, code: "USER", name: "ผู้ใช้งานทั่วไป", description: "สิทธิ์การใช้งานพื้นฐาน", isActive: true, order: 5, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const initialCountries: MasterDataItem[] = [
  { id: 1, code: "TH", name: "ประเทศไทย", description: "Thailand", isActive: true, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 2, code: "US", name: "สหรัฐอเมริกา", description: "United States", isActive: true, order: 2, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 3, code: "JP", name: "ญี่ปุ่น", description: "Japan", isActive: true, order: 3, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 4, code: "SG", name: "สิงคโปร์", description: "Singapore", isActive: true, order: 4, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: 5, code: "MY", name: "มาเลเซีย", description: "Malaysia", isActive: true, order: 5, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export const MasterDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizationTypes] = useState<MasterDataItem[]>(initialOrganizationTypes);
  const [departments] = useState<MasterDataItem[]>(initialDepartments);
  const [positions] = useState<MasterDataItem[]>(initialPositions);
  const [userRoles] = useState<MasterDataItem[]>(initialUserRoles);
  const [countries] = useState<MasterDataItem[]>(initialCountries);

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
      default:
        return [];
    }
    
    return items.filter(item => item.isActive).sort((a, b) => a.order - b.order);
  };

  const value: MasterDataContextType = {
    organizationTypes,
    departments,
    positions,
    userRoles,
    countries,
    getActiveItems,
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