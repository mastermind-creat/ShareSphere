import { Share2 } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-primary p-2 rounded-lg">
        <Share2 className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold text-foreground tracking-tighter">ShareSphere</span>
    </div>
  );
}
