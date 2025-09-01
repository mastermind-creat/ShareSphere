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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Link, QrCode, Trash2, File as FileIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ShareDialog from './share-dialog';

type File = {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  url: string;
};

type FileListProps = {
  files: File[];
};

export default function FileList({ files }: FileListProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleShare = (file: File) => {
    setSelectedFile(file);
    setIsShareDialogOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden sm:table-cell"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Size</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="bg-secondary p-2 rounded-md inline-flex">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{file.size}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{file.uploadDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleShare(file)} className="cursor-pointer">
                            <Link className="mr-2 h-4 w-4" />
                            <span>Share Link</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(file)} className="cursor-pointer">
                            <QrCode className="mr-2 h-4 w-4" />
                            <span>QR Code</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedFile && (
        <ShareDialog
          file={selectedFile}
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
        />
      )}
    </>
  );
}
