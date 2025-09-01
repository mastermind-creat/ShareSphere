'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, File as FileIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { FileSearchResult } from '@/ai/flows/search-files-flow';
import { searchFiles } from '@/ai/flows/search-files-flow';

export function AiSearch() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FileSearchResult[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    setIsDialogOpen(true);

    try {
      const searchResults = await searchFiles(query);
      setResults(searchResults);
    } catch (error) {
      console.error('AI search error:', error);
      toast({
        variant: 'destructive',
        title: 'Search Error',
        description: 'An error occurred while searching for files.',
      });
      setIsDialogOpen(false);
    } finally {
      setIsLoading(false);
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
      <form onSubmit={handleSearch} className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search files with AI..."
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
        </Button>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
            <DialogDescription>
              Showing results for: "{query}"
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-2 border rounded-lg">
                    <div className="bg-secondary p-2 rounded-md">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                        {file.name}
                      </a>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} - {file.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground p-8">
                No files found matching your query.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
