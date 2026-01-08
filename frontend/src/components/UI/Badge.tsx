interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'tier-s' | 'tier-a' | 'tier-b' | 'tier-c';
  size?: 'sm' | 'md';
}

export const Badge = ({ children, variant = 'default', size = 'sm' }: BadgeProps) => {
  const variantStyles = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'tier-s': 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20',
    'tier-a': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'tier-b': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'tier-c': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  );
};

