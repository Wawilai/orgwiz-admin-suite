import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  th: {
    // Header
    'header.title': 'ระบบจัดการองค์กร',
    'header.search': 'ค้นหา...',
    'header.profile': 'โปรไฟล์',
    'header.logout': 'ออกจากระบบ',
    
    // Account Settings
    'account.title': 'การตั้งค่าบัญชี',
    'account.profile': 'โปรไฟล์',
    'account.security': 'ความปลอดภัย',
    'account.notifications': 'การแจ้งเตือน',
    'account.preferences': 'การตั้งค่า',
    
    // Profile
    'profile.personalInfo': 'ข้อมูลส่วนตัว',
    'profile.firstName': 'ชื่อ',
    'profile.lastName': 'นามสกุล',
    'profile.email': 'อีเมล',
    'profile.phone': 'เบอร์โทรศัพท์',
    'profile.department': 'แผนก',
    'profile.position': 'ตำแหน่ง',
    'profile.saveProfile': 'บันทึกโปรไฟล์',
    
    // Security
    'security.title': 'ความปลอดภัย',
    'security.changePassword': 'เปลี่ยนรหัสผ่าน',
    'security.currentPassword': 'รหัสผ่านปัจจุบัน',
    'security.newPassword': 'รหัสผ่านใหม่',
    'security.confirmPassword': 'ยืนยันรหัสผ่าน',
    'security.updatePassword': 'อัปเดตรหัสผ่าน',
    'security.mfa': 'การยืนยันตัวตนแบบ Multi-Factor',
    'security.mfaEnabled': 'เปิดใช้งาน MFA',
    'security.mfaDisabled': 'ปิดใช้งาน MFA',
    'security.trustedDevices': 'อุปกรณ์ที่เชื่อถือได้',
    'security.loginHistory': 'ประวัติการเข้าสู่ระบบ',
    
    // Navigation
    'nav.dashboard': 'แดชบอร์ด',
    'nav.users': 'จัดการผู้ใช้',
    'nav.organizations': 'จัดการองค์กร',
    'nav.domains': 'จัดการโดเมน',
    'nav.roles': 'จัดการบทบาท',
    'nav.quotas': 'จัดการโควต้า',
    'nav.reports': 'รายงาน',
    'nav.settings': 'การตั้งค่าระบบ',
    
    // Common
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.add': 'เพิ่ม',
    'common.search': 'ค้นหา',
    'common.filter': 'กรอง',
    'common.export': 'ส่งออก',
    'common.import': 'นำเข้า',
    'common.active': 'ใช้งาน',
    'common.inactive': 'ไม่ใช้งาน',
    'common.loading': 'กำลังโหลด...',
    'common.language': 'ภาษา'
  },
  en: {
    // Header
    'header.title': 'Enterprise Management System',
    'header.search': 'Search...',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    
    // Account Settings
    'account.title': 'Account Settings',
    'account.profile': 'Profile',
    'account.security': 'Security',
    'account.notifications': 'Notifications',
    'account.preferences': 'Preferences',
    
    // Profile
    'profile.personalInfo': 'Personal Information',
    'profile.firstName': 'First Name',
    'profile.lastName': 'Last Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.department': 'Department',
    'profile.position': 'Position',
    'profile.saveProfile': 'Save Profile',
    
    // Security
    'security.title': 'Security',
    'security.changePassword': 'Change Password',
    'security.currentPassword': 'Current Password',
    'security.newPassword': 'New Password',
    'security.confirmPassword': 'Confirm Password',
    'security.updatePassword': 'Update Password',
    'security.mfa': 'Multi-Factor Authentication',
    'security.mfaEnabled': 'MFA Enabled',
    'security.mfaDisabled': 'MFA Disabled',
    'security.trustedDevices': 'Trusted Devices',
    'security.loginHistory': 'Login History',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.users': 'User Management',
    'nav.organizations': 'Organization Management',
    'nav.domains': 'Domain Management',
    'nav.roles': 'Role Management',
    'nav.quotas': 'Quota Management',
    'nav.reports': 'Reports',
    'nav.settings': 'System Settings',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.loading': 'Loading...',
    'common.language': 'Language'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('th');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['th']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}