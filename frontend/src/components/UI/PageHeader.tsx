interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  gradient?: 'amber' | 'purple' | 'blue' | 'green' | 'red';
}

export const PageHeader = ({ title, subtitle, icon, gradient = 'amber' }: PageHeaderProps) => {
  const gradientStyles = {
    amber: 'from-amber-400 via-amber-500 to-orange-500',
    purple: 'from-purple-400 via-purple-500 to-pink-500',
    blue: 'from-blue-400 via-blue-500 to-cyan-500',
    green: 'from-green-400 via-green-500 to-emerald-500',
    red: 'from-red-400 via-red-500 to-rose-500',
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br ${gradientStyles[gradient]} opacity-10 rounded-full blur-3xl`} />
        <div className={`absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br ${gradientStyles[gradient]} opacity-5 rounded-full blur-3xl`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center gap-4 mb-4">
          {icon && (
            <div className="w-24 h-24 lg:w-32 lg:h-32 flex items-center justify-center text-4xl lg:text-5xl shrink-0">
              {icon.length > 4 || icon.startsWith('/') || icon.startsWith('data:') ? (
                <img src={icon} alt={title} className="w-full h-full object-contain filter drop-shadow-xl" />
              ) : (
                icon
              )}
            </div>
          )}
          <div>
            <h1 className={`text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r ${gradientStyles[gradient]} bg-clip-text text-transparent`}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-400 text-lg mt-2">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

