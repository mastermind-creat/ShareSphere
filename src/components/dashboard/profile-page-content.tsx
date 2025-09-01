'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Camera, HardDrive } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ProfilePageContent() {
  const { user, userProfile, updateUserProfile, loading } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username);
      setStatus(userProfile.status);
      setPhotoURL(userProfile.photoURL);
    }
  }, [userProfile]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      const fileName = `profile-pictures/${user.id}-${Date.now()}`;
      try {
        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });
        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData, error: urlError } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        if (urlError) throw urlError;

        setPhotoURL(urlData.publicUrl);
        await updateUserProfile({ photoURL: urlData.publicUrl });

        toast({
          title: 'Success',
          description: 'Profile picture updated successfully.',
        });
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Upload Error',
          description: error.message || 'Failed to upload profile picture.',
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile({ username, status });
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Update Error',
        description: error.message || 'Failed to update profile.',
      });
    }
  };

  if (loading || !userProfile) {
    return (
      <div className="max-w-2xl mx-auto">
         <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full" />
                </div>
                <div className="space-y-4">
                   <div className="space-y-2">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-10 w-full" />
                   </div>
                   <div className="space-y-2">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-20 w-full" />
                   </div>
                   <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information and settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32 cursor-pointer" onClick={handleAvatarClick}>
                  <AvatarImage src={photoURL} alt={username} />
                  <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />
               {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Textarea id="status" value={status} onChange={(e) => setStatus(e.target.value)} />
              </div>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
        <Separator />
        <CardFooter className="pt-6">
           <div className="space-y-4 w-full">
            <h3 className="text-lg font-medium">Integrations</h3>
             <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <HardDrive className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Google Drive</p>
                    <p className="text-sm text-muted-foreground">Connect your Google Drive to store files.</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => toast({ title: 'Coming Soon!', description: 'Google Drive integration is not yet available.'})}>Connect</Button>
             </div>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
