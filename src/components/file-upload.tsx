'use client';

import { UploadCloud, File, X, Server, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useRef } from 'react';
import { Progress } from './ui/progress';
import imageCompression from 'browser-image-compression';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { supabase } from '@/lib/supabase';

type StorageOption = 'supabase' | 'drive';

export default function FileUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [storageOption, setStorageOption] = useState<StorageOption>('supabase');

  const handleFileSelect = () => fileInputRef.current?.click();

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please select a file smaller than 100MB.',
      });
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'No file selected or user not logged in.',
      });
      return;
    }

    if (storageOption === 'drive') {
      toast({ title: 'Coming Soon!', description: 'Google Drive integration is not yet implemented.' });
      return;
    }

    let fileToUpload = selectedFile;

    // Compress image if applicable
    if (selectedFile.type.startsWith('image/')) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        fileToUpload = await imageCompression(selectedFile, options);
      } catch (err) {
        toast({ variant: 'destructive', title: 'Compression Error', description: 'Could not compress the image.' });
        console.error(err);
      }
    }

    try {
      const filePath = `${user.id}/${fileToUpload.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, fileToUpload, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('files').getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl;

      const { error: dbError } = await supabase
        .from('files')
        .insert([{ name: fileToUpload.name, size: fileToUpload.size, type: fileToUpload.type, url: publicUrl, owner_id: user.id, storage: 'supabase' }]);

      if (dbError) throw dbError;

      toast({ title: 'Upload Successful', description: `${fileToUpload.name} has been uploaded.` });
      setSelectedFile(null);
      setUploadProgress(null);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: err.message });
      setUploadProgress(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/50">
              <div className="flex items-center gap-4">
                <File className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Storage Destination</Label>
              <RadioGroup value={storageOption} onValueChange={(v: StorageOption) => setStorageOption(v)} className="flex gap-4">
                <Label htmlFor="supabase" className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer flex-1 justify-center data-[state=checked]:border-primary">
                  <RadioGroupItem value="supabase" id="supabase" />
                  <Server className="w-5 h-5 mr-2" />
                  Supabase Storage
                </Label>
                <Label htmlFor="drive" className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer flex-1 justify-center data-[state=checked]:border-primary">
                  <RadioGroupItem value="drive" id="drive" />
                  <HardDrive className="w-5 h-5 mr-2" />
                  Google Drive
                </Label>
              </RadioGroup>
            </div>

            <Button onClick={handleUpload} className="w-full">
              <UploadCloud className="mr-2" /> Upload
            </Button>
            {uploadProgress !== null && <Progress value={uploadProgress} />}
          </div>
        ) : (
          <>
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" />
            <div
              onClick={handleFileSelect}
              className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg border-border hover:border-primary transition-colors cursor-pointer bg-secondary/50"
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Any file type, up to 100MB</p>
              <Button className="mt-6 pointer-events-none">Browse Files</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
