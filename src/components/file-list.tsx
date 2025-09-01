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
import { useAuth } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Skeleton } from './ui/skeleton';

export type File = {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: { seconds: number; nanoseconds: number; };
  url: string;
  ownerId: string;
};

export default function FileList() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setLoading(true);
      const q = query(collection(db, "files"), where("ownerId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userFiles: File[] = [];
        querySnapshot.forEach((doc) => {
          userFiles.push({ id: doc.id, ...doc.data() } as File);
        });
        setFiles(userFiles.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds));
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setFiles([]);
      setLoading(false);
    }
  }, [user]);

  const handleShare = (file: File) => {
    setSelectedFile(file);
    setIsShareDialogOpen(true);
  };

  const handleDelete = async (file: File) => {
    if (!user || user.uid !== file.ownerId) {
      toast({ variant: 'destructive', title: 'Error', description: 'You do not have permission to delete this file.' });
      return;
    }
    
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "files", file.id));
      
      // Delete from Storage
      const fileRef = ref(storage, `files/${user.uid}/${file.name}`);
      await deleteObject(fileRef);

      toast({ title: 'Success', description: 'File deleted successfully.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete the file.' });
      console.error("Error deleting file:", error);
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
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : files.length > 0 ? (
                  files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="hidden sm:table-cell">
                        <div className="bg-secondary p-2 rounded-md inline-flex">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{formatFileSize(file.size)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {format(new Date(file.createdAt.seconds * 1000), 'PPP')}
                      </TableCell>
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
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(file)} className="text-destructive cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No files uploaded yet.
                    </TableCell>
                  </TableRow>
                )}
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
