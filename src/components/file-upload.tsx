'use client';

import { UploadCloud, File, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { db, storage } from '@/lib/firebase';
import { Progress } from './ui/progress';
import imageCompression from 'browser-image-compression';

export default function FileUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please select a file smaller than 100MB.',
        });
        return;
      }
      setSelectedFile(file);
    }
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

    let fileToUpload = selectedFile;
    
    // Compress image files
    if (selectedFile.type.startsWith('image/')) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(selectedFile, options);
      } catch (error) {
        console.error('Image compression error:', error);
        toast({
          variant: 'destructive',
          title: 'Compression Error',
          description: 'Could not compress the image file.',
        });
        // Continue with original file if compression fails
      }
    }

    const storageRef = ref(storage, `files/${user.uid}/${fileToUpload.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message,
        });
        setUploadProgress(null);
        setSelectedFile(null);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Save metadata to Firestore
        await addDoc(collection(db, "files"), {
          name: fileToUpload.name,
          size: fileToUpload.size,
          type: fileToUpload.type,
          url: downloadURL,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
        });

        toast({
          title: 'Upload Successful',
          description: `${fileToUpload.name} has been uploaded.`,
        });
        setUploadProgress(null);
        setSelectedFile(null);
      }
    );
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
             {uploadProgress !== null ? (
               <div className="space-y-2">
                 <Progress value={uploadProgress} />
                 <p className="text-sm text-center text-muted-foreground">{Math.round(uploadProgress)}% uploaded</p>
               </div>
             ) : (
                <Button onClick={handleUpload} className="w-full">
                  <UploadCloud className="mr-2" />
                  Upload
                </Button>
             )}
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
              <p className="mt-1 text-sm text-muted-foreground">
                Any file type, up to 100MB
              </p>
              <Button className="mt-6 pointer-events-none">Browse Files</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
