'use client';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, File as FileIcon, Image as ImageIcon, Video, Music, FileJson } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from './ui/badge';

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

const sampleDriveFiles: DriveFile[] = [
    {
      "id": "1glSQPbXLAwHCWHMvYwe38Rr1AGSI2imJ",
      "name": "applet_access_history.json",
      "mimeType": "application/json"
    },
    {
      "id": "1bqehTBLiOhimgDKgenWsO3gwHLSsXu1R",
      "name": "ShareSphere",
      "mimeType": "application/vnd.google-makersuite.applet+zip"
    },
    {
      "id": "1WtKXidaVNsxdFxIYXRNevucksa5gFgFG",
      "name": "MindSpark",
      "mimeType": "application/vnd.google-makersuite.applet+zip"
    },
    {
      "id": "1E30TclycdjZZauPP7OkLOZMY-ttZZ6uW",
      "name": "Wambia-Kennedy-Cover_Letter.pdf",
      "mimeType": "application/pdf"
    },
    {
      "id": "1xjwhWP11unhQ5P5YeaiFahAg8cCW84Xd",
      "name": "IMG_8781.JPG",
      "mimeType": "image/jpeg"
    }
];

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-6 w-6 text-muted-foreground" />;
    if (mimeType.startsWith('video/')) return <Video className="h-6 w-6 text-muted-foreground" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-6 w-6 text-muted-foreground" />;
    if (mimeType === 'application/json') return <FileJson className="h-6 w-6 text-muted-foreground" />;
    return <FileIcon className="h-6 w-6 text-muted-foreground" />;
};


export default function DriveFileList() {
  const [files] = useState<DriveFile[]>(sampleDriveFiles);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Google Drive Files</CardTitle>
          <CardDescription>This is a preview of files from your Google Drive.</CardDescription>
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
                {files.length > 0 ? (
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
                      No files found in Google Drive.
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
