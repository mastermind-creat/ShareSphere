'use client';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, File as FileIcon, Image as ImageIcon, Video, Music, FileJson, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { listDriveFiles } from '@/app/actions/drive';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-6 w-6 text-muted-foreground" />;
    if (mimeType.startsWith('video/')) return <Video className="h-6 w-6 text-muted-foreground" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-6 w-6 text-muted-foreground" />;
    if (mimeType === 'application/json') return <FileJson className="h-6 w-6 text-muted-foreground" />;
    return <FileIcon className="h-6 w-6 text-muted-foreground" />;
};


export default function DriveFileList() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const fetchDriveFiles = async () => {
    if (!user || !userProfile?.driveAccessToken) {
        toast({
          variant: "destructive",
          title: "Google Drive Not Connected",
          description: "Please sign in with Google to view your Drive files.",
        });
        return;
    }
    setLoading(true);
    try {
        const result = await listDriveFiles();
        if(result.error) {
            toast({
                variant: "destructive",
                title: "Error fetching Drive files",
                description: result.error,
            });
            setFiles([]);
        } else {
            setFiles(result.files || []);
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "An unexpected error occurred while fetching Drive files.",
        });
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if(userProfile?.driveAccessToken) {
      fetchDriveFiles();
    }
  }, [userProfile?.driveAccessToken]);
  
  return (
    <>
      <Card>
        <CardHeader className='flex-row items-center justify-between'>
          <div>
            <CardTitle>Google Drive Files</CardTitle>
            <CardDescription>A preview of files from your connected Google Drive account.</CardDescription>
          </div>
          <Button onClick={fetchDriveFiles} disabled={loading || !userProfile?.driveAccessToken}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden sm:table-cell"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                       <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : files.length > 0 ? (
                  files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="hidden sm:table-cell">
                        <div className="bg-secondary p-2 rounded-md inline-flex">
                          {getFileIcon(file.mimeType)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        <Badge variant="outline">{file.mimeType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" disabled>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                     {userProfile?.driveAccessToken ? 'No files found in Google Drive.' : 'Connect your Google Drive account to see your files.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
