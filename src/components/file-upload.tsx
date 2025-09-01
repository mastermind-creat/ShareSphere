'use client';

import { UploadCloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';

export default function FileUpload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg border-border hover:border-primary transition-colors cursor-pointer bg-secondary/50">
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Any file type, up to 100MB
          </p>
          <Button className="mt-6">Browse Files</Button>
        </div>
      </CardContent>
    </Card>
  );
}
