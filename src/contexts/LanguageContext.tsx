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
    
    // Navigation
    'nav.dashboard': 'แดชบอร์ด',
    'nav.reports': 'รายงาน',
    'nav.users': 'จัดการผู้ใช้',
    'nav.organizations': 'จัดการองค์กร',
    'nav.organizationUnits': 'หน่วยงานย่อย',
    'nav.domains': 'จัดการโดเมน',
    'nav.roles': 'จัดการบทบาท',
    'nav.quotas': 'จัดการโควต้า',
    'nav.mailService': 'บริการเมล',
    'nav.mailRelay': 'เมลรีเลย์',
    'nav.addressBook': 'สมุดที่อยู่',
    'nav.calendar': 'ปฏิทิน',
    'nav.chat': 'แชท',
    'nav.meetings': 'การประชุม',
    'nav.storage': 'ที่เก็บข้อมูล',
    'nav.packages': 'จัดการแพ็คเกจ',
    'nav.billing': 'การเรียกเก็บเงิน',
    'nav.licenses': 'จัดการใบอนุญาต',
    'nav.settings': 'การตั้งค่าระบบ',
    
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
    'profile.organization': 'องค์กร',
    'profile.address': 'ที่อยู่',
    'profile.changeAvatar': 'เปลี่ยนรูปโปรไฟล์',
    'profile.avatarFormat': 'ไฟล์ JPG, PNG หรือ GIF ขนาดไม่เกิน 2MB',
    'profile.joinDate': 'วันที่เข้าร่วม',
    'profile.lastLogin': 'เข้าสู่ระบบล่าสุด',
    'profile.saveProfile': 'บันทึกโปรไฟล์',
    'profile.saveChanges': 'บันทึกการเปลี่ยนแปลง',
    'profile.verify': 'ยืนยัน',
    
    // Security
    'security.title': 'ความปลอดภัย',
    'security.passwordAuth': 'รหัสผ่านและการยืนยันตัวตน',
    'security.password': 'รหัสผ่าน',
    'security.passwordLastChanged': 'เปลี่ยนแปลงล่าสุด',
    'security.changePassword': 'เปลี่ยนรหัสผ่าน',
    'security.currentPassword': 'รหัสผ่านปัจจุบัน',
    'security.newPassword': 'รหัสผ่านใหม่',
    'security.confirmPassword': 'ยืนยันรหัสผ่านใหม่',
    'security.passwordRequirements': 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวอักษรใหญ่ เล็ก ตัวเลข และสัญลักษณ์',
    'security.updatePassword': 'อัปเดตรหัสผ่าน',
    'security.mfa': 'การรักษาความปลอดภัยสองขั้นตอน (MFA)',
    'security.mfaDescription': 'เพิ่มความปลอดภัยให้กับบัญชีด้วยการยืนยันตัวตนสองขั้นตอน',
    'security.mfaEnabled': 'เปิดใช้งาน',
    'security.mfaDisabled': 'ปิดใช้งาน',
    'security.loginNotifications': 'การแจ้งเตือนการเข้าสู่ระบบ',
    'security.sessionTimeout': 'หมดเวลาเซสชัน',
    'security.sessionTimeoutDescription': 'ระยะเวลาที่ไม่ได้ใช้งานก่อนออกจากระบบอัตโนมัติ',
    'security.trustedDevices': 'อุปกรณ์ที่เชื่อถือ',
    'security.loginHistory': 'ประวัติการเข้าสู่ระบบ',
    'security.current': 'ปัจจุบัน',
    'security.lastAccess': 'เข้าใช้ล่าสุด',
    'security.minutes15': '15 นาที',
    'security.minutes30': '30 นาที',
    'security.hour1': '1 ชั่วโมง',
    'security.hours2': '2 ชั่วโมง',
    'security.success': 'สำเร็จ',
    'security.failed': 'ล้มเหลว',
    
    // Sidebar Groups
    'sidebar.mainNavigation': 'เมนูหลัก',
    'sidebar.userManagement': 'จัดการผู้ใช้',
    'sidebar.services': 'บริการ',
    'sidebar.collaboration': 'การทำงานร่วมกัน',
    'sidebar.businessManagement': 'จัดการธุรกิจ',
    'sidebar.systemManagement': 'จัดการระบบ',
    
    // Common
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.add': 'เพิ่ม',
    'common.search': 'ค้นหา',
    'common.filter': 'กรอง',
    'common.export': 'ส่งออข',
    'common.import': 'นำเข้า',
    'common.active': 'ใช้งาน',
    'common.inactive': 'ไม่ใช้งาน',
    'common.loading': 'กำลังโหลด...',
    'common.language': 'ภาษา',
    'common.status': 'สถานะ',
    'common.actions': 'การดำเนินการ',
    'common.view': 'ดู',
    'common.close': 'ปิด',
    'common.confirm': 'ยืนยัน',
    'common.success': 'สำเร็จ',
    'common.error': 'ข้อผิดพลาด',
    'common.warning': 'คำเตือน'
  },
  en: {
    // Header
    'header.title': 'Enterprise Management System',
    'header.search': 'Search...',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.reports': 'Reports',
    'nav.users': 'User Management',
    'nav.organizations': 'Organization Management',
    'nav.organizationUnits': 'Organization Units',
    'nav.domains': 'Domain Management',
    'nav.roles': 'Role Management',
    'nav.quotas': 'Quota Management',
    'nav.mailService': 'Mail Service',
    'nav.mailRelay': 'Mail Relay',
    'nav.addressBook': 'Address Book',
    'nav.calendar': 'Calendar',
    'nav.chat': 'Chat',
    'nav.meetings': 'Meetings',
    'nav.storage': 'Storage',
    'nav.packages': 'Package Management',
    'nav.billing': 'Billing',
    'nav.licenses': 'License Management',
    'nav.settings': 'System Settings',
    
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
    'profile.organization': 'Organization',
    'profile.address': 'Address',
    'profile.changeAvatar': 'Change Profile Picture',
    'profile.avatarFormat': 'JPG, PNG or GIF file, maximum 2MB',
    'profile.joinDate': 'Join Date',
    'profile.lastLogin': 'Last Login',
    'profile.saveProfile': 'Save Profile',
    'profile.saveChanges': 'Save Changes',
    'profile.verify': 'Verify',
    
    // Security
    'security.title': 'Security',
    'security.passwordAuth': 'Password & Authentication',
    'security.password': 'Password',
    'security.passwordLastChanged': 'Last changed',
    'security.changePassword': 'Change Password',
    'security.currentPassword': 'Current Password',
    'security.newPassword': 'New Password',
    'security.confirmPassword': 'Confirm New Password',
    'security.passwordRequirements': 'Password must be at least 8 characters and contain uppercase, lowercase, numbers, and symbols',
    'security.updatePassword': 'Update Password',
    'security.mfa': 'Two-Factor Authentication (MFA)',
    'security.mfaDescription': 'Add extra security to your account with two-factor authentication',
    'security.mfaEnabled': 'Enabled',
    'security.mfaDisabled': 'Disabled',
    'security.loginNotifications': 'Login Notifications',
    'security.sessionTimeout': 'Session Timeout',
    'security.sessionTimeoutDescription': 'Time of inactivity before automatic logout',
    'security.trustedDevices': 'Trusted Devices',
    'security.loginHistory': 'Login History',
    'security.current': 'Current',
    'security.lastAccess': 'Last Access',
    'security.minutes15': '15 minutes',
    'security.minutes30': '30 minutes',
    'security.hour1': '1 hour',
    'security.hours2': '2 hours',
    'security.success': 'Success',
    'security.failed': 'Failed',
    
    // Sidebar Groups
    'sidebar.mainNavigation': 'Main Navigation',
    'sidebar.userManagement': 'System Management',
    'sidebar.services': 'Core Services',
    'sidebar.collaboration': 'Business & Accounting',
    'sidebar.businessManagement': 'Reports & Analytics',
    'sidebar.systemManagement': 'System Settings',
    
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
    'common.language': 'Language',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.view': 'View',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning'
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