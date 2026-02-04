import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ModalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  theme?: 'violet' | 'purple' | 'pink' | 'yellow' | 'rose';
  maxHeight?: string;
}

const themeColors = {
  violet: 'from-violet-600 to-purple-600',
  purple: 'from-purple-600 to-indigo-600',
  pink: 'from-pink-600 to-rose-600',
  yellow: 'from-yellow-600 to-amber-600',
  rose: 'from-rose-600 to-pink-600',
};

export function ModalPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  theme = 'violet',
  maxHeight = 'max-h-[80vh]',
}: ModalPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full sm:max-w-2xl ${maxHeight} bg-[#0a0a12] sm:rounded-2xl rounded-t-3xl border border-white/10 flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className={`p-6 border-b border-white/10 bg-gradient-to-r ${themeColors[theme]}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {icon && <div className="text-white">{icon}</div>}
              <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                {subtitle && <p className="text-sm text-white/70 mt-1">{subtitle}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          {children}
        </ScrollArea>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-white/10 bg-[#0a0a12]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
