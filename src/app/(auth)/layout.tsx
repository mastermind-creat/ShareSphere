import { Logo } from '@/components/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo />
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {children}
      </div>
    </div>
  );
}
