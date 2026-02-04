import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  icon?: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, onBack, icon, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="p-4 pt-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        {icon && <div className="text-white">{icon}</div>}
        <div>
          <h1 className="text-xl font-light tracking-[0.15em] uppercase text-white">{title}</h1>
          {subtitle && <p className="text-sm text-white/60 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
