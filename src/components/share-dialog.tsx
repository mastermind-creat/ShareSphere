'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


type File = {
  name: string;
  url: string;
};

type ShareDialogProps = {
  file: File;
  isOpen: boolean;
  onClose: () => void;
};

export default function ShareDialog({ file, isOpen, onClose }: ShareDialogProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    file.url
  )}&size=200x200`;

  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(file.url);
    setHasCopied(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share "{file.name}"</DialogTitle>
          <DialogDescription>
            Anyone with the link can view this file.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          </TabsList>
          <TabsContent value="link">
            <div className="flex items-center space-x-2 pt-4">
              <Input id="link" value={file.url} readOnly />
              <Button size="icon" onClick={copyToClipboard}>
                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="qrcode">
            <div className="flex flex-col items-center justify-center pt-4 space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={200}
                  height={200}
                  data-ai-hint="qr code"
                />
              </div>
              <a href={qrCodeUrl} download={`qr-code-${file.name}.png`}>
                <Button variant="outline">Download QR Code</Button>
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
