import Header from '@/components/header';
import FileUpload from '@/components/file-upload';
import FileList from '@/components/file-list';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
          <FileUpload />
          <FileList />
        </div>
      </main>
    </div>
  );
}
