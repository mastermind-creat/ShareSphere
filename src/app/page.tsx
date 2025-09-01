import Header from '@/components/header';
import FileUpload from '@/components/file-upload';
import FileList from '@/components/file-list';

export default function Home() {
  // Mock data for files
  const files = [
    {
      id: '1',
      name: 'Project-Alpha-Proposal.pdf',
      size: '2.3 MB',
      uploadDate: '2023-10-26',
      url: 'https://example.com/file1.pdf',
    },
    {
      id: '2',
      name: 'Marketing-Campaign-Assets.zip',
      size: '15.1 MB',
      uploadDate: '2023-10-25',
      url: 'https://example.com/file2.zip',
    },
    {
      id: '3',
      name: 'Q3-Financial-Report.xlsx',
      size: '850 KB',
      uploadDate: '2023-10-24',
      url: 'https://example.com/file3.xlsx',
    },
     {
      id: '4',
      name: 'Website-Redesign-Mockups.fig',
      size: '32.5 MB',
      uploadDate: '2023-10-22',
      url: 'https://example.com/file4.fig',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
          <FileUpload />
          <FileList files={files} />
        </div>
      </main>
    </div>
  );
}
