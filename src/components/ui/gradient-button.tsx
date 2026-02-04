import { forwardRef } from 'react';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'violet' | 'purple' | 'pink' | 'yellow' | 'rose';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variants = {
  violet: 'from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-violet-500/30',
  purple: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/30',
  pink: 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-500/30',
  yellow: 'from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 shadow-yellow-500/30',
  rose: 'from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-500/30',
};

const sizes = {
  sm: 'px-6 py-2 text-sm',
  md: 'px-12 py-4 text-base',
  lg: 'px-16 py-5 text-lg',
};

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ variant = 'violet', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`rounded-full bg-gradient-to-r ${variants[variant]} text-white font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GradientButton.displayName = 'GradientButton';
