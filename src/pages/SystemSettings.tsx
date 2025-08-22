import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload } from 'lucide-react';
import { ServerManagement } from '@/components/system/ServerManagement';
import { BackupManagement } from '@/components/system/BackupManagement';
import { SecurityPolicyManagement } from '@/components/system/SecurityPolicyManagement';
import { CertificateManagement } from '@/components/system/CertificateManagement';
import { DropdownManagement } from '@/components/system/DropdownManagement';


export default function SystemSettings() {
  const [currentTab, setCurrentTab] = useState('servers');


  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">ตั้งค่าระบบและเซิร์ฟเวอร์</h1>
            <p className="text-muted-foreground">จัดการเซิร์ฟเวอร์ การสำรองข้อมูล และความปลอดภัย</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              ส่งออกการตั้งค่า
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              นำเข้าการตั้งค่า
            </Button>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="servers">เซิร์ฟเวอร์</TabsTrigger>
          <TabsTrigger value="backup">สำรองข้อมูล</TabsTrigger>
          <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
          <TabsTrigger value="certificates">ใบรับรอง</TabsTrigger>
          <TabsTrigger value="dropdowns">จัดการ Dropdown</TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-6">
          <ServerManagement />
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <BackupManagement />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityPolicyManagement />
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <CertificateManagement />
        </TabsContent>

        <TabsContent value="dropdowns" className="space-y-6">
          <DropdownManagement />
        </TabsContent>
      </Tabs>

    </div>
  );
}