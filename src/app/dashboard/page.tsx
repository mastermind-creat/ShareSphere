'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File as FileIcon, MessageCircle, User as UserIcon } from 'lucide-react';
import FileUpload from '@/components/file-upload';
import FileList from '@/components/file-list';
import DriveFileList from '@/components/drive-file-list';
import { Separator } from '@/components/ui/separator';
import ChatPageContent from '@/components/dashboard/chat-page-content';
import ProfilePageContent from '@/components/dashboard/profile-page-content';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('files');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-fit">
        <TabsTrigger value="files">
          <FileIcon className="mr-2" />
          Files
        </TabsTrigger>
        <TabsTrigger value="chat">
          <MessageCircle className="mr-2" />
          Chat
        </TabsTrigger>
        <TabsTrigger value="profile">
          <UserIcon className="mr-2" />
          Profile
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="files" className="mt-6">
        <div className="space-y-8">
          <FileUpload />
          <FileList />
          <Separator />
          <DriveFileList />
        </div>
      </TabsContent>
      
      <TabsContent value="chat" className="mt-6">
        <ChatPageContent />
      </TabsContent>

      <TabsContent value="profile" className="mt-6">
        <ProfilePageContent />
      </TabsContent>
    </Tabs>
  );
}
